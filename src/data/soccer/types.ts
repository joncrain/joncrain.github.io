export type PracticeFormat =
	| "play-practice-play"
	| "classic"
	| "hybrid"
	| "stations";

export type ThemeCode = "P" | "B" | "S" | "T" | "F" | "D" | "discovery";

export interface DrillCard {
	id: string;
	title: string;
	durationMin: number;
	setup: string;
	rules: string[];
	coachingPoints: string[];
	successLooksLike: string;
	liveCues?: string[];
	freezeIf?: string;
	constraint?: string;
	gear?: string;
}

export interface PracticeBlock {
	id: string;
	label: string;
	startOffsetMin: number;
	durationMin: number;
	drill: DrillCard;
	/** Parallel stations shown as sub-cards (stations format). */
	stations?: DrillCard[];
}

export interface PracticeSession {
	id: string;
	date: string; // YYYY-MM-DD
	dayLabel: string;
	timeLabel: string;
	durationMin: number;
	location: string;
	title: string;
	format: PracticeFormat;
	themes: ThemeCode[];
	themeSummary: string;
	objectives: string[];
	blocks: PracticeBlock[];
	notes?: string[];
}

export const THEME_LABELS: Record<ThemeCode, string> = {
	P: "Possession / quick passing",
	B: "Build-out composure",
	S: "Spacing & shape",
	T: "Transition",
	F: "Finishing",
	D: "Unit defending",
	discovery: "Roster discovery",
};

export const FORMAT_LABELS: Record<PracticeFormat, string> = {
	"play-practice-play": "Play–Practice–Play",
	classic: "Classic",
	hybrid: "Hybrid",
	stations: "Stations",
};
