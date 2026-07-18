import { supabase } from "@/integrations/supabase/client";
import Papa from "papaparse";

export type Dataset = {
  id: string;
  owner_id: string;
  collection_id: string | null;
  folder_id: string | null;
  name: string;
  description: string | null;
  tags: string[];
  row_count: number;
  column_count: number;
  file_size: number;
  storage_path: string | null;
  current_version: number;
  is_favorite: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
};

export type Collection = {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  color: string;
  created_at: string;
};

export type DatasetVersion = {
  id: string;
  dataset_id: string;
  version_number: number;
  storage_path: string | null;
  row_count: number | null;
  column_count: number | null;
  file_size: number | null;
  schema: any;
  preview: any;
  change_note: string | null;
  created_by: string | null;
  created_at: string;
};

export async function listDatasets(opts?: { favorites?: boolean; archived?: boolean; collection_id?: string }) {
  let q = supabase.from("datasets").select("*").order("updated_at", { ascending: false });
  if (opts?.favorites) q = q.eq("is_favorite", true);
  if (opts?.archived !== undefined) q = q.eq("is_archived", opts.archived);
  else q = q.eq("is_archived", false);
  if (opts?.collection_id) q = q.eq("collection_id", opts.collection_id);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Dataset[];
}

export async function getDataset(id: string) {
  const { data, error } = await supabase.from("datasets").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as Dataset | null;
}

export async function listVersions(dataset_id: string) {
  const { data, error } = await supabase.from("dataset_versions").select("*")
    .eq("dataset_id", dataset_id).order("version_number", { ascending: false });
  if (error) throw error;
  return (data ?? []) as DatasetVersion[];
}

export async function listCollections() {
  const { data, error } = await supabase.from("collections").select("*").order("created_at");
  if (error) throw error;
  return (data ?? []) as Collection[];
}

export async function createCollection(name: string) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Not signed in");
  const { data, error } = await supabase.from("collections").insert({ name, owner_id: u.user.id }).select().single();
  if (error) throw error;
  return data as Collection;
}

export async function toggleFavorite(id: string, value: boolean) {
  const { error } = await supabase.from("datasets").update({ is_favorite: value }).eq("id", id);
  if (error) throw error;
}

export async function updateDataset(id: string, patch: Partial<Dataset>) {
  const { error } = await supabase.from("datasets").update(patch as any).eq("id", id);
  if (error) throw error;
}

export async function deleteDataset(id: string) {
  const { error } = await supabase.from("datasets").delete().eq("id", id);
  if (error) throw error;
}

/** Parse a CSV file client-side and extract schema, preview and counts. */
export function parseCsv(file: File): Promise<{
  columns: { name: string; type: string }[];
  preview: any[];
  rowCount: number;
}> {
  return new Promise((resolve, reject) => {
    const preview: any[] = [];
    let rowCount = 0;
    let columns: { name: string; type: string }[] = [];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      step: (row) => {
        rowCount++;
        if (preview.length < 50) preview.push(row.data);
        if (columns.length === 0 && row.meta?.fields) {
          const sample = row.data as Record<string, any>;
          columns = row.meta.fields.map((f) => ({ name: f, type: inferType(sample[f]) }));
        }
      },
      complete: () => resolve({ columns, preview, rowCount }),
      error: reject,
    });
  });
}

function inferType(v: any): string {
  if (v === null || v === undefined || v === "") return "text";
  const s = String(v).trim();
  if (/^-?\d+$/.test(s)) return "integer";
  if (/^-?\d+\.\d+$/.test(s)) return "number";
  if (/^(true|false)$/i.test(s)) return "boolean";
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return "date";
  return "text";
}

/** Upload a CSV file, create a dataset row and its version 1. */
export async function uploadDataset(file: File, opts: { name: string; description?: string; collection_id?: string | null; tags?: string[] }) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Not signed in");
  const user_id = u.user.id;

  const parsed = await parseCsv(file);
  const path = `${user_id}/${crypto.randomUUID()}-${file.name}`;
  const { error: upErr } = await supabase.storage.from("datasets").upload(path, file, {
    cacheControl: "3600", upsert: false, contentType: file.type || "text/csv",
  });
  if (upErr) throw upErr;

  const { data: ds, error: dsErr } = await supabase.from("datasets").insert({
    owner_id: user_id,
    collection_id: opts.collection_id ?? null,
    name: opts.name,
    description: opts.description ?? null,
    tags: opts.tags ?? [],
    row_count: parsed.rowCount,
    column_count: parsed.columns.length,
    file_size: file.size,
    storage_path: path,
    current_version: 1,
  }).select().single();
  if (dsErr) throw dsErr;

  const { error: verErr } = await supabase.from("dataset_versions").insert({
    dataset_id: ds.id,
    version_number: 1,
    storage_path: path,
    row_count: parsed.rowCount,
    column_count: parsed.columns.length,
    file_size: file.size,
    schema: parsed.columns,
    preview: parsed.preview,
    change_note: "Initial version",
    created_by: user_id,
  });
  if (verErr) throw verErr;

  await supabase.from("activity").insert({ dataset_id: ds.id, actor_id: user_id, kind: "created", payload: { name: opts.name } });

  return ds as Dataset;
}

export async function downloadDataset(path: string) {
  const { data, error } = await supabase.storage.from("datasets").createSignedUrl(path, 60);
  if (error) throw error;
  window.open(data.signedUrl, "_blank");
}

export function formatBytes(n: number) {
  if (!n) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0; let v = n;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(v < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}
