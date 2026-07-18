
# RaadRaac — Dataset Management Platform

A full rebuild. Two surfaces sharing one design system: a **marketing website** at the root and an **authenticated dataset workspace** at `/app`. Backed by Lovable Cloud for auth + storage + database.

## Scope (v1)

### Marketing site (public)
- `/` Home — nav, hero with app preview mock, trusted-by, problem, solution, features grid, workflow (RaadRaac → NadiifiData → XogArag), app preview, testimonials placeholder, pricing placeholder, FAQ, footer
- `/features` — deep dive on the 16 feature cards, grouped
- `/solutions` — analysts, researchers, students, NGOs, teams
- `/docs` — static docs shell with sidebar TOC and 4–5 seeded articles
- `/pricing` — 3-tier pricing UI only
- `/about` — mission, ecosystem, team placeholder
- `/contact` — contact form (UI only, toast on submit)
- `/auth` — sign up / sign in / forgot / reset (Lovable Cloud)

### Application (authenticated, at `/app`)
- **Shell**: left sidebar (Collections, Folders, Favorites, Recent, Archive), top bar (global search, upload, user menu), main area, optional right metadata panel
- **Library** `/app` — dataset grid + table toggle, filters, sort, tags
- **Collection view** `/app/collections/:id`
- **Folder view** `/app/folders/:id`
- **Dataset profile** `/app/datasets/:id` — header, description, owner, dates, tags, size, rows, cols, schema table, preview (first 50 rows), versions, notes, activity, actions (Download, Duplicate, Share, Open in NadiifiData, Delete)
- **Versions** — list + side-by-side compare (schema diff + row-count diff)
- **Search** — `⌘K` palette, global across name/tags/description/owner/collection/schema
- **Settings / Profile**

## Design system

Distinctive, not generic SaaS. Warm ivory light theme + deep slate dark theme, single expressive accent (electric coral `#FF5A36` or similar) with a secondary muted teal. Editorial serif for large display headings (e.g. Fraunces), geometric sans for UI (e.g. Geist / Inter Tight), JetBrains Mono for data. Generous spacing scale, hairline borders, soft layered shadows, rounded-xl cards, subtle grain texture on hero surfaces. All colors as HSL semantic tokens in `index.css`; both themes fully supported. Consistent motion: 150–250ms easings, scroll-reveal for marketing only, none in the app shell.

## Backend (Lovable Cloud)

Tables:
- `profiles` (id → auth.users, display_name, avatar_url)
- `collections` (id, owner_id, name, description, color, created_at)
- `folders` (id, owner_id, collection_id nullable, parent_id nullable, name)
- `datasets` (id, owner_id, collection_id, folder_id, name, description, tags text[], row_count, column_count, file_size, storage_path, current_version, is_favorite, created_at, updated_at)
- `dataset_versions` (id, dataset_id, version_number, storage_path, row_count, column_count, schema jsonb, change_note, created_by, created_at)
- `dataset_notes` (id, dataset_id, author_id, body, created_at)
- `activity` (id, dataset_id, actor_id, kind, payload jsonb, created_at)

RLS: owner-only reads/writes on all tables (v1 — collaboration/permissions are UI stubs). GRANTs to `authenticated` + `service_role` per platform rules. Storage bucket `datasets` (private) with owner-scoped policies. Auto-create `profiles` row via trigger on signup.

CSV parsing (rows/cols/schema inference) happens client-side on upload with Papa Parse; first 50 rows cached as JSON in `dataset_versions.schema` for preview.

## Tech notes

- Router restructured: public layout + `/app/*` authenticated layout guarded by session
- `useAuth()` hook wraps supabase-js; `onAuthStateChange` first, then `getUser` for trusted checks
- Zustand keeps UI state (sidebar, view mode, selection); server state via TanStack Query
- Command palette reused from current code, rewired to dataset search
- All existing lineage/pipelines/quality/etc. code is removed

## Delivery order

1. Wipe old feature routes, install deps (papaparse, date-fns already present), enable Lovable Cloud
2. Migrations + storage bucket + RLS
3. Design tokens + typography + shared primitives (Button, Card, Input, Badge tuned)
4. Marketing site (Home first, then remaining pages)
5. Auth pages + guarded `/app` shell
6. Library → Dataset profile → Versions → Search → Settings
7. Polish pass: empty states, loading skeletons, mobile, a11y sweep

## Out of scope for v1
- Real team collaboration / invites / permission editor (UI stubs only)
- Real "Open in NadiifiData" handoff (button + toast)
- Payments on pricing page
- Docs authoring (static content only)

Ready to build on approval.
