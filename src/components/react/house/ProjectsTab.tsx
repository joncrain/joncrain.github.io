import { useState } from "react";
import { getBoardForProject } from "../../../data/house/ideas";
import type { HouseProject, Zone } from "../../../data/house/types";
import ProjectIdeaBoard from "./ProjectIdeaBoard";

const STATUS_LABEL: Record<HouseProject["status"], string> = {
	idea: "Idea",
	planning: "Planning",
	in_progress: "In progress",
	done: "Done",
};

export default function ProjectsTab({
	projects,
	zones,
	ideasShareUrl,
}: {
	projects: HouseProject[];
	zones: Zone[];
	ideasShareUrl: string | null;
}) {
	const [openProjectId, setOpenProjectId] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	const zoneName = (id: string) => zones.find((z) => z.id === id)?.name ?? id;
	const openProject = projects.find((p) => p.id === openProjectId);
	const openBoard = openProjectId
		? getBoardForProject(openProjectId)
		: undefined;

	async function copyShareUrl() {
		if (!ideasShareUrl) return;
		try {
			await navigator.clipboard.writeText(ideasShareUrl);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		} catch {
			setCopied(false);
		}
	}

	if (openProject && openBoard) {
		return (
			<div>
				<button
					type="button"
					onClick={() => setOpenProjectId(null)}
					className="mb-3 text-sm font-semibold text-[var(--house-moss)]"
				>
					← All projects
				</button>
				<p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--house-soil)]">
					{STATUS_LABEL[openProject.status]}
				</p>
				<h2 className="font-display text-2xl font-semibold text-[var(--house-ink)]">
					{openProject.title}
				</h2>
				{openProject.zoneIds.length > 0 && (
					<p className="mt-1 text-xs text-[var(--house-muted)]">
						{openProject.zoneIds.map(zoneName).join(" · ")}
					</p>
				)}
				{openProject.notes && (
					<p className="mt-2 text-sm leading-snug text-[var(--house-ink)]/85">
						{openProject.notes}
					</p>
				)}
				{ideasShareUrl && openProject.id === "backyard-redo" && (
					<button
						type="button"
						onClick={copyShareUrl}
						className="mt-3 rounded-md border border-[var(--house-line)] bg-[var(--house-paper)] px-3 py-2 text-xs font-semibold text-[var(--house-ink)]"
					>
						{copied ? "Copied share link" : "Copy landscaper share link"}
					</button>
				)}
				<div className="mt-6">
					<ProjectIdeaBoard board={openBoard} />
				</div>
			</div>
		);
	}

	return (
		<ul className="space-y-3">
			{projects.map((project) => {
				const hasBoard = Boolean(getBoardForProject(project.id));
				const inner = (
					<>
						<p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--house-soil)]">
							{STATUS_LABEL[project.status]}
						</p>
						<h3 className="font-display text-lg font-semibold text-[var(--house-ink)]">
							{project.title}
						</h3>
						{project.zoneIds.length > 0 && (
							<p className="mt-1 text-xs text-[var(--house-muted)]">
								{project.zoneIds.map(zoneName).join(" · ")}
							</p>
						)}
						{project.notes && (
							<p className="mt-2 text-sm leading-snug text-[var(--house-ink)]/85">
								{project.notes}
							</p>
						)}
						{hasBoard && (
							<p className="mt-2 text-xs font-semibold text-[var(--house-moss)]">
								Open idea board →
							</p>
						)}
					</>
				);

				return (
					<li key={project.id}>
						{hasBoard ? (
							<button
								type="button"
								onClick={() => setOpenProjectId(project.id)}
								className="w-full rounded-lg border border-[var(--house-line)] bg-[var(--house-paper)] px-4 py-3 text-left transition hover:border-[var(--house-moss)]"
							>
								{inner}
							</button>
						) : (
							<div className="rounded-lg border border-[var(--house-line)] bg-[var(--house-paper)] px-4 py-3">
								{inner}
							</div>
						)}
					</li>
				);
			})}
		</ul>
	);
}
