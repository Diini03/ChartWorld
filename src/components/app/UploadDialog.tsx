import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadDataset, type Collection } from "@/lib/datasets";
import { UploadCloud } from "lucide-react";

export function UploadDialog({
  open, onOpenChange, collections,
}: {
  open: boolean; onOpenChange: (o: boolean) => void; collections: Collection[];
}) {
  const qc = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [collectionId, setCollectionId] = useState<string>("");
  const [busy, setBusy] = useState(false);

  function reset() {
    setFile(null); setName(""); setDescription(""); setTags(""); setCollectionId("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    try {
      await uploadDataset(file, {
        name: name || file.name,
        description,
        collection_id: collectionId || null,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      });
      toast.success("Dataset uploaded");
      qc.invalidateQueries({ queryKey: ["datasets"] });
      reset();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!busy) { onOpenChange(o); if (!o) reset(); } }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Upload a dataset</DialogTitle>
          <DialogDescription>CSV files. We'll parse it, count rows and detect columns.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <label
            htmlFor="file"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-surface-2/40 px-6 py-10 text-center hover:border-primary/50"
          >
            <UploadCloud className="text-muted-foreground" />
            <div className="text-sm">
              {file ? <span className="font-medium">{file.name}</span> : <>Click to choose a CSV, or drop it here.</>}
            </div>
            {file && <div className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</div>}
            <input
              id="file" type="file" accept=".csv,text/csv" className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) { setFile(f); if (!name) setName(f.name.replace(/\.csv$/i, "")); }
              }}
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="collection">Collection</Label>
              <select
                id="collection"
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-ring"
              >
                <option value="">None</option>
                {collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is this dataset? Where does it come from?" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="customers, clean, q4-2025" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={busy}>Cancel</Button>
            <Button type="submit" disabled={!file || busy}>{busy ? "Uploading…" : "Upload"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
