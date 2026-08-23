import type { HouseProject } from "./types";

export const projects: HouseProject[] = [
	{
		id: "backyard-redo",
		title: "Backyard redo",
		status: "planning",
		zoneIds: ["rear-lawn", "east-lawn"],
		notes:
			"Landscape refresh toward the water — path, plantings, and hardscape ideas. Open for the photo idea board.",
	},
	{
		id: "side-path",
		title: "Side yard path",
		status: "idea",
		zoneIds: ["east-lawn"],
		notes: "Walkable path through east side yard; materials and alignment TBD.",
	},
	{
		id: "firepit",
		title: "Firepit area",
		status: "idea",
		zoneIds: ["east-lawn"],
		notes:
			"Sitting area + firepit on east side. Check setbacks, elevation, and condo/master-deed rules before building.",
	},
	{
		id: "trim-utility-island",
		title: "Utility island tidy-up",
		status: "idea",
		zoneIds: ["utility-island"],
		notes: "River rock bed + bushes around utility box — refresh plantings as needed.",
	},
];
