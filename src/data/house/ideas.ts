import type { ProjectBoard } from "./types";

/** Idea boards keyed by project id. Photos live under /public/house/ideas/. */
export const boards: ProjectBoard[] = [
	{
		projectId: "backyard-redo",
		photos: [
			{
				id: "existing-overhead",
				src: "/house/ideas/backyard/existing-overhead.jpg",
				caption: "Property overhead — north up.",
				section: "existing",
				sort: 1,
			},
			{
				id: "existing-overhead-looking-back",
				src: "/house/ideas/backyard/existing-overhead-looking-back.jpg",
				caption: "Property overhead - south up.",
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
				caption: "Existing deck — would like to add a tree to block the view into the neighbors garage/driveway.",
				section: "existing",
				sort: 5,
			},
			{
				id: "existing-deck-02",
				src: "/house/ideas/backyard/existing-deck-02.jpg",
				caption: "Existing deck — second angle.",
				section: "existing",
				sort: 6,
			},
			{
				id: "existing-side-01",
				src: "/house/ideas/backyard/existing-side-01.jpg",
				caption: "Side yard context (east) — path .",
				section: "existing",
				sort: 7,
			},
			{
				id: "existing-dusk",
				src: "/house/ideas/backyard/existing-dusk.jpg",
				caption: "House and yard at dusk — lighting and atmosphere baseline.",
				section: "existing",
				sort: 8,
			},
			{
				id: "inspiration-1",
				src: "/house/ideas/backyard/inspiration-1.jpg",
				caption: "Inspiration — colors and details like privacy barrier.",
				section: "inspiration",
				sort: 1,
			},
			{
				id: "inspiration-2",
				src: "/house/ideas/backyard/inspiration-2.jpg",
				caption: "Inspiration — cozy with lights on posts and close vegetation.",
				section: "inspiration",
				sort: 2,
			},
			{
				id: "inspiration-3",
				src: "/house/ideas/backyard/inspiration-3.jpg",
				caption: "Inspiration — potentially add some sort of privacy screen.",
				section: "inspiration",
				sort: 3,
			},
			{
				id: "concept-cedar-curves",
				src: "/house/ideas/backyard/concept-cedar-curves.jpg",
				caption:
					"Concept — terraced beds and firepit with built in seating",
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
				caption: "Concept — dusk option 1 (placement is correct, some details are not right).",
				section: "concepts",
				sort: 3,
			},
			{
				id: "concept-dusk-option-2",
				src: "/house/ideas/backyard/concept-dusk-option-2.jpg",
				caption: "Concept — dusk option 2 (better details more issues with placements).",
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
