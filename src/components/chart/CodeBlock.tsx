import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function CodeBlock({ code, language = "python", library, note }: { code: string; language?: string; library?: string; note?: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-[hsl(240_15%_9%)] text-[hsl(40_30%_96%)] shadow-md">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest">{language}</span>
          {library && <span className="rounded-md bg-[hsl(var(--chart-1)/0.3)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-white">{library}</span>}
        </div>
        <button
          onClick={onCopy}
          className={cn("flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors", copied ? "text-[hsl(var(--chart-5))]" : "text-white/70 hover:bg-white/10 hover:text-white")}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed"><code>{code}</code></pre>
      {note && <div className="border-t border-white/10 px-4 py-2 text-xs text-white/60">{note}</div>}
    </div>
  );
}
