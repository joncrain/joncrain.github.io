# House Exterior Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a password-gated `/house` exterior hub on `joncra.in` with an accurate interactive yard map, file-based care schedule, and Google Calendar ICS subscribe feed.

**Architecture:** Mirror the soccer app pattern (Astro SSR page + React island + HMAC cookie auth + TypeScript data modules). Zone polygons live in a local foot coordinate system, render as SVG, and drive Zones/Care/Projects tabs under the map. Planned care events serialize to a token-gated `.ics` endpoint for Google Calendar.

**Tech Stack:** Astro 7, React 19, Cloudflare Workers adapter, TypeScript data files, Bun test runner for pure helpers, Tailwind 4.

## Global Constraints

- Private only: `noindex, nofollow`; password via `HOUSE_PASSWORD`; ICS via `HOUSE_ICS_TOKEN` query param (not cookie).
- File-based data under `src/data/house/` — no KV/D1/in-browser editors in v1.
- Layout: map on top; tabs below — Zones | Care | Projects.
- Accuracy: digitize major surfaces from `house-stuff` + public GIS/aerials; every zone has `source` + `confidence`.
- Out of v1: Mammotion sync, 3D model page, supplies, knowledge dump, interior.
- Sitemap must exclude `/house` (same filter style as `/soccer`).
- Follow existing soccer auth/env patterns in `src/lib/soccer-auth.ts` and `src/pages/api/soccer/*`.
- Visual: outdoor/garden look; do not copy soccer blue kit; avoid purple/cream AI-default aesthetics.
- Spec: `docs/superpowers/specs/2026-08-08-house-exterior-design.md`.

## File map

| File | Responsibility |
| --- | --- |
| `src/data/house/types.ts` | Shared types + label maps |
| `src/data/house/property.ts` | Lot metadata, CRS, underlay, timezone |
| `src/data/house/zones.ts` | Zone polygons + measurement metadata |
| `src/data/house/care.ts` | Planned/done care events |
| `src/data/house/projects.ts` | Path, firepit, other ideas |
| `src/lib/house-geometry.ts` | Polygon area/perimeter in sq ft / ft |
| `src/lib/house-ics.ts` | Build ICS calendar string from care events |
| `src/lib/house-auth.ts` | Password HMAC cookie auth (soccer twin) |
| `src/lib/house-geometry.test.ts` | Geometry unit tests |
| `src/lib/house-ics.test.ts` | ICS unit tests |
| `src/pages/api/house/auth.ts` | POST password → set cookie |
| `src/pages/api/house/logout.ts` | Clear cookie |
| `src/pages/house/calendar.ics.ts` | Token-gated ICS response |
| `src/pages/house/index.astro` | SSR shell + auth check + mount app |
| `src/components/react/house/HouseApp.tsx` | Login, header, map, tabs shell |
| `src/components/react/house/SiteMap.tsx` | SVG map + selection |
| `src/components/react/house/ZonesTab.tsx` | Zone detail + list |
| `src/components/react/house/CareTab.tsx` | Upcoming/recent care |
| `src/components/react/house/ProjectsTab.tsx` | Project cards |
| `public/house/underlay.jpg` | Georeferenced aerial/drone underlay |
| `.dev.vars.example` | Document `HOUSE_PASSWORD`, `HOUSE_ICS_TOKEN` |
| `astro.config.mjs` | Sitemap filter for `/house` |

---

### Task 1: Geometry helpers + types

**Files:**
- Create: `src/data/house/types.ts`
- Create: `src/lib/house-geometry.ts`
- Create: `src/lib/house-geometry.test.ts`
- Modify: `package.json` (add `"test": "bun test"` if missing)

**Interfaces:**
- Produces: `Point`, `Zone`, `polygonAreaSqFt(points: Point[]): number`, `polygonPerimeterFt(points: Point[]): number`

- [ ] **Step 1: Write failing geometry tests**

