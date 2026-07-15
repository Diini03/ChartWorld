# RaadRaac — v1 Build Plan

Replace the current HIBER Industries site entirely with **RaadRaac**, a data lineage & observability workspace. The product IS the homepage — no marketing pages, no hero, no footer. When the app opens, users land inside the workspace.

## 1. What gets removed
- All HIBER pages: `Index`, `About`, `Services`, `Projects`, `Training`, `Contact`
- Layout wrappers: `components/layout/Navbar.tsx`, `Footer.tsx`, `Layout.tsx`
- `components/NavLink.tsx`
- HIBER assets in `src/assets/` (gate, trailers, steel-table, agricultural-equipment, desk-design, industrial-structure, services-collage, training-workshop, logo-transparent, logo-with-bg)
- Reset `src/App.css`, `index.html` title/meta to RaadRaac
- Routes rewritten in `App.tsx`

Old memories about "5 independent HIBER pages" and "HIBER frontend-only scope" are obsolete after this — I'll note that in the response, not the plan.

## 2. Visual system (Linear-esque, neutral)
Rewrite `src/index.css` + `tailwind.config.ts` around HSL tokens only.

- Type: **IBM Plex Sans** (UI), **JetBrains Mono** (code, IDs, schemas)
- Radius: 6px default, 8px panels
- 8pt spacing grid enforced through Tailwind defaults
- Palette (tokens, both themes):
  - `--background`, `--surface` (panels), `--surface-2` (nested), `--border`, `--border-strong`
  - `--foreground`, `--muted-foreground`, `--subtle-foreground`
  - `--accent` deep indigo `243 75% 59%`, `--accent-foreground`
  - Signal: `--success` `142 55% 42%`, `--warning` `35 90% 55%`, `--danger` `0 72% 55%`, `--info` `210 90% 58%`
  - Node-type tints for the graph: dataset / pipeline / transformation / dashboard / report / api / database / storage
- Dark mode is default. Light mode via `class="light"` on `<html>`, toggled from settings menu.
- No gradients, no glassmorphism, no decorative shapes.

## 3. Application shell
New `src/app/shell/AppShell.tsx` — the only layout. Uses `react-resizable-panels`.

```text
+----------------------------------------------------------+
| TopBar: breadcrumb · global search · Ctrl+K · user menu  |
+--------+------------------------------------+------------+
| Side   |                                    |  Inspector |
| Nav    |         Main canvas                |  (context) |
|        |                                    |            |
+--------+------------------------------------+------------+
|  Activity timeline (collapsible bottom drawer)           |
+----------------------------------------------------------+
```

- **SideNav** (`w-56`, collapsible to `w-14` icon rail): Lineage, Datasets, Schema Explorer, Column Lineage, Pipelines, Data Quality, Alerts, Activity, Version History, Settings. Workspace switcher at top, user chip at bottom.
- **TopBar** (`h-11`): breadcrumb + inline search input (opens palette on focus) + keyboard hint `⌘K` + theme toggle + avatar.
- **Inspector**: right panel, resizable, shows context for the selected node/row. Empty state when nothing selected.
- **Activity drawer**: bottom, default 220px, collapsible.
- Panel sizes persisted to `localStorage` via a small `usePanelLayout` hook.

## 4. Routes
`App.tsx` renders `AppShell` with nested routes:

- `/` → `LineageWorkspace` (the graph — this is the landing surface)
- `/datasets` → `DatasetsIndex` (virtualized table)
- `/datasets/:id` → same table + inspector auto-selects
- `/schema`, `/column-lineage`, `/pipelines`, `/quality`, `/alerts`, `/activity`, `/versions`, `/settings` → real routes with polished **empty states** (icon, one-line description, "coming in next iteration", a couple of disabled example rows). No 404 feel.
- `*` → NotFound styled to match the shell.

## 5. Lineage graph (core module)
`src/features/lineage/`. Built on `reactflow`.

- Node types: `DatasetNode`, `PipelineNode`, `TransformationNode`, `DashboardNode`, `ReportNode`, `ApiNode`, `DatabaseNode`, `StorageNode`. Each: icon (lucide), name, subtext (owner/schema), status dot (ok/warn/fail), tag chip. Distinct border/tint per type using the node-type tokens.
- Custom edge with subtle arrowhead, animated only on hover.
- Interactions: pan, zoom, fit-view, select. Selecting a node **highlights upstream in indigo and downstream in amber**, dims the rest to 20% opacity. Double-click expands/collapses grouped upstream chain.
- Controls: bottom-left zoom/fit/lock; top-right filter chips (node type, status, owner); minimap bottom-right.
- Selecting a node populates the right Inspector and pushes an entry to activity timeline (client-side event).
- Sample graph: ~40 nodes across all types wired into a realistic ETL: `raw.orders` → `stg_orders` transform → `mart_revenue_daily` → `Revenue Dashboard`, etc.

## 6. Datasets module
`src/features/datasets/`.

