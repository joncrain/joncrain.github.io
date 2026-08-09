import type { PropertyInfo } from "./types";

/**
 * Calibrated by digitizing flat north-up overhead + measured driveway 27.5 ft.
 * ft/px = 0.5189 (drive 53.0 px); scale bar check 0.5102.
 * Lot shoelace ≈ 21605 sq ft vs county 22,216.
 */
export const property: PropertyInfo = {
	label: "1890 Leroy Ln · Exterior",
	timezone: "America/New_York",
	originNote:
		"North up, +x east. Scale from driveway width 27.5 ft on flat overhead. Lot outline traced from red parcel boundary. Underlay is the same image 1:1 with this CRS.",
	northIsNegativeY: true,
	lotAreaSqFt: 22216,
	underlay: {
		src: "/house/overhead.png",
		widthFt: 288.5,
		heightFt: 359.1,
	},
	lotOutline: [
		{ x: 158.6, y: 67.3 },
		{ x: 160.2, y: 69.5 },
		{ x: 233.0, y: 296.3 },
		{ x: 232.6, y: 298.7 },
		{ x: 230.4, y: 300.3 },
		{ x: 189.9, y: 312.2 },
		{ x: 187.3, y: 312.5 },
		{ x: 184.9, y: 311.3 },
		{ x: 67.6, y: 157.7 },
		{ x: 59.9, y: 146.8 },
		{ x: 60.2, y: 144.2 },
		{ x: 90.4, y: 88.2 },
		{ x: 93.3, y: 84.1 },
		{ x: 98.1, y: 79.0 },
		{ x: 112.1, y: 71.0 },
		{ x: 129.7, y: 66.8 },
		{ x: 156.2, y: 66.4 },
	],
	roof: {
		notes: "Complex multi-gable; solar on main ridge. Pitch/area TBD.",
	},
};