```ts
// src/lib/house-geometry.test.ts
import { describe, expect, test } from "bun:test";
import { polygonAreaSqFt, polygonPerimeterFt } from "./house-geometry";

describe("polygonAreaSqFt", () => {
  test("computes axis-aligned rectangle", () => {
    const pts = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 5 },
      { x: 0, y: 5 },
    ];
    expect(polygonAreaSqFt(pts)).toBe(50);
  });
});

describe("polygonPerimeterFt", () => {
  test("computes rectangle perimeter", () => {
    const pts = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 5 },
      { x: 0, y: 5 },
    ];
    expect(polygonPerimeterFt(pts)).toBe(30);
  });
});
```

- [ ] **Step 2: Run tests — expect fail**

Run: `bun test src/lib/house-geometry.test.ts`  
Expected: fail (module / exports missing)

- [ ] **Step 3: Add types + shoelace implementation**

```ts
// src/data/house/types.ts
export type Point = { x: number; y: number };

export type ZoneKind =
  | "lawn"
  | "bed"
  | "drive"
  | "hardscape"
  | "structure"
  | "other";

export type MeasurementSource = "gis" | "measured" | "estimated" | "derived";
export type Confidence = "high" | "medium" | "low";

export type CareType = "mow" | "fertilize" | "trim" | "treat" | "other";
export type CareStatus = "planned" | "done";

export type ProjectStatus = "idea" | "planning" | "in_progress" | "done";

export interface PropertyInfo {
  label: string;
  timezone: string; // IANA, e.g. "America/New_York"
  originNote: string;
  northIsNegativeY: boolean;
  lotAreaSqFt?: number;
  underlay: {
    src: string; // e.g. "/house/underlay.jpg"
    widthFt: number;
    heightFt: number;
  };
  roof?: { areaSqFt?: number; pitch?: string; notes?: string };
}

export interface Zone {
  id: string;
  name: string;
  kind: ZoneKind;
  polygon: Point[];
  areaSqFt: number;
  perimeterFt?: number;
  source: MeasurementSource;
  confidence: Confidence;
  notes?: string;
  elevationNotes?: string;
}

export interface CareEvent {
  id: string;
  type: CareType;
  zoneIds: string[];
  date: string; // YYYY-MM-DD
  endDate?: string;
  status: CareStatus;
  title: string;
  notes?: string;
  product?: string;
}

export interface HouseProject {
  id: string;
  title: string;
  status: ProjectStatus;
  zoneIds: string[];
  notes?: string;
}

export const ZONE_KIND_LABELS: Record<ZoneKind, string> = {
  lawn: "Lawn",
  bed: "Bed",
  drive: "Driveway",
  hardscape: "Hardscape",
  structure: "Structure",
  other: "Other",
};

export const CARE_TYPE_LABELS: Record<CareType, string> = {
  mow: "Mow",
  fertilize: "Fertilize",
  trim: "Trim",
  treat: "Treat",
  other: "Other",
};
```

```ts
// src/lib/house-geometry.ts
import type { Point } from "../data/house/types";

/** Shoelace formula; coordinates in feet → area in sq ft. */
export function polygonAreaSqFt(points: Point[]): number {
  if (points.length < 3) return 0;
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const a = points[i]!;
    const b = points[(i + 1) % points.length]!;
    sum += a.x * b.y - b.x * a.y;
  }
  return Math.abs(sum) / 2;
}

export function polygonPerimeterFt(points: Point[]): number {
  if (points.length < 2) return 0;
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const a = points[i]!;
    const b = points[(i + 1) % points.length]!;
    sum += Math.hypot(b.x - a.x, b.y - a.y);
  }
  return sum;
}
```

- [ ] **Step 4: Run tests — expect pass**

Run: `bun test src/lib/house-geometry.test.ts`  
Expected: pass

- [ ] **Step 5: Commit**

```bash
git add package.json src/data/house/types.ts src/lib/house-geometry.ts src/lib/house-geometry.test.ts
git commit -m "feat(house): add zone geometry helpers and types"
```

---

### Task 2: ICS builder

**Files:**
- Create: `src/lib/house-ics.ts`
- Create: `src/lib/house-ics.test.ts`

