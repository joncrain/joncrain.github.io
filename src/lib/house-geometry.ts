import type { Point } from "../data/house/types";

/** Shoelace formula; coordinates in feet → area in sq ft. */
export function polygonAreaSqFt(points: Point[]): number {
	if (points.length < 3) return 0;
	let sum = 0;
	for (let i = 0; i < points.length; i++) {
		const a = points[i]!;
		const b = points[(i + 1) % points.length]!;
		sum += a.x * b.y - b.x * a.y;
	}
	return Math.abs(sum) / 2;
}

export function polygonPerimeterFt(points: Point[]): number {
	if (points.length < 2) return 0;
	let sum = 0;
	for (let i = 0; i < points.length; i++) {
		const a = points[i]!;
		const b = points[(i + 1) % points.length]!;
		sum += Math.hypot(b.x - a.x, b.y - a.y);
	}
	return sum;
}
