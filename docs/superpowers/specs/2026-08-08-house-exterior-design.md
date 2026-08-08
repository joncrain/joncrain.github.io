# House Exterior Hub — Design Spec

**Date:** 2026-08-08  
**Status:** Approved for planning  
**Site:** `joncra.in` (`/house`)  
**Assets inbox:** `/opt/UnitySrc/joncrain/house-stuff`

## Problem

Personal exterior/home planning is scattered: landscaping timing (mow, fertilize, trim), project ideas (side-yard path, firepit), yard issue findings, supplies, and property measurements. There is no single visual place that ties care, plans, and accurate sizes together.

## Goals

1. Private, visual **exterior hub** with a digital yard map as the centerpiece.
2. **Accurate** zone geometry and areas (feet / sq ft) from GIS, aerials, and measurements — not forever-schematic blobs.
3. Care schedule that **subscribes into Google Calendar** via ICS.
4. Lightweight project placeholders for landscaping ideas.
5. Fit existing site patterns (Astro + React, password gate like `/soccer`, file-based data).

## Non-goals (v1)

- In-browser data editing or Cloudflare KV/D1 storage
- Live Mammotion robot-mower API sync
- Full 3D site viewer
- Supplies ledger, AI knowledge dump UI, interior rooms
- Public/contractor-facing pages

## Decisions (locked)

| Topic | Choice |
| --- | --- |
| Centerpiece | Interactive 2D property map |
| Layout | Map on top; tabs below: Zones / Care / Projects |
| Calendar | One-way ICS subscribe feed into Google Calendar |
| Auth | Password-only, just Jon (`HOUSE_PASSWORD`), noindex |
| Data updates | Repo files (like soccer `sessions.ts`); redeploy to publish |
| Map accuracy | Digitize from GIS + aerial + tape checks; label source/confidence |
| 3D | Deferred: separate `/house/model` later; elevation as notes/contours until then |
| Mower | Mammotion; integration phase 2 (HA / PyMammotion community stack) |
| External data | Allowed: public GIS, parcel, aerials, and related internet sources as needed |

## Architecture

```
/house                    → password gate + HouseApp (React island)
/house/calendar.ics       → ICS from care.ts (HOUSE_ICS_TOKEN)
src/data/house/           → property, zones, care, projects
house-stuff/              → GIS PDF, photos, future scans (source materials)
```

- Stack: Astro on Cloudflare Workers (same as soccer), `prerender = false` for auth.
- Auth: mirror soccer HMAC cookie pattern with separate cookie name and env password.
- Rendering: SVG (or canvas) map from zone polygons in a local foot coordinate system; optional georeferenced underlay image.

### Data modules

**`property.ts`** — label, timezone, local CRS notes (origin, north), lot-level facts, underlay image ref, overall lot area if known.

**`zones.ts`** — zones with:

- `id`, `name`, `kind` (`lawn` | `bed` | `drive` | `hardscape` | `structure` | `other`)
- `polygon`: `[x, y][]` in local feet
- derived or stored `areaSqFt`, optional perimeter
- `source`: `gis` | `measured` | `estimated` | `derived`
- `confidence`: `high` | `medium` | `low`
- `notes`, optional elevation notes

**`care.ts`** — events with:

- `id`, `type` (`mow` | `fertilize` | `trim` | `treat` | `other`)
- `zoneIds[]`, `date`, optional end
- `status`: `planned` | `done`
- `title`, `notes`, optional `product`

**`projects.ts`** — ideas with `id`, `title`, `status` (`idea` | `planning` | `in_progress` | `done`), `zoneIds[]`, `notes`.

### ICS

- Planned care events → `VEVENT`s, explicit timezone.
- Access: **secret token in the URL** (`HOUSE_ICS_TOKEN` env). Google Calendar subscribe cannot use the house login cookie, so the ICS feed is token-gated, not cookie-gated. UI can reveal/copy the full subscribe URL after login.
- After `care.ts` changes + deploy, Google’s periodic poll picks up updates.

## UI

1. Login (password).
2. Header: “House · Exterior”; affordance to copy/reveal ICS subscribe URL.
3. **Map** (primary): underlay + colored polygons by kind; click selects zone.
4. **Tabs under map:**
   - **Zones** — selected zone detail (area, source/confidence, notes) + full zone list.
   - **Care** — upcoming / recent; filter by selected zone.
   - **Projects** — path, firepit, etc.
5. Mobile: same vertical stack; shorter map; tabs remain the working surface.

Visual direction: outdoor/garden, distinct from soccer blue kit; avoid generic purple/cream AI aesthetics. Concrete tokens chosen during implementation.

## Accuracy workflow

Priority of sources:

1. GIS / county parcel (`house-stuff/gis info.pdf` + public internet GIS as needed)
2. Georeferenced aerial underlay scaled to the foot grid
3. Tape / wheel / known feature ground truth
4. Later: LiDAR / Object Capture for elevation; Mammotion boundaries if exportable

Process:

1. Establish local foot grid (origin + north) and scaled underlay.
2. Digitize exterior zones as polygons.
3. Record `source` + `confidence` per zone.
4. Compute areas from geometry; reconcile with official lot area when available; note deltas.
5. Roof / pitch: stub fields only in v1; fill when plans/drone/measurements exist.

**V1 accuracy bar:** lot outline and major surfaces (driveway, primary lawn panels, side yard, house footprint outline) within ~1–2 ft on linear edges where GIS or tape exists. Beds may start lower confidence. No fake precision — estimated zones stay labeled.

## Phase 2 hooks (named, not built)

- Mammotion mow history via Home Assistant / PyMammotion (will likely need non-git storage).
- `/house/model` 3D mesh viewer.
- Supplies ledger + knowledge notes from exported AI chats.
- Interior spaces on the same hub pattern.

## Testing (v1)

- Auth: wrong password rejected; correct password sets cookie; unauthenticated `/house` blocked.
- Map: zones render; selection updates Zones tab.
- Care: lists planned/done from data; ICS body matches planned events (count/dates).
- ICS: missing/wrong token → 401; correct token → `text/calendar`.
- Smoke on mobile width: map + tabs usable without horizontal breakage.

## Open inputs at implementation time

- Digitize from existing `house-stuff` assets + public GIS/aerials (approved).
- Optional tape checkpoints from Jon (driveway width, one lawn edge).
- Confirm local timezone for ICS.
- Choose ICS token secret (env var).
