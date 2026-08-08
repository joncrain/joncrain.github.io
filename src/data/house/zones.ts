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
 * Plan-view zones for the landscape site plan (see property.originNote).
 * North = top of drawing; Leroy Ln along north edge.
 */
export const zones: Zone[] = [
	zone({
		id: "house-footprint",
		name: "House",
		kind: "structure",
		polygon: [
			{ x: 58, y: 52 },
			{ x: 118, y: 52 },
			{ x: 118, y: 92 },
			{ x: 98, y: 92 },
			{ x: 98, y: 84 },
			{ x: 58, y: 84 },
		],
		source: "derived",
		confidence: "medium",
		notes: "Simplified footprint + attached garage (east). Not a survey outline.",
	}),
	zone({
		id: "driveway",
		name: "Driveway",
		kind: "drive",
		polygon: [
			{ x: 98, y: 18 },
			{ x: 122, y: 18 },
			{ x: 122, y: 92 },
			{ x: 98, y: 92 },
		],
		source: "derived",
		confidence: "medium",
		notes: "Concrete drive from garage north to Leroy Ln. Confirm width with tape.",
	}),
	zone({
		id: "front-lawn",
		name: "Front lawn",
		kind: "lawn",
		polygon: [
			{ x: 18, y: 14 },
			{ x: 98, y: 14 },
			{ x: 98, y: 52 },
			{ x: 58, y: 52 },
			{ x: 58, y: 44 },
			{ x: 18, y: 44 },
		],
		source: "estimated",
		confidence: "medium",
		notes: "Street-facing turf between house and Leroy Ln.",
	}),
	zone({
		id: "side-yard",
		name: "Side yard (west)",
		kind: "lawn",
		polygon: [
			{ x: 18, y: 44 },
			{ x: 58, y: 44 },
			{ x: 58, y: 132 },
			{ x: 18, y: 132 },
		],
		source: "estimated",
		confidence: "medium",
		notes: "West side yard — path + firepit concept area.",
		elevationNotes: "Confirm grade before hardscape.",
	}),
	zone({
		id: "rear-lawn",
		name: "Rear lawn",
		kind: "lawn",
		polygon: [
			{ x: 58, y: 92 },
			{ x: 148, y: 92 },
			{ x: 148, y: 142 },
			{ x: 58, y: 142 },
		],
		source: "estimated",
		confidence: "medium",
		notes: "Rear yard south of house.",
	}),
	zone({
		id: "east-lawn",
		name: "East lawn",
		kind: "lawn",
		polygon: [
			{ x: 122, y: 18 },
			{ x: 148, y: 18 },
			{ x: 148, y: 92 },
			{ x: 122, y: 92 },
		],
		source: "estimated",
		confidence: "low",
		notes: "Strip east of driveway toward neighbor.",
	}),
	zone({
		id: "parking-pad",
		name: "Side parking pad",
		kind: "hardscape",
		polygon: [
			{ x: 24, y: 68 },
			{ x: 48, y: 68 },
			{ x: 48, y: 88 },
			{ x: 24, y: 88 },
		],
		source: "derived",
		confidence: "medium",
		notes: "West concrete parking pad.",
	}),
	zone({
		id: "front-bed",
		name: "Front foundation bed",
		kind: "bed",
		polygon: [
			{ x: 54, y: 44 },
			{ x: 98, y: 44 },
			{ x: 98, y: 52 },
			{ x: 58, y: 52 },
			{ x: 58, y: 48 },
			{ x: 54, y: 48 },
		],
		source: "estimated",
		confidence: "low",
		notes: "Foundation planting bed — shrub symbols on plan are schematic.",
	}),
];

export function getZoneById(id: string): Zone | undefined {
	return zones.find((z) => z.id === id);
}
