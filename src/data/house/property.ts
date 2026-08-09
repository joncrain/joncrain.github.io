import type { PropertyInfo } from "./types";

/**
 * Calibrated to flat north-up overhead + measured driveway width 27.5 ft.
 * Image grid: 556×692 px → 0.528846 ft/px (27.5 / ~52 px driveway width).
 * Cross-check: Maps 50 ft scale bar ≈ 100 px → ~52.9 ft (close).
 * Underlay `/house/overhead.png` is the same image, 1:1 with this CRS.
 */
export const property: PropertyInfo = {
	label: "1890 Leroy Ln · Exterior",
	timezone: "America/New_York",
	originNote:
		"North up, +x east. Scale locked to driveway width 27.5 ft on flat overhead. Lot outline traced from red parcel boundary on that image (FetchGIS/Maps). Parcel 14-073-00-005-00 ≈ 0.51 ac. Concept features (beds/trees) placed from the same overhead.",
	northIsNegativeY: true,
	lotAreaSqFt: 22216,
	underlay: {
		src: "/house/overhead.png",
		widthFt: 294,
		heightFt: 366,
	},
	/** Traced from red parcel polyline on flat overhead (simplified). */
	lotOutline: [
		{ x: 87.3, y: 187.2 },
		{ x: 58.2, y: 149.1 },
		{ x: 91.5, y: 87.3 },
		{ x: 101.5, y: 76.2 },
		{ x: 115.8, y: 69.3 },
		{ x: 147.5, y: 66.1 },
		{ x: 165.5, y: 71.9 },
		{ x: 176.7, y: 106.8 },
		{ x: 195.7, y: 168.2 },
		{ x: 215.8, y: 228.5 },
		{ x: 232.7, y: 281.8 },
		{ x: 240.1, y: 307.3 },
		{ x: 189.9, y: 322.1 },
		{ x: 163.4, y: 287.1 },
		{ x: 133.8, y: 247.5 },
		{ x: 110.0, y: 217.4 },
		{ x: 91.0, y: 192.5 },
	],
	roof: {
		notes: "Complex multi-gable; solar on main ridge. Pitch/area TBD.",
	},
};
