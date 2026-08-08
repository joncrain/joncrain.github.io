import { polygonAreaSqFt, polygonPerimeterFt } from "../../lib/house-geometry";
import type { Zone } from "./types";

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

/**
 * Plan-view zones. North = top; Leroy Ln along north edge.
 * Garage + driveway on the **west** (left) — matches street view of the facade.
 */
export const zones: Zone[] = [
	zone({
		id: "house-footprint",
		name: "House",
		kind: "structure",
		polygon: [
			{ x: 52, y: 52 },
			{ x: 112, y: 52 },
			{ x: 112, y: 84 },
			{ x: 72, y: 84 },
			{ x: 72, y: 92 },
			{ x: 52, y: 92 },
		],
		source: "derived",
		confidence: "medium",
		notes: "House + attached garage on west. Simplified footprint — not a survey.",
	}),
	zone({
		id: "driveway",
		name: "Driveway",
		kind: "drive",
		polygon: [
			{ x: 48, y: 18 },
			{ x: 72, y: 18 },
			{ x: 72, y: 92 },
			{ x: 48, y: 92 },
		],
		source: "derived",
		confidence: "medium",
		notes: "Concrete drive from west garage north to Leroy Ln.",
	}),
	zone({
		id: "front-lawn",
		name: "Front lawn",
		kind: "lawn",
		polygon: [
			{ x: 72, y: 14 },
			{ x: 152, y: 14 },
			{ x: 152, y: 44 },
			{ x: 112, y: 44 },
			{ x: 112, y: 52 },
			{ x: 72, y: 52 },
		],
		source: "estimated",
		confidence: "medium",
		notes: "Street-facing turf between house and Leroy Ln (east of drive).",
	}),
	zone({
		id: "side-yard",
		name: "Side yard (east)",
		kind: "lawn",
		polygon: [
			{ x: 112, y: 44 },
			{ x: 152, y: 44 },
			{ x: 152, y: 132 },
			{ x: 112, y: 132 },
		],
		source: "estimated",
		confidence: "medium",
		notes: "East side yard — path + firepit concept area.",
		elevationNotes: "Confirm grade before hardscape.",
	}),
	zone({
		id: "rear-lawn",
		name: "Rear lawn",
		kind: "lawn",
		polygon: [
			{ x: 22, y: 92 },
			{ x: 112, y: 92 },
			{ x: 112, y: 142 },
			{ x: 22, y: 142 },
		],
		source: "estimated",
		confidence: "medium",
		notes: "Rear yard south of house.",
	}),
	zone({
		id: "west-lawn",
		name: "West lawn",
		kind: "lawn",
		polygon: [
			{ x: 18, y: 18 },
			{ x: 48, y: 18 },
			{ x: 48, y: 92 },
			{ x: 18, y: 92 },
		],
		source: "estimated",
		confidence: "low",
		notes: "Strip west of driveway.",
	}),
	zone({
		id: "parking-pad",
		name: "Side parking pad",
		kind: "hardscape",
		polygon: [
			{ x: 122, y: 68 },
			{ x: 146, y: 68 },
			{ x: 146, y: 88 },
			{ x: 122, y: 88 },
		],
		source: "derived",
		confidence: "medium",
		notes: "East concrete parking pad.",
	}),
	zone({
		id: "front-bed",
		name: "Front foundation bed",
		kind: "bed",
		polygon: [
			{ x: 72, y: 44 },
			{ x: 116, y: 44 },
			{ x: 116, y: 48 },
			{ x: 112, y: 48 },
			{ x: 112, y: 52 },
			{ x: 72, y: 52 },
		],
		source: "estimated",
		confidence: "low",
		notes: "Foundation planting bed along front facade.",
	}),
];

export function getZoneById(id: string): Zone | undefined {
	return zones.find((z) => z.id === id);
}
