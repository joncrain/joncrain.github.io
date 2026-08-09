import type { HouseProject, Zone } from "../../../data/house/types";

const STATUS_LABEL: Record<HouseProject["status"], string> = {
	idea: "Idea",
	planning: "Planning",
	in_progress: "In progress",
	done: "Done",
};

export default function ProjectsTab({
	projects,
	zones,
}: {
	projects: HouseProject[];
	zones: Zone[];
}) {
	const zoneName = (id: string) => zones.find((z) => z.id === id)?.name ?? id;

	return (
		<ul className="space-y-3">
			{projects.map((project) => (
				<li
					key={project.id}
					className="rounded-lg border border-[var(--house-line)] bg-[var(--house-paper)] px-4 py-3"
				>
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
				</li>
			))}
		</ul>
	);
}
