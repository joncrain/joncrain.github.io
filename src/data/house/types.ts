export type Point = { x: number; y: number };

export type ZoneKind =
	| "lawn"
	| "bed"
	| "drive"
	| "hardscape"
	| "structure"
	| "other";

export type MeasurementSource = "gis" | "measured" | "estimated" | "derived";
export type Confidence = "high" | "medium" | "low";

export type CareType = "mow" | "fertilize" | "trim" | "treat" | "other";
export type CareStatus = "planned" | "done";

export type ProjectStatus = "idea" | "planning" | "in_progress" | "done";

export interface PropertyInfo {
	label: string;
	timezone: string;
	originNote: string;
	northIsNegativeY: boolean;
	lotAreaSqFt?: number;
	underlay: {
		src: string;
		widthFt: number;
		heightFt: number;
	};
	roof?: { areaSqFt?: number; pitch?: string; notes?: string };
}

export interface Zone {
	id: string;
	name: string;
	kind: ZoneKind;
	polygon: Point[];
	areaSqFt: number;
	perimeterFt?: number;
	source: MeasurementSource;
	confidence: Confidence;
	notes?: string;
	elevationNotes?: string;
}

export interface CareEvent {
	id: string;
	type: CareType;
	zoneIds: string[];
	date: string;
	endDate?: string;
	status: CareStatus;
	title: string;
	notes?: string;
	product?: string;
}

export interface HouseProject {
	id: string;
	title: string;
	status: ProjectStatus;
	zoneIds: string[];
	notes?: string;
}

export const ZONE_KIND_LABELS: Record<ZoneKind, string> = {
	lawn: "Lawn",
	bed: "Bed",
	drive: "Driveway",
	hardscape: "Hardscape",
	structure: "Structure",
	other: "Other",
};

export const CARE_TYPE_LABELS: Record<CareType, string> = {
	mow: "Mow",
	fertilize: "Fertilize",
	trim: "Trim",
	treat: "Treat",
	other: "Other",
};
