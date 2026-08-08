import type { PropertyInfo } from "./types";

/**
 * Illustrative landscape site plan CRS:
 * - Origin top-left of drawing
 * - +x east, +y south (north at top)
 * - Units: feet
 * Street (Leroy Ln) along north edge. Garage/drive on west (matches
 * street-facing view: garage on right when looking at the front).
 */
export const property: PropertyInfo = {
	label: "1890 Leroy Ln · Exterior",
	timezone: "America/New_York",
	originNote:
		"Vector landscape site plan (plan view). North at top; +x east. Parcel 14-073-00-005-00 — 1890 Leroy Ln, Mt Pleasant, MI — 0.51 ac ≈ 22,216 sq ft. Garage/drive on west side of house. Concept-grade — not a survey.",
	northIsNegativeY: true,
	lotAreaSqFt: 22216,
	underlay: {
		widthFt: 170,
		heightFt: 160,
	},
	lotOutline: [
		{ x: 12, y: 8 },
		{ x: 158, y: 8 },
		{ x: 158, y: 148 },
		{ x: 12, y: 148 },
	],
	roof: {
		notes: "Complex multi-gable; solar on main ridge. Pitch/area TBD.",
	},
};
