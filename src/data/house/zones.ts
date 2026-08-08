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

/** Regular n-gon approximating a circle (canopy / trampoline). */
function circlePoly(cx: number, cy: number, r: number, n = 16): Point[] {
	const pts: Point[] = [];
	for (let i = 0; i < n; i++) {
		const a = (Math.PI * 2 * i) / n - Math.PI / 2;
		pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
	}
	return pts;
}

/**
 * Zones digitized against Google Maps + GIS screenshots (north up).
 * Drive/garage on west; trampoline east of house; utility island north
 * of house; trees north + east (+ west near drive).
 */
export const zones: Zone[] = [
	zone({
		id: "house-footprint",
		name: "House",
		kind: "structure",
		polygon: [
			{ x: 58, y: 58 },
			{ x: 108, y: 54 },
			{ x: 112, y: 78 },
			{ x: 78, y: 82 },
			{ x: 74, y: 92 },
			{ x: 54, y: 90 },
		],
		source: "derived",
		confidence: "medium",
		notes: "Simplified footprint; garage massing on west. Faces roughly NW toward Leroy Ln.",
	}),
	zone({
		id: "driveway",
		name: "Driveway",
		kind: "drive",
		polygon: [
			{ x: 36, y: 28 },
			{ x: 58, y: 22 },
			{ x: 68, y: 48 },
			{ x: 72, y: 78 },
			{ x: 54, y: 90 },
			{ x: 48, y: 72 },
			{ x: 42, y: 48 },
		],
		source: "derived",
		confidence: "medium",
		notes: "Concrete drive from west garage NW to Leroy Ln curve.",
	}),
	zone({
		id: "front-lawn",
		name: "Front lawn",
		kind: "lawn",
		polygon: [
			{ x: 58, y: 18 },
			{ x: 120, y: 16 },
			{ x: 132, y: 36 },
			{ x: 112, y: 54 },
			{ x: 78, y: 52 },
			{ x: 68, y: 48 },
			{ x: 58, y: 28 },
		],
		source: "estimated",
		confidence: "medium",
		notes: "Turf between house and Leroy Ln (east of drive).",
	}),
	zone({
		id: "east-lawn",
		name: "East lawn",
		kind: "lawn",
		polygon: [
			{ x: 112, y: 54 },
			{ x: 148, y: 48 },
			{ x: 160, y: 90 },
			{ x: 158, y: 130 },
			{ x: 112, y: 128 },
			{ x: 108, y: 92 },
			{ x: 112, y: 78 },
		],
		source: "estimated",
		confidence: "medium",
		notes: "Large east lawn — tree + trampoline sit here.",
	}),
	zone({
		id: "rear-lawn",
		name: "Rear lawn",
		kind: "lawn",
		polygon: [
			{ x: 40, y: 92 },
			{ x: 108, y: 92 },
			{ x: 112, y: 128 },
			{ x: 48, y: 140 },
			{ x: 28, y: 120 },
		],
		source: "estimated",
		confidence: "medium",
		notes: "South of house toward neighbor 1846. Full parcel continues farther to the lake.",
	}),
	zone({
		id: "west-lawn",
		name: "West lawn",
		kind: "lawn",
		polygon: [
			{ x: 22, y: 40 },
			{ x: 42, y: 32 },
			{ x: 48, y: 72 },
			{ x: 40, y: 92 },
			{ x: 24, y: 85 },
		],
		source: "estimated",
		confidence: "low",
		notes: "Narrow turf west of driveway along the curve.",
	}),
	zone({
		id: "front-bed",
		name: "Front foundation bed",
		kind: "bed",
		polygon: [
			{ x: 72, y: 50 },
			{ x: 108, y: 48 },
			{ x: 110, y: 56 },
			{ x: 78, y: 58 },
			{ x: 70, y: 56 },
		],
		source: "estimated",
		confidence: "medium",
		notes: "Wavy river-rock bed with boxwoods along the front facade.",
	}),
	zone({
		id: "utility-island",
		name: "Utility island",
		kind: "bed",
		polygon: circlePoly(70, 34, 7, 14),
		source: "derived",
		confidence: "high",
		notes:
			"Standalone island north of the house: river rock, bushes, and utility box (visible in drone + Maps).",
	}),
	zone({
		id: "trampoline",
		name: "Trampoline",
		kind: "hardscape",
		polygon: circlePoly(122, 88, 9, 20),
		source: "derived",
		confidence: "high",
		notes: "Circular trampoline on the lawn immediately east of the house.",
	}),
	zone({
		id: "tree-north",
		name: "Tree (north)",
		kind: "other",
		polygon: circlePoly(95, 28, 8, 14),
		source: "derived",
		confidence: "high",
		notes: "Canopy north of the house, between house and Leroy Ln.",
	}),
	zone({
		id: "tree-east",
		name: "Tree (east)",
		kind: "other",
		polygon: circlePoly(142, 78, 9, 14),
		source: "derived",
		confidence: "high",
		notes: "Canopy in the east lawn, near the trampoline.",
	}),
	zone({
		id: "tree-west",
		name: "Tree (west)",
		kind: "other",
		polygon: circlePoly(38, 42, 7, 14),
		source: "estimated",
		confidence: "medium",
		notes: "Larger tree near driveway / road curve (west).",
	}),
];

export function getZoneById(id: string): Zone | undefined {
	return zones.find((z) => z.id === id);
}