**Interfaces:**
- Consumes: `CareEvent`, `PropertyInfo.timezone`
- Produces: `buildHouseCalendarIcs(events: CareEvent[], timezone: string): string`

- [ ] **Step 1: Write failing ICS tests**

```ts
// src/lib/house-ics.test.ts
import { describe, expect, test } from "bun:test";
import { buildHouseCalendarIcs } from "./house-ics";
import type { CareEvent } from "../data/house/types";

const sample: CareEvent[] = [
  {
    id: "fert-1",
    type: "fertilize",
    zoneIds: ["front-lawn"],
    date: "2026-09-15",
    status: "planned",
    title: "Fall fertilizer — front lawn",
  },
  {
    id: "mow-done",
    type: "mow",
    zoneIds: ["front-lawn"],
    date: "2026-08-01",
    status: "done",
    title: "Mowed",
  },
];

describe("buildHouseCalendarIcs", () => {
  test("includes only planned events", () => {
    const ics = buildHouseCalendarIcs(sample, "America/New_York");
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("SUMMARY:Fall fertilizer — front lawn");
    expect(ics).toContain("DTSTART;VALUE=DATE:20260915");
    expect(ics).not.toContain("SUMMARY:Mowed");
  });

  test("escapes commas and semicolons in summary", () => {
    const ics = buildHouseCalendarIcs(
      [
        {
          id: "x",
          type: "other",
          zoneIds: [],
          date: "2026-10-01",
          status: "planned",
          title: "Trim; hedge, north",
        },
      ],
      "America/New_York",
    );
    expect(ics).toContain("SUMMARY:Trim\\; hedge\\, north");
  });
});
```

- [ ] **Step 2: Run tests — expect fail**

Run: `bun test src/lib/house-ics.test.ts`  
Expected: fail (module missing)

- [ ] **Step 3: Implement ICS builder**

```ts
// src/lib/house-ics.ts
import type { CareEvent } from "../data/house/types";

function icsEscape(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function yyyymmdd(date: string): string {
  return date.replaceAll("-", "");
}

/** Build a minimal ICS calendar from planned care events (all-day). */
export function buildHouseCalendarIcs(
  events: CareEvent[],
  timezone: string,
): string {
  const planned = events.filter((e) => e.status === "planned");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//joncra.in//House Care//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-TIMEZONE:${timezone}`,
    "X-WR-CALNAME:House Care",
  ];

  for (const e of planned) {
    const start = yyyymmdd(e.date);
    const endRaw = e.endDate ?? e.date;
    // all-day DTEND is exclusive → add one day if single-day
    const endDate = new Date(`${endRaw}T12:00:00Z`);
    if (!e.endDate) endDate.setUTCDate(endDate.getUTCDate() + 1);
    else endDate.setUTCDate(endDate.getUTCDate() + 1);
    const end = endDate.toISOString().slice(0, 10).replaceAll("-", "");

    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.id}@house.joncra.in`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
      `DTSTART;VALUE=DATE:${start}`,
      `DTEND;VALUE=DATE:${end}`,
      `SUMMARY:${icsEscape(e.title)}`,
    );
    if (e.notes) lines.push(`DESCRIPTION:${icsEscape(e.notes)}`);
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  return `${lines.join("\r\n")}\r\n`;
}
```

- [ ] **Step 4: Run tests — expect pass**

Run: `bun test src/lib/house-ics.test.ts`  
Expected: pass

- [ ] **Step 5: Commit**

```bash
git add src/lib/house-ics.ts src/lib/house-ics.test.ts
git commit -m "feat(house): add ICS builder for planned care events"
```

---

### Task 3: House auth library + API routes

**Files:**
- Create: `src/lib/house-auth.ts`
- Create: `src/pages/api/house/auth.ts`
- Create: `src/pages/api/house/logout.ts`
- Modify: `.dev.vars.example`
- Modify: `.dev.vars` (local only — do not commit secrets)

