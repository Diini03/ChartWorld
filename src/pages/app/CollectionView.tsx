import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listDatasets, listCollections } from "@/lib/datasets";
import { Link } from "react-router-dom";

export default function CollectionView() {
  const { id = "" } = useParams();
  const { data: collections = [] } = useQuery({ queryKey: ["collections"], queryFn: listCollections });
  const { data: datasets = [] } = useQuery({
    queryKey: ["datasets", { collection_id: id }],
    queryFn: () => listDatasets({ collection_id: id }),
  });
  const collection = collections.find((c) => c.id === id);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Collection</p>
      <h1 className="mt-1 font-display text-4xl">{collection?.name ?? "Collection"}</h1>
      {collection?.description && <p className="mt-2 text-muted-foreground">{collection.description}</p>}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {datasets.map((d) => (
          <Link key={d.id} to={`/app/datasets/${d.id}`} className="rounded-2xl border border-border bg-surface p-5 shadow-soft hover:shadow-card">
            <h3 className="font-medium">{d.name}</h3>
            <p className="mt-1 text-xs font-mono text-muted-foreground">v{d.current_version} · {d.row_count.toLocaleString()} rows</p>
          </Link>
        ))}
        {datasets.length === 0 && <div className="col-span-full text-sm text-muted-foreground">No datasets in this collection yet.</div>}
      </div>
    </div>
  );
}
