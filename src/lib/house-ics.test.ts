import { describe, expect, test } from "bun:test";
import type { CareEvent } from "../data/house/types";
import { buildHouseCalendarIcs } from "./house-ics";

const sample: CareEvent[] = [
	{
		id: "fert-1",
		type: "fertilize",
		zoneIds: ["front-lawn"],
		date: "2026-09-15",
		status: "planned",
		title: "Fall fertilizer — front lawn",
	},
	{
		id: "mow-done",
		type: "mow",
		zoneIds: ["front-lawn"],
		date: "2026-08-01",
		status: "done",
		title: "Mowed",
	},
];

describe("buildHouseCalendarIcs", () => {
	test("includes only planned events", () => {
		const ics = buildHouseCalendarIcs(sample, "America/New_York");
		expect(ics).toContain("BEGIN:VCALENDAR");
		expect(ics).toContain("SUMMARY:Fall fertilizer — front lawn");
		expect(ics).toContain("DTSTART;VALUE=DATE:20260915");
		expect(ics).not.toContain("SUMMARY:Mowed");
	});

	test("escapes commas and semicolons in summary", () => {
		const ics = buildHouseCalendarIcs(
			[
				{
					id: "x",
					type: "other",
					zoneIds: [],
					date: "2026-10-01",
					status: "planned",
					title: "Trim; hedge, north",
				},
			],
			"America/New_York",
		);
		expect(ics).toContain("SUMMARY:Trim\\; hedge\\, north");
	});
});
