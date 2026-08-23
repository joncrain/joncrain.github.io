import type { ProjectBoard } from "./types";

/** Idea boards keyed by project id. Photos live under /public/house/ideas/. */
export const boards: ProjectBoard[] = [
	{
		projectId: "backyard-redo",
		photos: [],
	},
];

export function getBoardForProject(
	projectId: string,
): ProjectBoard | undefined {
	return boards.find((b) => b.projectId === projectId);
}