- **Index**: virtualized table (`@tanstack/react-virtual`) with columns: Name, Owner, Type, Rows, Freshness, Quality score (colored bar 0–100), Tags, Updated. Row click opens Inspector; keyboard nav (`↑/↓`, `Enter`).
- **Inspector (dataset)** with tabs:
  - *Overview* — description, owner, source system, tags, quality score, freshness, row count.
  - *Schema* — column list (name, type badge, nullable, PK/FK, description).
  - *Dependencies* — upstream / downstream lists with node-type icons; clicking jumps to graph with that node selected.
  - *Quality* — sparkline of quality score (recharts), current checks (missing values, schema drift, freshness, duplicates) with pass/warn/fail badges.
  - *History* — version list; each version shows diff summary (`+2 columns`, `−1 column`, `type changed`).
  - *Activity* — filtered activity feed for this dataset.

## 7. Search (global, instant)
`src/features/search/useCatalogSearch.ts`. In-memory fuzzy match (`fuse.js`) across datasets, columns, pipelines, reports, tags, users. Grouped results with type badge. Powers both TopBar input and the command palette.

## 8. Command palette (⌘K / Ctrl K)
`src/features/palette/` using `cmdk`.

- Opens over the shell with a scrim.
- Sections: Search results (live) · Navigation (jump to any module) · Datasets (recent) · Pipelines · Actions (toggle theme, collapse sidebar, focus graph, copy dataset ID).
- Full keyboard control; `Esc` closes; arrow keys select; `Enter` runs.
- Registered globally with a `useHotkeys` hook (Ctrl/Cmd+K, also `⌘/` for search focus, `[` `]` to collapse side panels).

## 9. Activity timeline
Bottom drawer. GitHub-commit-style rows: avatar · actor · verb · object · relative time. Types: dataset created, schema updated, pipeline executed, quality failed, alert triggered, report generated. Filter chips (All, Quality, Pipelines, Schema). Click a row → focuses related node in graph.

## 10. Mock data layer
`src/lib/mock/` — typed fixtures behind a service API so it can later swap to a real backend without touching components.

- `types.ts` — `Dataset`, `Column`, `Pipeline`, `Edge`, `QualityCheck`, `ActivityEvent`, `Version`, `User`.
- `catalog.ts` — ~40 datasets, ~15 pipelines, ~10 reports/dashboards, edges, 90 days of quality history, 200 activity events, 8 users.
- `service.ts` — `getGraph()`, `listDatasets()`, `getDataset(id)`, `search(q)`, `listActivity(filter)`, `getVersions(id)`. All sync/promise-based to mimic a real API.

## 11. Reusable UI primitives
`src/components/ui/` (extend existing shadcn):
- `Panel`, `PanelHeader`, `PanelToolbar`
- `Kbd` (keyboard shortcut chip)
- `StatusDot`, `QualityBar`, `TypeBadge`, `TagChip`
- `EmptyState`, `Skeleton` variants for graph/table/inspector
- `Sparkline` wrapper over recharts

Every screen uses these — no bespoke one-offs.

## 12. Feedback + polish
- `sonner` toasts for actions (already in project).
- Skeletons on first load of graph/table.
- Focus rings via `--ring`.
- `Undo` toast on destructive-ish actions (e.g., collapse group).
- Autosave indicator in TopBar (mock).

## 13. Responsiveness
- Desktop / laptop: full shell.
- Tablet (`<1024px`): right Inspector becomes an overlay drawer; side nav auto-collapses to icons.
- Mobile (`<640px`): side nav becomes a Sheet, inspector and activity become full-screen sheets triggered from TopBar icons. Graph gets touch pan/pinch.

## 14. Accessibility
Keyboard-first everywhere. ARIA labels on all icon buttons. Visible focus rings. `role="application"` on the graph with instructions in an `aria-describedby`. Contrast checked against tokens (dark and light).

## 15. Technical section

**Dependencies to add**: `reactflow`, `cmdk`, `react-resizable-panels`, `@tanstack/react-virtual`, `fuse.js`, `zustand` (shell/panel state). Already present: `lucide-react`, `sonner`, `recharts`, `react-router-dom`, shadcn.

**Folder structure**
```text
src/
  app/shell/            AppShell, SideNav, TopBar, Inspector, ActivityDrawer
  features/
    lineage/            graph, nodes, edges, hooks
    datasets/           index table, inspector tabs
    search/             hook, results renderer
    palette/            CommandPalette, actions registry
    activity/           timeline, event renderer
  components/ui/        shared primitives (extends shadcn)
  lib/
    mock/               types, catalog, service
    hooks/              useHotkeys, usePanelLayout, useTheme
    utils/
  pages/                thin route components that mount features
  App.tsx  main.tsx  index.css
```

**State**: `zustand` for UI shell state (panel sizes, selected node, palette open, theme). React Query kept for the mock service so the swap to a real API is trivial.

**Build order**
1. Wipe HIBER, reset tokens, install deps, set fonts.
2. Ship `AppShell` with empty panels and routing.
3. Mock data + service.
4. Lineage graph with node highlighting and Inspector wiring.
5. Datasets table + Inspector tabs.
6. Global search + Command palette + hotkeys.
7. Activity drawer + empty-state screens for remaining modules.
8. Theme toggle, responsive pass, a11y pass, skeletons.

Not in v1 (explicit deferrals): real column-lineage graph, pipeline runs viewer, quality rule editor, alerts config, version diff UI, settings forms, auth. Each has a proper empty state so nothing feels broken.