**Interfaces:**
- Produces: `COOKIE_NAME`, `verifyHousePassword`, `createHouseAuthCookieValue`, `isHouseAuthenticated`, `houseAuthCookieOptions` — same shapes as soccer counterparts, env key `HOUSE_PASSWORD`, payload `"house-exterior-ok"`, cookie `house_auth`.

- [ ] **Step 1: Copy soccer auth pattern into `house-auth.ts`**

Mirror `src/lib/soccer-auth.ts` exactly, renaming symbols and using:

- `COOKIE_NAME = "house_auth"`
- `TOKEN_PAYLOAD = "house-exterior-ok"`
- Env field `HOUSE_PASSWORD`

- [ ] **Step 2: Add API routes**

Mirror `src/pages/api/soccer/auth.ts` and `logout.ts` under `src/pages/api/house/`, importing from `house-auth` and casting `env as { HOUSE_PASSWORD?: string }`.

Logout clears `COOKIE_NAME` with `maxAge: 0`.

- [ ] **Step 3: Document env vars**

Update `.dev.vars.example`:

```
# Local secrets for `astro dev` / wrangler (do not commit)
SOCCER_PASSWORD=your-shared-password-here
HOUSE_PASSWORD=your-house-password-here
HOUSE_ICS_TOKEN=your-ics-subscribe-token-here
```

Add the same keys to local `.dev.vars` with real values (never commit).

- [ ] **Step 4: Smoke-check auth module loads**

Run: `bun -e 'import("./src/lib/house-auth.ts").then(m => console.log(m.COOKIE_NAME))'`  
Expected: `house_auth`

- [ ] **Step 5: Commit**

```bash
git add src/lib/house-auth.ts src/pages/api/house/auth.ts src/pages/api/house/logout.ts .dev.vars.example
git commit -m "feat(house): add password auth matching soccer pattern"
```

---

### Task 4: Seed property + zone + care + project data

**Files:**
- Create: `src/data/house/property.ts`
- Create: `src/data/house/zones.ts`
- Create: `src/data/house/care.ts`
- Create: `src/data/house/projects.ts`
- Create: `public/house/underlay.jpg` (processed from `house-stuff`)

**Interfaces:**
- Consumes: types + `polygonAreaSqFt` / `polygonPerimeterFt`
- Produces: exported `property`, `zones`, `careEvents`, `projects` constants

- [ ] **Step 1: Prepare underlay asset**

From `/opt/UnitySrc/joncrain/house-stuff/IMG_2938.JPG` (aerial of house **1680**):

1. Crop/rotate so the lot is roughly axis-aligned (driveway downward or north-up — document choice in `property.originNote`).
2. Export JPEG to `public/house/underlay.jpg` (reasonable web size, ≤ ~2MB).
3. Also extract useful pages/images from `house-stuff/gis info.pdf` into `house-stuff/derived/` for digitizing reference (not required in `public/`).

- [ ] **Step 2: Establish CRS in `property.ts`**

Use public GIS/parcel lookup for address on the house number **1680** from the aerial (city/state from GIS PDF / EXIF / reverse lookup as available). Set:

```ts
import type { PropertyInfo } from "./types";

export const property: PropertyInfo = {
  label: "Home · Exterior",
  timezone: "America/New_York",
  originNote:
    "Origin at SW corner of digitized lot outline; +x east, +y north; units feet. Underlay scaled to lot width.",
  northIsNegativeY: false,
  lotAreaSqFt: undefined, // fill from GIS when known
  underlay: {
    src: "/house/underlay.jpg",
    widthFt: 120, // replace with GIS/tape-derived width
    heightFt: 90, // replace with GIS/tape-derived height
  },
  roof: { notes: "Pitch/area TBD from plans or measure" },
};
```

Replace `widthFt` / `heightFt` / `lotAreaSqFt` with values from GIS or measured scale (known driveway width as check when available).

- [ ] **Step 3: Digitize major zones in `zones.ts`**

Trace at least:

- `lot-outline` (optional, kind `other`) or skip if redundant
- `house-footprint` (`structure`)
- `driveway` (`drive`)
- `front-lawn` (`lawn`)
- `side-yard` (`lawn` or `hardscape` as appropriate)
- primary beds (`bed`) — may be `estimated` / `medium`

