export function download(filename: string, content: BlobPart, mime: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function inlineStyles(svg: SVGElement) {
  const clone = svg.cloneNode(true) as SVGElement;
  const source = svg.querySelectorAll<HTMLElement>("*");
  const target = clone.querySelectorAll<HTMLElement>("*");
  source.forEach((node, i) => {
    const cs = getComputedStyle(node);
    const el = target[i];
    if (!el) return;
    ["fill", "stroke", "stroke-width", "opacity", "font-size", "font-family", "font-weight", "text-anchor"].forEach((p) => {
      const v = cs.getPropertyValue(p);
      if (v) el.style.setProperty(p, v);
    });
  });
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  return clone;
}

export function findSvg(container: HTMLElement | null): SVGElement | null {
  return container?.querySelector("svg") ?? null;
}

export function exportSvg(container: HTMLElement | null, name = "chartworld") {
  const svg = findSvg(container);
  if (!svg) throw new Error("This chart cannot be exported as SVG.");
  const markup = new XMLSerializer().serializeToString(inlineStyles(svg));
  download(`${name}.svg`, markup, "image/svg+xml;charset=utf-8");
}

export async function exportPng(container: HTMLElement | null, name = "chartworld", background = "#ffffff") {
  const svg = findSvg(container);
  if (!svg) throw new Error("This chart cannot be exported as PNG.");
  const rect = svg.getBoundingClientRect();
  const markup = new XMLSerializer().serializeToString(inlineStyles(svg));
  const img = new Image();
  const url = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(markup)))}`;
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Could not rasterise the chart."));
    img.src = url;
  });
  const scale = 2;
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, rect.width * scale);
  canvas.height = Math.max(1, rect.height * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  await new Promise<void>((resolve) =>
    canvas.toBlob((blob) => {
      if (blob) download(`${name}.png`, blob, "image/png");
      resolve();
    }, "image/png"),
  );
}
