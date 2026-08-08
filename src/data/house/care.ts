import type { CareEvent } from "./types";

export const careEvents: CareEvent[] = [
	{
		id: "mow-2026-08-01",
		type: "mow",
		zoneIds: ["front-lawn", "side-yard", "rear-lawn"],
		date: "2026-08-01",
		status: "done",
		title: "Mowed lawns",
		notes: "Manual/robot log placeholder until Mammotion sync.",
	},
	{
		id: "fert-fall-2026",
		type: "fertilize",
		zoneIds: ["front-lawn", "side-yard", "rear-lawn"],
		date: "2026-09-15",
		status: "planned",
		title: "Fall fertilizer — lawns",
		product: "TBD",
		notes: "Align with cool-season schedule; update product when chosen.",
	},
	{
		id: "trim-front-bed-2026-09",
		type: "trim",
		zoneIds: ["front-bed"],
		date: "2026-09-20",
		status: "planned",
		title: "Trim front bed shrubs",
	},
	{
		id: "treat-lawn-grub-check",
		type: "treat",
		zoneIds: ["front-lawn"],
		date: "2026-08-25",
		status: "planned",
		title: "Lawn health check / treat if needed",
		notes: "Placeholder from prior AI lawncare notes — refine after reviewing Lawncare Claude.pdf.",
	},
];
