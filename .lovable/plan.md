
# RaadRaac v1.1 — Hardening, UX Polish & Empty-Module Fill

Right now the shell, lineage, datasets, search and command palette work, but seven routes still render "coming soon" placeholders, and there are real bugs across responsiveness, layout persistence, keyboard flow, and small visual glitches. This pass acts on the whole surface like a v1.1 release — no new stack, just craftsmanship.

## Goals

1. Fix concrete bugs (see list below).
2. Replace every EmptyModule with a real, believable screen driven by existing mock data.
3. Sharpen UX affordances (responsive shell, focus, a11y, empty/skeleton/error states).
4. Keep it frontend-only. No backend.

## Bugs to fix

- **`h-screen` on AppShell** breaks on mobile browser chrome → switch to `h-dvh`.
- **`useHotkeys` interferes with typing**: `mod+b/i/j` fire even inside inputs → guard by active element (already partial for `mod+k` only in palette).
- **Panel layout state** is duplicated between Zustand `persist` and `react-resizable-panels` `autoSaveId` → single source of truth (drop `autoSaveId`, drive from store) so collapse/restore is stable.
- **Inspector auto-opens on any selectNode** even when user just closed it → only open on explicit user intent (double-click / dedicated action), respect closed state.
- **Theme toggle**: on first load `initTheme` writes both `dark` and `light` classes; also no system-preference fallback.
- **Lineage `useLineageGraph`** recomputes on every filter object identity change even when unchanged → memoize sets properly; recursive `walkUp/walkDown` can stack-overflow on cycles → convert to iterative BFS with visited set.
- **Datasets keyboard nav** binds a `window` keydown that also fires when palette is open → check `paletteOpen` and `document.activeElement`.
- **Command palette**: no result-empty state, no recent items, `Escape` doesn't clear query.
- **TopBar search** is decorative only → wire to `useCatalogSearch` and open palette pre-filled.
- **A11y**: icon-only buttons in TopBar / SideNav / Inspector missing `aria-label`; graph nodes not focusable; `<main>` exists but no skip-link.
- **NotFound** doesn't render inside AppShell chrome consistently — verify and fix.
- **Favicon + document title** — confirm meta is set for RaadRaac, not Lovable default.

## New screens (replace EmptyModule)

Driven entirely by the existing `service` mock layer, extended where needed.

1. **`/schema` — Schema Explorer**  
   Two-pane: left virtualized tree of `database → schema → table`, right column list with type, PK/FK/nullable badges, distinct count sparkline. Filter box, "Copy DDL" action.

2. **`/column-lineage` — Column Lineage**  
   Dataset + column picker in header; ReactFlow subgraph showing only edges touching that column across upstream transformations. Reuses `CatalogFlowNode` in a compact variant.

3. **`/pipelines` — Pipeline Viewer**  
   List of pipelines with last-run status, avg duration sparkline, next-run ETA. Selecting one opens a right-side run-history timeline (Gantt-ish bars per task) using mock runs.

4. **`/quality` — Data Quality**  
   Grid of quality checks (freshness / completeness / uniqueness / row count) grouped by dataset. Pass/warn/fail pills, 30-day trend sparkline, "last failure" excerpt.

5. **`/alerts` — Alerts**  
   Rule list with severity, channel (Slack/PagerDuty/Email icons), mute toggle, last-fired timestamp. Detail drawer shows fire history.

6. **`/versions` — Version History**  
   Timeline per dataset of schema versions (added / removed / retyped columns). Two-column diff view when a version is selected.

7. **`/settings` — Settings**  
   Real settings surface: Appearance (theme, density), Keyboard shortcuts reference, Workspace (name, timezone), Integrations (mock toggles), About. Non-functional writes but persisted in Zustand.

Each screen ships with: proper header, empty state when filtered to nothing, skeleton on first mount, keyboard nav where a list exists.

## Shell polish

- Responsive: below `md`, collapse SideNav to icon rail, hide Inspector by default, Activity becomes a sheet.
- Add breadcrumbs in TopBar tied to route.
- Add a subtle "syncing…" indicator in TopBar (fake 2s pulse on route change) — sells the "real app" feel.
- Global toast on ⌘K discoverability the first time.
- Focus-visible ring audit across all interactive components using `focus-ring` token.

## Mock data additions

Extend `src/lib/mock/` with: pipeline runs (last 20 per pipeline), quality checks + 30-day history, alert rules + fire history, schema versions per dataset, deterministic seeding so reloads are stable.

## Tech notes

- No new dependencies. Reuse `reactflow`, `@tanstack/react-virtual`, `recharts`, `cmdk`, existing shadcn primitives.
- Split any file over ~250 lines.
- New files under existing feature folders: `src/features/schema/`, `src/features/columnLineage/`, `src/features/pipelines/`, `src/features/quality/`, `src/features/alerts/`, `src/features/versions/`, `src/features/settings/`.
- Update `App.tsx` routes to point to real screens; keep `EmptyModule` around for future stubs but unused.
- Verify with a Playwright pass across all routes: no console errors, no layout overflow at 375/768/1280.

## Out of scope

- Real backend / Lovable Cloud.
- Auth.
- Real column-level parsing (mock only).
- Persistence beyond `localStorage`.
