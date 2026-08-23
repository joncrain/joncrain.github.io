# Backyard Idea Board Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Backyard redo project idea board (Existing / Inspiration / Concepts) inside `/house` Projects, plus a token-only share page for the landscaper.

**Architecture:** File-based `ideas.ts` + images under `public/house/ideas/backyard/`. Projects tab opens a detail view with `ProjectIdeaBoard` + lightbox. Share route `/house/share/backyard?token=` gated by `HOUSE_IDEAS_TOKEN` (ICS pattern).

**Tech Stack:** Astro 7, React 19, TypeScript data, Cloudflare Workers, existing house auth/UI tokens.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-23-backyard-idea-board-design.md`
- File-based captions/photos; no in-browser editor
- Sections: existing | inspiration | concepts
- Share: token query only; board-only UI; noindex
- Preserve house visual tokens; caption under image, not overlaid
- Branch: `feat/backyard-idea-board`

## File map

| File | Responsibility |
| --- | --- |
| `src/data/house/types.ts` | Idea types |
| `src/data/house/projects.ts` | Add backyard-redo |
| `src/data/house/ideas.ts` | Board + photos |
| `public/house/ideas/backyard/*` | Web images |
| `ProjectsTab.tsx` | List ↔ detail |
| `ProjectIdeaBoard.tsx` | Sections + grid |
| `PhotoLightbox.tsx` | Lightbox |
| `HouseApp.tsx` | Pass share URL prop |
| `pages/house/index.astro` | Build share URL when authed |
| `pages/house/share/backyard.astro` | Token gate + board |
| `.dev.vars.example` + `deploy.yml` | `HOUSE_IDEAS_TOKEN` |

---

### Task 1: Types + project + ideas data skeleton

**Files:** Create `ideas.ts`; modify `types.ts`, `projects.ts`

- [ ] Add `IdeaSection`, `IdeaPhoto`, `ProjectBoard`, `IDEA_SECTION_LABELS` to types
- [ ] Add backyard-redo project (status `planning`, zoneIds including `rear-lawn`)
- [ ] Create `ideas.ts` with empty/placeholder board array (photos filled in Task 2)
- [ ] Export `getBoardForProject(projectId: string): ProjectBoard | undefined`
- [ ] Commit: `feat(house): add backyard redo project and idea board types`

---

### Task 2: Optimize & seed photos

**Files:** `public/house/ideas/backyard/*`, fill `ideas.ts`

- [ ] `mkdir -p public/house/ideas/backyard`
- [ ] Using `magick`, resize ~10–14 photos from `house-stuff/photos/` to max edge 1600px, JPEG q~82, kebab-case names
- [ ] Seed sections:
  - **existing:** overhead, back, deck 01, side 01, dusk as-is (pick 5–7)
  - **inspiration:** inspiration-1..3
  - **concepts:** cedar-curves (1–2), dusk option 1/2 or red-line (1–2)
- [ ] Draft captions in `ideas.ts`
- [ ] Commit: `feat(house): seed backyard idea board photos and captions`

---

### Task 3: Board UI + lightbox + Projects detail

**Files:** `ProjectIdeaBoard.tsx`, `PhotoLightbox.tsx`, `ProjectsTab.tsx`, `HouseApp.tsx`

- [ ] Implement lightbox (Esc, backdrop, ✕; optional prev/next)
- [ ] Implement board with section labels, grid, captions under images
- [ ] ProjectsTab: if board exists, clickable card → detail with back + board; pass `shareUrl: string | null`
- [ ] Copy share link button when `shareUrl` set
- [ ] Wire HouseApp to pass share URL into ProjectsTab
- [ ] Commit: `feat(house): add project idea board UI and lightbox`

---

### Task 4: Share page + env

**Files:** `pages/house/share/backyard.astro`, `index.astro`, `.dev.vars.example`, `deploy.yml`

- [ ] Token gate reading `HOUSE_IDEAS_TOKEN` (import.meta.env / cloudflare env / locals) like ICS
- [ ] Render standalone board (same house CSS vars/fonts as index)
- [ ] Authenticated index builds `ideasShareUrl` when token present
- [ ] Document + wire `HOUSE_IDEAS_TOKEN` in example + deploy build env
- [ ] Manual: wrong token 401; good token shows board
- [ ] Commit: `feat(house): add token-gated backyard board share page`

---

### Task 5: Verify + ship prep

- [ ] `bun test` + `bun run build`
- [ ] Smoke: list → detail → lightbox; share URL
- [ ] Do not set production secret in this task unless user asks (call out in PR)

---

## Spec coverage

| Spec item | Task |
| --- | --- |
| Projects detail board | 1, 3 |
| Sections Existing/Inspiration/Concepts | 2, 3 |
| File-based photos/captions | 1, 2 |
| Lightbox | 3 |
| Token share page | 4 |
| Copy share link | 3, 4 |
| Seed from house-stuff/photos | 2 |
