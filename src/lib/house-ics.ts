import type { CareEvent } from "../data/house/types";

function icsEscape(text: string): string {
	return text
		.replace(/\\/g, "\\\\")
		.replace(/;/g, "\\;")
		.replace(/,/g, "\\,")
		.replace(/\n/g, "\\n");
}

function yyyymmdd(date: string): string {
	return date.replaceAll("-", "");
}

/** Build a minimal ICS calendar from planned care events (all-day). */
export function buildHouseCalendarIcs(
	events: CareEvent[],
	timezone: string,
): string {
	const planned = events.filter((e) => e.status === "planned");
	const lines = [
		"BEGIN:VCALENDAR",
		"VERSION:2.0",
		"PRODID:-//joncra.in//House Care//EN",
		"CALSCALE:GREGORIAN",
		"METHOD:PUBLISH",
		`X-WR-TIMEZONE:${timezone}`,
		"X-WR-CALNAME:House Care",
	];

	for (const e of planned) {
		const start = yyyymmdd(e.date);
		const endRaw = e.endDate ?? e.date;
		const endDate = new Date(`${endRaw}T12:00:00Z`);
		endDate.setUTCDate(endDate.getUTCDate() + 1);
		const end = endDate.toISOString().slice(0, 10).replaceAll("-", "");

		lines.push(
			"BEGIN:VEVENT",
			`UID:${e.id}@house.joncra.in`,
			`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
			`DTSTART;VALUE=DATE:${start}`,
			`DTEND;VALUE=DATE:${end}`,
			`SUMMARY:${icsEscape(e.title)}`,
		);
		if (e.notes) lines.push(`DESCRIPTION:${icsEscape(e.notes)}`);
		lines.push("END:VEVENT");
	}

	lines.push("END:VCALENDAR");
	return `${lines.join("\r\n")}\r\n`;
}
