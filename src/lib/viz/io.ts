import Papa from "papaparse";
import type { Dataset, Field, FieldType, Row } from "./types";

export const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_ROWS = 20000;

export class DataError extends Error {
  hint: string;
  constructor(message: string, hint: string) {
    super(message);
    this.hint = hint;
  }
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}([T ]|$)|^\d{1,2}\/\d{1,2}\/\d{2,4}$/;

/** Strip characters that spreadsheet apps treat as formulas, and cap cell length. */
export function sanitizeCell(v: unknown): string | number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  const s = String(v ?? "").slice(0, 300);
  return /^[=+\-@\t\r]/.test(s) && Number.isNaN(Number(s)) ? `'${s}` : s;
}

export function inferType(values: (string | number)[]): FieldType {
  const sample = values.filter((v) => v !== "" && v !== null && v !== undefined).slice(0, 200);
  if (!sample.length) return "category";
  const numeric = sample.filter((v) => typeof v === "number" || (v !== "" && Number.isFinite(Number(v)))).length;
  if (numeric / sample.length > 0.9) return "number";
  const dates = sample.filter((v) => DATE_RE.test(String(v))).length;
  if (dates / sample.length > 0.8) return "date";
  return "category";
}

export function framify(name: string, raw: Record<string, unknown>[]): Dataset {
  if (!raw.length) throw new DataError("That file has no rows.", "Make sure the first line contains column names and at least one row of data follows.");
  const keys = Object.keys(raw[0]).filter((k) => k.trim() !== "");
  if (!keys.length) throw new DataError("ChartWorld could not find any columns.", "Check that the file has a header row.");

  const rows: Row[] = raw.slice(0, MAX_ROWS).map((r) => {
    const out: Row = {};
    keys.forEach((k) => { out[k.trim()] = sanitizeCell(r[k]); });
    return out;
  });

  const fields: Field[] = keys.map((k) => {
    const key = k.trim();
    const type = inferType(rows.map((r) => r[key]));
    if (type === "number") rows.forEach((r) => { r[key] = Number(r[key]); });
    return { name: key, type };
  });

  return {
    id: `upload-${Date.now()}`,
    name,
    domain: "Your data",
    description: `${rows.length.toLocaleString()} rows · ${fields.length} columns, loaded in your browser.`,
    fields,
    rows,
    source: "upload",
  };
}

export async function parseFile(file: File): Promise<Dataset> {
  if (file.size > MAX_FILE_BYTES) {
    throw new DataError("Your dataset is too large for browser processing.",
      `Files must be under ${MAX_FILE_BYTES / 1024 / 1024} MB. Try filtering rows or exporting a sample first.`);
  }
  const text = await file.text();
  const name = file.name.replace(/\.(csv|json|tsv|txt)$/i, "");

  if (/\.json$/i.test(file.name)) {
    let parsed: unknown;
    try { parsed = JSON.parse(text); }
    catch { throw new DataError("ChartWorld could not read this file.", "The JSON is malformed — it must be an array of objects, for example [{\"a\": 1}]."); }
    const arr = Array.isArray(parsed) ? parsed : (parsed as { data?: unknown[] })?.data;
    if (!Array.isArray(arr)) throw new DataError("This JSON is not a table.", "Provide an array of flat objects with the same keys.");
    return framify(name, arr as Record<string, unknown>[]);
  }

  const res = Papa.parse<Record<string, unknown>>(text, { header: true, skipEmptyLines: true, dynamicTyping: true });
  if (res.errors.length && !res.data.length) {
    throw new DataError("ChartWorld could not read this file.", res.errors[0].message);
  }
  return framify(name, res.data);
}

export function parsePasted(text: string): Dataset {
  const res = Papa.parse<Record<string, unknown>>(text.trim(), { header: true, skipEmptyLines: true, dynamicTyping: true });
  if (!res.data.length) throw new DataError("Nothing to read yet.", "Paste comma-separated data with a header row on top.");
  return framify("Pasted data", res.data);
}

export function toCsv(rows: Record<string, unknown>[]) {
  return Papa.unparse(rows);
}
