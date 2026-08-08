import type { HouseProject } from "./types";

export const projects: HouseProject[] = [
	{
		id: "side-path",
		title: "Side yard path",
		status: "idea",
		zoneIds: ["side-yard"],
		notes: "Walkable path through west side yard; materials and alignment TBD.",
	},
	{
		id: "firepit",
		title: "Firepit area",
		status: "idea",
		zoneIds: ["side-yard"],
		notes:
			"Sitting area + firepit. Check setbacks, elevation, and condo/master-deed rules before building.",
	},
];