For each zone, set polygon in feet on the underlay grid, compute `areaSqFt` / `perimeterFt` via geometry helpers, set honest `source`/`confidence`.

```ts
import { polygonAreaSqFt, polygonPerimeterFt } from "../../lib/house-geometry";
import type { Zone } from "./types";

function zone(
  partial: Omit<Zone, "areaSqFt" | "perimeterFt"> & {
    areaSqFt?: number;
    perimeterFt?: number;
  },
): Zone {
  const areaSqFt = partial.areaSqFt ?? polygonAreaSqFt(partial.polygon);
  const perimeterFt =
    partial.perimeterFt ?? polygonPerimeterFt(partial.polygon);
  return { ...partial, areaSqFt, perimeterFt };
}

export const zones: Zone[] = [
  // fill with digitized polygons — example shape only
  zone({
    id: "driveway",
    name: "Driveway",
    kind: "drive",
    polygon: [
      /* real feet coords */
    ],
    source: "gis",
    confidence: "high",
    notes: "Concrete drive from garage to street",
  }),
];
```

**Accuracy bar for this task:** major surfaces within ~1–2 ft where GIS/tape allows; beds may be medium/estimated.

- [ ] **Step 4: Seed care + projects**

```ts
// care.ts — a few planned + done examples (real seasonal placeholders OK)
export const careEvents: CareEvent[] = [/* ... */];

// projects.ts
export const projects: HouseProject[] = [
  {
    id: "side-path",
    title: "Side yard path",
    status: "idea",
    zoneIds: ["side-yard"],
    notes: "Walkable path; materials TBD",
  },
  {
    id: "firepit",
    title: "Firepit area",
    status: "idea",
    zoneIds: ["side-yard"],
    notes: "Sitting area + firepit; check setbacks/elevation later",
  },
];
```

- [ ] **Step 5: Sanity-check areas**

Run: `bun -e 'import { zones } from "./src/data/house/zones.ts"; console.log(zones.map(z => [z.id, z.areaSqFt, z.confidence]))'`  
Expected: prints zones with non-zero areas for closed polygons

- [ ] **Step 6: Commit**

```bash
git add src/data/house public/house/underlay.jpg
git commit -m "feat(house): seed property map data and underlay"
```

---

### Task 5: ICS HTTP endpoint

**Files:**
- Create: `src/pages/house/calendar.ics.ts`
- Modify: helper to read `HOUSE_ICS_TOKEN` (inline in endpoint is fine)

**Interfaces:**
- Consumes: `buildHouseCalendarIcs`, `careEvents`, `property.timezone`
- Produces: `GET /house/calendar.ics?token=...` → `text/calendar` or 401

- [ ] **Step 1: Implement endpoint**

```ts
export const prerender = false;

import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { careEvents } from "../../data/house/care";
import { property } from "../../data/house/property";
import { buildHouseCalendarIcs } from "../../lib/house-ics";

function getIcsToken(platformEnv?: { HOUSE_ICS_TOKEN?: string }): string | undefined {
  const fromImport = import.meta.env.HOUSE_ICS_TOKEN as string | undefined;
  if (fromImport) return fromImport;
  if (platformEnv?.HOUSE_ICS_TOKEN) return platformEnv.HOUSE_ICS_TOKEN;
  return undefined;
}

export const GET: APIRoute = async ({ url }) => {
  const expected = getIcsToken(env as { HOUSE_ICS_TOKEN?: string });
  const token = url.searchParams.get("token") ?? "";
  if (!expected || token !== expected) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = buildHouseCalendarIcs(careEvents, property.timezone);
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
};
```

- [ ] **Step 2: Manual verify with dev server**

Run: `bun run dev` then:

```bash
curl -s -o /dev/null -w "%{http_code}" "http://localhost:4321/house/calendar.ics?token=wrong"
# Expected: 401

curl -s "http://localhost:4321/house/calendar.ics?token=$HOUSE_ICS_TOKEN" | head
# Expected: BEGIN:VCALENDAR ...
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/house/calendar.ics.ts
git commit -m "feat(house): add token-gated care calendar ICS feed"
```

