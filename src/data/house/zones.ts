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
 * Polygons in underlay feet (see property.originNote).
 * Digitized from drone underlay + Isabella County parcel facts (0.51 ac).
 * Task 8 will tighten against GIS polygon / tape checks.
 */
export const zones: Zone[] = [
	zone({
		id: "house-footprint",
		name: "House footprint",
		kind: "structure",
		polygon: [
			{ x: 52, y: 18 },
			{ x: 108, y: 18 },
			{ x: 108, y: 58 },
			{ x: 88, y: 58 },
			{ x: 88, y: 52 },
			{ x: 52, y: 52 },
		],
		source: "derived",
		confidence: "medium",
		notes: "Includes attached garage massing from aerial; not a survey footprint.",
	}),
	zone({
		id: "driveway",
		name: "Driveway",
		kind: "drive",
		polygon: [
			{ x: 88, y: 52 },
			{ x: 108, y: 52 },
			{ x: 108, y: 58 },
			{ x: 118, y: 108 },
			{ x: 92, y: 112 },
			{ x: 82, y: 70 },
		],
		source: "derived",
		confidence: "medium",
		notes: "Concrete drive from garage toward Leroy Ln. Tape width check recommended.",
	}),
	zone({
		id: "front-lawn",
		name: "Front lawn",
		kind: "lawn",
		polygon: [
			{ x: 8, y: 70 },
			{ x: 82, y: 70 },
			{ x: 92, y: 112 },
			{ x: 118, y: 108 },
			{ x: 130, y: 118 },
			{ x: 8, y: 118 },
		],
		source: "derived",
		confidence: "medium",
		notes: "Primary street-facing turf panel (Mammotion work area candidate).",
	}),
	zone({
		id: "side-yard",
		name: "Side yard (west)",
		kind: "lawn",
		polygon: [
			{ x: 8, y: 18 },
			{ x: 52, y: 18 },
			{ x: 52, y: 70 },
			{ x: 8, y: 70 },
		],
		source: "estimated",
		confidence: "medium",
		notes: "West side yard — path + firepit ideas. Includes parking-pad edge turf.",
		elevationNotes: "Grade toward street/side — confirm before hardscape.",
	}),
	zone({
		id: "parking-pad",
		name: "Side parking pad",
		kind: "hardscape",
		polygon: [
			{ x: 14, y: 40 },
			{ x: 36, y: 40 },
			{ x: 36, y: 58 },
			{ x: 14, y: 58 },
		],
		source: "derived",
		confidence: "medium",
		notes: "Concrete pad west of house (vehicle parking in aerial).",
	}),
	zone({
		id: "front-bed",
		name: "Front foundation bed",
		kind: "bed",
		polygon: [
			{ x: 48, y: 48 },
			{ x: 52, y: 42 },
			{ x: 52, y: 52 },
			{ x: 88, y: 52 },
			{ x: 88, y: 58 },
			{ x: 70, y: 62 },
			{ x: 55, y: 60 },
			{ x: 48, y: 56 },
		],
		source: "estimated",
		confidence: "low",
		notes: "Wavy gravel bed with shrubs along front/west foundation. Outline approximate.",
	}),
	zone({
		id: "rear-lawn",
		name: "Rear / north lawn",
		kind: "lawn",
		polygon: [
			{ x: 52, y: 4 },
			{ x: 130, y: 4 },
			{ x: 130, y: 18 },
			{ x: 108, y: 18 },
			{ x: 52, y: 18 },
		],
		source: "estimated",
		confidence: "low",
		notes: "Strip behind house toward neighbor; full lot outline TBD from FetchGIS polygon.",
	}),
];

export function getZoneById(id: string): Zone | undefined {
	return zones.find((z) => z.id === id);
}
