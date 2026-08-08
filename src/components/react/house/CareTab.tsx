import {
	CARE_TYPE_LABELS,
	type CareEvent,
	type Zone,
} from "../../../data/house/types";

function todayISO(): string {
	return new Date().toISOString().slice(0, 10);
}

function EventRow({ event, zoneNames }: { event: CareEvent; zoneNames: string }) {
	return (
		<li className="px-4 py-3">
			<p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--house-moss)]">
				{CARE_TYPE_LABELS[event.type]} · {event.date}
			</p>
			<p className="font-medium text-[var(--house-ink)]">{event.title}</p>
			{zoneNames && (
				<p className="text-xs text-[var(--house-muted)]">{zoneNames}</p>
			)}
			{event.product && (
				<p className="text-xs text-[var(--house-muted)]">Product: {event.product}</p>
			)}
			{event.notes && (
				<p className="mt-1 text-sm text-[var(--house-ink)]/80">{event.notes}</p>
			)}
		</li>
	);
}

export default function CareTab({
	events,
	zones,
	selectedZoneId,
}: {
	events: CareEvent[];
	zones: Zone[];
	selectedZoneId: string | null;
}) {
	const zoneName = (id: string) => zones.find((z) => z.id === id)?.name ?? id;
	const filtered = selectedZoneId
		? events.filter((e) => e.zoneIds.includes(selectedZoneId))
		: events;

	const today = todayISO();
	const upcoming = filtered
		.filter((e) => e.status === "planned" && e.date >= today)
		.sort((a, b) => a.date.localeCompare(b.date));
	const recent = filtered
		.filter((e) => e.status === "done" || (e.status === "planned" && e.date < today))
		.sort((a, b) => b.date.localeCompare(a.date));

	const names = (e: CareEvent) => e.zoneIds.map(zoneName).join(", ");

	return (
		<div className="space-y-4">
			{selectedZoneId && (
				<p className="text-xs text-[var(--house-muted)]">
					Filtered to {zoneName(selectedZoneId)}. Clear map selection to see all.
				</p>
			)}

			<section>
				<h3 className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.12em] text-[var(--house-ink)]">
					Upcoming
				</h3>
				{upcoming.length === 0 ? (
					<p className="text-sm text-[var(--house-muted)]">No upcoming care events.</p>
				) : (
					<ul className="divide-y divide-[var(--house-line)] rounded-lg border border-[var(--house-line)] bg-[var(--house-paper)]">
						{upcoming.map((e) => (
							<EventRow key={e.id} event={e} zoneNames={names(e)} />
						))}
					</ul>
				)}
			</section>

			<section>
				<h3 className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.12em] text-[var(--house-ink)]">
					Recent
				</h3>
				{recent.length === 0 ? (
					<p className="text-sm text-[var(--house-muted)]">No history yet.</p>
				) : (
					<ul className="divide-y divide-[var(--house-line)] rounded-lg border border-[var(--house-line)] bg-[var(--house-paper)]">
						{recent.map((e) => (
							<EventRow key={e.id} event={e} zoneNames={names(e)} />
						))}
					</ul>
				)}
			</section>
		</div>
	);
}
