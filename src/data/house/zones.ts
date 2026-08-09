import { polygonAreaSqFt, polygonPerimeterFt } from "../../lib/house-geometry";
import type { Point, Zone } from "./types";

function zone(
	partial: Omit<Zone, "areaSqFt" | "perimeterFt"> & {
		areaSqFt?: number;
		perimeterFt?: number;
	},
): Zone {
	const areaSqFt = partial.areaSqFt ?? polygonAreaSqFt(partial.polygon);
	const perimeterFt =
		partial.perimeterFt ?? polygonPerimeterFt(partial.polygon);
	return { ...partial, areaSqFt, perimeterFt };
}

function circlePoly(cx: number, cy: number, r: number, n = 16): Point[] {
	const pts: Point[] = [];
	for (let i = 0; i < n; i++) {
		const a = (Math.PI * 2 * i) / n - Math.PI / 2;
		pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
	}
	return pts;
}

/**
 * Features placed on the calibrated flat-overhead CRS (see property.ts).
 * Driveway width fixed at measured 27.5 ft.
 */
export const zones: Zone[] = [
	zone({
		id: "house-footprint",
		name: "House",
		kind: "structure",
		polygon: [
			{ x: 113.7, y: 113.7 },
			{ x: 145.4, y: 108.4 },
			{ x: 156.0, y: 134.9 },
			{ x: 134.9, y: 150.7 },
			{ x: 108.4, y: 145.4 },
			{ x: 105.8, y: 126.9 },
		],
		source: "derived",
		confidence: "medium",
		notes: "Traced from flat overhead roof mass; garage on NW/west toward drive.",
	}),
	zone({
		id: "driveway",
		name: "Driveway",
		kind: "drive",
		// Corridor street → garage at measured 27.5 ft width
		polygon: [
			{ x: 77.4, y: 82.4 },
			{ x: 102.4, y: 71.0 },
			{ x: 128.8, y: 129.2 },
			{ x: 103.8, y: 140.6 },
		],
		source: "measured",
		confidence: "high",
		notes: "Width measured on site: 27.5 ft. Length ~64 ft street to garage on plan.",
	}),
	zone({
		id: "front-lawn",
		name: "Front lawn",
		kind: "lawn",
		polygon: [
			{ x: 100, y: 72 },
			{ x: 160, y: 70 },
			{ x: 168, y: 100 },
			{ x: 150, y: 112 },
			{ x: 120, y: 118 },
			{ x: 105, y: 100 },
		],
		source: "derived",
		confidence: "medium",
		notes: "Between house and Leroy Ln, east of driveway.",
	}),
	zone({
		id: "east-lawn",
		name: "East lawn",
		kind: "lawn",
		polygon: [
			{ x: 156, y: 120 },
			{ x: 210, y: 140 },
			{ x: 225, y: 220 },
			{ x: 200, y: 260 },
			{ x: 150, y: 200 },
			{ x: 145, y: 150 },
		],
		source: "derived",
		confidence: "medium",
		notes: "East lawn with trampoline and east tree.",
	}),
	zone({
		id: "rear-lawn",
		name: "Rear lawn",
		kind: "lawn",
		polygon: [
			{ x: 100, y: 150 },
			{ x: 150, y: 155 },
			{ x: 180, y: 250 },
			{ x: 160, y: 300 },
			{ x: 110, y: 250 },
			{ x: 85, y: 190 },
		],
		source: "derived",
		confidence: "medium",
		notes: "Large rear lawn south to the water / south tip of parcel.",
	}),
	zone({
		id: "west-lawn",
		name: "West lawn",
		kind: "lawn",
		polygon: [
			{ x: 60, y: 120 },
			{ x: 90, y: 100 },
			{ x: 105, y: 140 },
			{ x: 95, y: 175 },
			{ x: 70, y: 155 },
		],
		source: "estimated",
		confidence: "low",
		notes: "Strip west of driveway along the road curve.",
	}),
	zone({
		id: "front-bed",
		name: "Front foundation bed",
		kind: "bed",
		polygon: [
			{ x: 118, y: 108 },
			{ x: 148, y: 105 },
			{ x: 150, y: 114 },
			{ x: 120, y: 117 },
		],
		source: "estimated",
		confidence: "medium",
		notes: "River-rock foundation bed along the front facade.",
	}),
	zone({
		id: "utility-island",
		name: "Utility island",
		kind: "bed",
		polygon: circlePoly(153.4, 103.1, 7, 14),
		source: "derived",
		confidence: "high",
		notes: "River rock + bushes + utility box, north/NE of house east of drive.",
	}),
	zone({
		id: "trampoline",
		name: "Trampoline",
		kind: "hardscape",
		polygon: circlePoly(169.2, 142.8, 9, 20),
		source: "derived",
		confidence: "high",
		notes: "Immediately east of the house on the lawn.",
	}),
	zone({
		id: "tree-north",
		name: "Tree (north)",
		kind: "other",
		polygon: circlePoly(142.8, 92.5, 10, 14),
		source: "derived",
		confidence: "high",
		notes: "Canopy north of the house toward Leroy Ln.",
	}),
	zone({
		id: "tree-east",
		name: "Tree (east)",
		kind: "other",
		polygon: circlePoly(185.1, 132.2, 9, 14),
		source: "derived",
		confidence: "high",
		notes: "East of house near trampoline.",
	}),
];

export function getZoneById(id: string): Zone | undefined {
	return zones.find((z) => z.id === id);
}