---

### Task 6: SiteMap + tab components

**Files:**
- Create: `src/components/react/house/SiteMap.tsx`
- Create: `src/components/react/house/ZonesTab.tsx`
- Create: `src/components/react/house/CareTab.tsx`
- Create: `src/components/react/house/ProjectsTab.tsx`

**Interfaces:**
- Consumes: `property`, `zones`, `careEvents`, `projects`, selected zone id
- Produces: presentational components wired by `HouseApp` in Task 7

- [ ] **Step 1: Implement `SiteMap`**

SVG with:

- `viewBox={`0 0 ${property.underlay.widthFt} ${property.underlay.heightFt}`}`
- optional `<image href={property.underlay.src} width={...} height={...} opacity={0.85} />`
- one `<path>` / `<polygon>` per zone; fill by `kind` (CSS variables or map)
- `onClick` → `onSelectZone(id)`; selected zone thicker stroke
- `preserveAspectRatio="xMidYMid meet"`; container `w-full` with fixed aspect from underlay ft ratio

Kind colors (starting point — tune for outdoor look):

- lawn `#3f6b45`, bed `#6b8f71`, drive `#8a8680`, hardscape `#9a8f7e`, structure `#5c6570`, other `#7a7a70`

- [ ] **Step 2: Implement tabs**

- `ZonesTab`: if selected, show name, kind, area (locale string), perimeter, source, confidence, notes; always show clickable list of all zones.
- `CareTab`: split upcoming (`planned`, date >= today) vs recent (`done`); if a zone is selected, filter `zoneIds.includes(selectedId)`; show type/title/date/product.
- `ProjectsTab`: cards with title, status, notes, linked zone names.

- [ ] **Step 3: Typecheck components**

Run: `bunx tsc --noEmit` (or `bun run build` if tsc not configured)  
Expected: no errors in new house components

- [ ] **Step 4: Commit**

```bash
git add src/components/react/house
git commit -m "feat(house): add map and Zones/Care/Projects panels"
```

---

### Task 7: HouseApp shell + `/house` page

**Files:**
- Create: `src/components/react/house/HouseApp.tsx`
- Create: `src/pages/house/index.astro`
- Modify: `astro.config.mjs` (sitemap filter)

**Interfaces:**
- Consumes: auth APIs, all data modules, map/tab components
- Produces: working `/house` UX per layout B

- [ ] **Step 1: Implement `HouseApp`**

State:

- `authenticated` from props (SSR)
- `selectedZoneId: string | null`
- `tab: "zones" | "care" | "projects"`
- login form posting to `/api/house/auth`
- header “House · Exterior”
- “Calendar” control: after auth, show/copy `https://joncra.in/house/calendar.ics?token=…` — **do not embed the raw token in client JS from env**. Instead pass a boolean `icsConfigured` and instruct copy of URL from a server-provided path only if safe.

**Token exposure rule:** Prefer showing a relative path hint plus “token is in your password manager / `.dev.vars`” OR pass `icsUrl` from the Astro page only when authenticated by reading `HOUSE_ICS_TOKEN` on the server and building the absolute URL in `index.astro` as a prop `calendarSubscribeUrl`. That keeps the token out of the public bundle for logged-out users.

Props:

```ts
type HouseAppProps = {
  authenticated: boolean;
  calendarSubscribeUrl: string | null; // full URL with token, or null if unset
};
```

Layout:

1. Login gate if `!authenticated`
2. Else: header + SiteMap + tab bar + active tab panel
3. Selecting a zone on the map sets selection; optionally switch to Zones tab

Use outdoor CSS variables on the root wrapper (e.g. `--house-ink`, `--house-moss`, `--house-soil`, `--house-paper`) — not soccer tokens.

- [ ] **Step 2: Create `src/pages/house/index.astro`**

Mirror `src/pages/soccer/index.astro`:

