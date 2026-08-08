import type { PropertyInfo } from "./types";

/**
 * Site plan CRS from Google Maps + Isabella County GIS (north up).
 * Lot sits on the inside of the Leroy Ln curve — narrow street frontage,
 * widens south. Plan focuses on the yard visible in Maps (street → south
 * neighbor); full tax parcel continues farther south toward the lake.
 */
export const property: PropertyInfo = {
	label: "1890 Leroy Ln · Exterior",
	timezone: "America/New_York",
	originNote:
		"Plan view, north up, +x east. Parcel 14-073-00-005-00 (0.51 ac). Lot outline traced from Google Maps + FetchGIS: curved Leroy Ln frontage on the NW, widening south toward neighbor 1846. Concept-grade — not a survey.",
	northIsNegativeY: true,
	lotAreaSqFt: 22216,
	underlay: {
		widthFt: 180,
		heightFt: 165,
	},
	/** Wedge / curved-frontage lot — not a rectangle. */
	lotOutline: [
		{ x: 28, y: 22 },
		{ x: 48, y: 12 },
		{ x: 78, y: 8 },
		{ x: 108, y: 10 },
		{ x: 128, y: 18 },
		{ x: 148, y: 36 },
		{ x: 162, y: 70 },
		{ x: 168, y: 110 },
		{ x: 165, y: 148 },
		{ x: 40, y: 152 },
		{ x: 22, y: 120 },
		{ x: 18, y: 78 },
		{ x: 20, y: 48 },
	],
	roof: {
		notes: "Complex multi-gable; solar on main ridge. Pitch/area TBD.",
	},
};
