# Backyard Redo Idea Board — Design Spec

**Date:** 2026-08-23  
**Status:** Approved for planning  
**Parent:** `/house` exterior hub (`docs/superpowers/specs/2026-08-08-house-exterior-design.md`)  
**Assets:** `/opt/UnitySrc/joncrain/house-stuff/photos/`

## Problem

Backyard redo thinking is scattered across drone photos, deck shots, inspiration images, and concept renders. There is no place inside `/house` to browse them with captions next to the existing Projects list — or to send a clean board to a landscaper without sharing the full house hub.

## Goal

1. Expand **Projects** so **Backyard redo** opens a captioned **idea board** grouped into Existing / Inspiration / Concepts.
2. Provide a **secret link** the landscaper can open that shows **only** that board (no map, care, or other projects).

## Decisions (locked)

| Topic | Choice |
| --- | --- |
| Placement | Inside Projects (detail view), not a new top-level tab |
| Captions / photos | File-based (data + `public/` images); redeploy to update |
| Grouping | Sections: Existing · Inspiration · Concepts |
| Approach | Project detail + board + lightbox |
| Landscaper access | Secret URL with token query param (same pattern as ICS) |

## Non-goals (v1)

- In-browser upload or caption editing
- Map annotations linking board items to zones
- Fully public unlisted board with no token
- Requiring every file in `photos/` on day one
- Landscaper write access or commenting

## Architecture

```
/house (cookie auth)
  Projects tab
    └─ Backyard redo → ProjectIdeaBoard (+ copy share link)

/house/share/backyard?token=…  (token auth only)
  └─ same ProjectIdeaBoard, standalone page (no map/tabs)
```

**Files**
- `src/data/house/types.ts` — `IdeaSection`, `IdeaPhoto`, `ProjectBoard`
- `src/data/house/projects.ts` — add `backyard-redo` project
- `src/data/house/ideas.ts` — boards keyed by `projectId`
- `public/house/ideas/backyard/*` — web-optimized images
- `src/components/react/house/ProjectsTab.tsx` — list vs detail
- `src/components/react/house/ProjectIdeaBoard.tsx` — sections + grid
- `src/components/react/house/PhotoLightbox.tsx` — overlay viewer
- `src/pages/house/share/backyard.astro` — token-gated share page (`prerender = false`)
- Env: `HOUSE_IDEAS_TOKEN` (GitHub secret + deploy.yml + `.dev.vars.example`)

### Data shapes

```ts
type IdeaSection = "existing" | "inspiration" | "concepts";

interface IdeaPhoto {
  id: string;
  src: string;       // e.g. "/house/ideas/backyard/overhead.jpg"
  caption: string;
  section: IdeaSection;
  sort?: number;
}

interface ProjectBoard {
  projectId: string;
  photos: IdeaPhoto[];
}
```

Projects without a matching board remain simple cards (notes only).

### Share access

- **URL:** `/house/share/backyard?token=<HOUSE_IDEAS_TOKEN>`
- Missing/wrong token → **401** (plain or short “Unauthorized” page)
- Correct token → board only: title, short intro, sections, lightbox
- `noindex, nofollow`
- **Not** cookie-gated (landscaper never logs into `/house`)
- Inside authenticated `/house` project detail: **Copy share link** (server builds absolute URL with token, same approach as calendar ICS copy)
- Revoke/rotate: change `HOUSE_IDEAS_TOKEN` and redeploy

## UI

**List:** Existing project cards; Backyard redo may show “Idea board · N photos”.

**Detail (authenticated):**
- Back control to project list
- Title, status, notes
- Copy share link control
- Section headings only when that section has photos
- Responsive grid (2 cols mobile / 3 desktop)
- Card: image (`object-cover`) + caption **below** the image (not overlaid)

**Share page (token):**
- Same board visual language; no house nav/map/care
- Header: “Backyard redo · Ideas” + optional one-line note for the landscaper
- No “copy share link” / no edit chrome

**Lightbox:** Dimmed overlay; contained image; caption; close via backdrop, Esc, or ✕. Optional prev/next within the board if inexpensive.

**Visual language:** Existing house CSS variables (moss / paper / soil).

## Seed content

Copy and resize a representative set (~8–15) from `house-stuff/photos/` into `public/house/ideas/backyard/`:

| Section | Source examples |
| --- | --- |
| Existing | Drone/overhead, back, deck, side, dusk (as-is) |
| Inspiration | `inspiration-1..3.png` |
| Concepts | `landscape-concept-cedar-curves*`, dusk options with red-line |

Draft captions in `ideas.ts` (editable anytime). Prefer JPEG ≤ ~1MB each for web.

## Testing

- Projects list shows Backyard redo; open → board with three sections as seeded
- Projects without boards still render as simple cards
- Captions visible under thumbnails; lightbox opens/closes
- Images load from `/house/ideas/backyard/…`
- Share URL with correct token shows board only; wrong/missing token → 401
- Share page has no map / care / other projects
- Cookie auth for `/house` unchanged; both pages noindex
- Sitemap excludes `/house` (including share path)

## Open at implementation

- Exact seed subset and final caption wording (draft OK)
- Whether lightbox keyboard prev/next ships in the same PR (include if small)
- Exact landscaper intro blurb on the share page (short default OK)