- `export const prerender = false`
- cookie check via `isHouseAuthenticated`
- build `calendarSubscribeUrl` when authenticated and token present:  
  `${Astro.url.origin}/house/calendar.ics?token=${encodeURIComponent(token)}`
- `noindex, nofollow`
- mount `<HouseApp client:load authenticated={...} calendarSubscribeUrl={...} />`
- load distinctive fonts (not Inter/Roboto); outdoor feel

- [ ] **Step 3: Exclude from sitemap**

In `astro.config.mjs`:

```js
filter: (page) => !page.includes("/soccer") && !page.includes("/house"),
```

- [ ] **Step 4: Manual smoke**

Run: `bun run dev`

1. `/house` shows login; wrong password → error; correct → app
2. Map renders zones; click updates Zones tab
3. Care/Projects tabs switch
4. Copy calendar URL; curl with token works
5. Narrow viewport: map stacks above tabs without horizontal scroll breakage

- [ ] **Step 5: Commit**

```bash
git add src/components/react/house/HouseApp.tsx src/pages/house/index.astro astro.config.mjs
git commit -m "feat(house): ship password-gated exterior map hub"
```

---

### Task 8: Accuracy pass + reconcile lot area

**Files:**
- Modify: `src/data/house/property.ts`, `src/data/house/zones.ts`
- Optional notes file: `house-stuff/derived/measurement-notes.md` (local OK; do not require commit if outside repo)

**Interfaces:**
- Consumes: GIS PDF, public parcel/GIS, underlay
- Produces: updated polygons/areas with documented sources

- [ ] **Step 1: Pull official lot facts**

Using house number **1680** + locality from GIS PDF / public records, record lot acreage/sq ft and any published dimensions into `property.lotAreaSqFt` and notes.

- [ ] **Step 2: Reconcile**

Sum primary mutually exclusive surface zones (or lot outline) vs `lotAreaSqFt`. If delta > ~5%, adjust underlay scale or polygons; document remaining delta in `property.originNote` or zone notes.

- [ ] **Step 3: Re-run geometry sanity + visual check**

Run zone area dump + load `/house` and confirm overlays sit on driveway/house/lawn correctly.

- [ ] **Step 4: Commit**

```bash
git add src/data/house/property.ts src/data/house/zones.ts
git commit -m "fix(house): tighten zone geometry against GIS measurements"
```

---

### Task 9: Production secrets + final verification

**Files:**
- Cloudflare dashboard / `wrangler secret` (ops — not committed)
- Modify: none required if already green

- [ ] **Step 1: Set production secrets**

```bash
# via Cloudflare dashboard or wrangler for the Pages/Workers project
# HOUSE_PASSWORD=...
# HOUSE_ICS_TOKEN=...
```

- [ ] **Step 2: Production build**

Run: `bun run build`  
Expected: success; `/house` and ICS route present in output/worker

- [ ] **Step 3: Full checklist from spec**

- [ ] Wrong password rejected; correct sets cookie
- [ ] Map selection updates Zones
- [ ] Care lists planned/done; ICS matches planned count
- [ ] Bad ICS token → 401; good → `text/calendar`
- [ ] Mobile width OK
- [ ] `/house` not in sitemap

- [ ] **Step 4: Final commit only if last polish remains; else stop**

If only docs/comments changed:

```bash
git commit -m "chore(house): final exterior hub polish"
```

---

## Spec coverage self-check

| Spec requirement | Task |
| --- | --- |
| Password gate `/house` | 3, 7 |
| Interactive accurate map | 4, 6, 8 |
| Zones / Care / Projects tabs under map | 6, 7 |
| File-based data modules | 1, 4 |
| ICS Google subscribe (`HOUSE_ICS_TOKEN`) | 2, 5, 7 |
| Source + confidence on zones | 4, 8 |
| Sitemap exclude | 7 |
| Accuracy from GIS/aerials | 4, 8 |
| Mammotion / 3D / supplies out of v1 | — (not scheduled) |

## Placeholder scan

No TBD steps remain; digitizing uses real assets (`IMG_2938.JPG`, GIS PDF) with concrete zone id list and accuracy bar.
