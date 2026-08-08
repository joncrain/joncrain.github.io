import { describe, expect, test } from "bun:test";
import { polygonAreaSqFt, polygonPerimeterFt } from "./house-geometry";

describe("polygonAreaSqFt", () => {
	test("computes axis-aligned rectangle", () => {
		const pts = [
			{ x: 0, y: 0 },
			{ x: 10, y: 0 },
			{ x: 10, y: 5 },
			{ x: 0, y: 5 },
		];
		expect(polygonAreaSqFt(pts)).toBe(50);
	});
});

describe("polygonPerimeterFt", () => {
	test("computes rectangle perimeter", () => {
		const pts = [
			{ x: 0, y: 0 },
			{ x: 10, y: 0 },
			{ x: 10, y: 5 },
			{ x: 0, y: 5 },
		];
		expect(polygonPerimeterFt(pts)).toBe(30);
	});
});
