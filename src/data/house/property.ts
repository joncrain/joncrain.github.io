import type { PropertyInfo } from "./types";

export const property: PropertyInfo = {
	label: "1890 Leroy Ln · Exterior",
	timezone: "America/New_York",
	originNote:
		"Origin at top-left of underlay image; +x right, +y down (image space). Underlay is drone aerial IMG_2938 scaled to ~160×120 ft covering the visible front/side of the lot (not the full parcel). Official parcel 14-073-00-005-00 (Isabella County): 1890 Leroy Ln, Mt Pleasant, MI 48858 — 0.51 ac ≈ 22,216 sq ft. Digitized zone surfaces on this crop sum ~11.8k sq ft; remaining area is off-frame (rear/east) plus untraced turf. Facade OCR sometimes misreads as 1680; GIS and street sequence confirm 1890. Next accuracy step: overlay FetchGIS parcel polygon + tape driveway width.",
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
