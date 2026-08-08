import type { PropertyInfo } from "./types";

export const property: PropertyInfo = {
	label: "1890 Leroy Ln · Exterior",
	timezone: "America/New_York",
	originNote:
		"Origin at top-left of underlay image; +x right, +y down (image space). Underlay is drone aerial IMG_2938 scaled to ~160×120 ft covering the visible lot. Official parcel 14-073-00-005-00 (Isabella County): 1890 Leroy Ln, Mt Pleasant, MI 48858 — 0.51 ac. Facade OCR sometimes misreads as 1680; GIS and street sequence confirm 1890.",
	northIsNegativeY: true,
	lotAreaSqFt: 22216,
	underlay: {
		src: "/house/underlay.jpg",
		widthFt: 160,
		heightFt: 120,
	},
	roof: {
		notes: "Complex multi-gable asphalt; solar array on main ridge. Pitch/area TBD from plans or measure.",
	},
};
