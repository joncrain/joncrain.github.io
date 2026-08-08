import type { HouseProject } from "./types";

export const projects: HouseProject[] = [
	{
		id: "side-path",
		title: "Side yard path",
		status: "idea",
		zoneIds: ["side-yard"],
		notes: "Walkable path through east side yard; materials and alignment TBD.",
	},
	{
		id: "firepit",
		title: "Firepit area",
		status: "idea",
		zoneIds: ["side-yard"],
		notes:
			"Sitting area + firepit on east side. Check setbacks, elevation, and condo/master-deed rules before building.",
	},
];
