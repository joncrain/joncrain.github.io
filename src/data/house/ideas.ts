import type { ProjectBoard } from "./types";

/** Idea boards keyed by project id. Photos live under /public/house/ideas/. */
export const boards: ProjectBoard[] = [
	{
		projectId: "backyard-redo",
		photos: [
			{
				id: "existing-overhead",
				src: "/house/ideas/backyard/existing-overhead.jpg",
				caption: "Property overhead — north up. Rear yard faces the water.",
				section: "existing",
				sort: 1,
			},
			{
				id: "existing-overhead-looking-back",
				src: "/house/ideas/backyard/existing-overhead-looking-back.jpg",
				caption: "Drone view looking back toward the house from the water side.",
				section: "existing",
				sort: 2,
			},
			{
				id: "existing-high-angle",
				src: "/house/ideas/backyard/existing-high-angle.jpg",
				caption: "High angle of the rear yard and deck from above.",
				section: "existing",
				sort: 3,
			},
			{
				id: "existing-back",
				src: "/house/ideas/backyard/existing-back.jpg",
				caption: "Ground-level view of the backyard as it is today.",
				section: "existing",
				sort: 4,
			},
			{
				id: "existing-deck-01",
				src: "/house/ideas/backyard/existing-deck-01.jpg",
				caption: "Existing deck — main outdoor living surface.",
				section: "existing",
				sort: 5,
			},
			{
				id: "existing-side-01",
				src: "/house/ideas/backyard/existing-side-01.jpg",
				caption: "Side yard context (east) — path / firepit territory.",
				section: "existing",
				sort: 6,
			},
			{
				id: "existing-dusk",
				src: "/house/ideas/backyard/existing-dusk.jpg",
				caption: "House and yard at dusk — lighting and atmosphere baseline.",
				section: "existing",
				sort: 7,
			},
			{
				id: "inspiration-1",
				src: "/house/ideas/backyard/inspiration-1.jpg",
				caption: "Inspiration — soft curves, layered plantings, and a clear walk path.",
				section: "inspiration",
				sort: 1,
			},
			{
				id: "inspiration-2",
				src: "/house/ideas/backyard/inspiration-2.jpg",
				caption: "Inspiration — seating nestled into beds, not a hard patio island.",
				section: "inspiration",
				sort: 2,
			},
			{
				id: "inspiration-3",
				src: "/house/ideas/backyard/inspiration-3.jpg",
				caption: "Inspiration — cedar / warm wood accents against greenery.",
				section: "inspiration",
				sort: 3,
			},
			{
				id: "concept-cedar-curves",
				src: "/house/ideas/backyard/concept-cedar-curves.jpg",
				caption:
					"Concept — cedar curves: flowing beds and path toward the water.",
				section: "concepts",
				sort: 1,
			},
			{
				id: "concept-cedar-curves-overhead",
				src: "/house/ideas/backyard/concept-cedar-curves-overhead.jpg",
				caption: "Concept — cedar curves overhead plan overlaid on the lot.",
				section: "concepts",
				sort: 2,
			},
			{
				id: "concept-dusk-option-1",
				src: "/house/ideas/backyard/concept-dusk-option-1.jpg",
				caption: "Concept — dusk option 1 (lighting / planting mood).",
				section: "concepts",
				sort: 3,
			},
			{
				id: "concept-dusk-option-2",
				src: "/house/ideas/backyard/concept-dusk-option-2.jpg",
				caption: "Concept — dusk option 2 (alternate mood).",
				section: "concepts",
				sort: 4,
			},
		],
	},
];

export function getBoardForProject(
	projectId: string,
): ProjectBoard | undefined {
	return boards.find((b) => b.projectId === projectId);
}
