import type { PropertyInfo } from "./types";

/**
 * Illustrative landscape site plan CRS:
 * - Origin top-left of drawing
 * - +x east, +y south (north at top)
 * - Units: feet
 * Geometry is concept-grade from Isabella County parcel (0.51 ac) + aerials;
 * not a survey. Tighten with FetchGIS polygon / tape later.
 */
export const property: PropertyInfo = {
	label: "1890 Leroy Ln · Exterior",
	timezone: "America/New_York",
	originNote:
		"Vector landscape site plan (plan view). North at top. Parcel 14-073-00-005-00 — 1890 Leroy Ln, Mt Pleasant, MI — 0.51 ac ≈ 22,216 sq ft (Isabella County). Street (Leroy Ln) along north edge. Digitized for care/planning, not construction staking.",
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
