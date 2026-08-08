import {
	ZONE_KIND_LABELS,
	type Zone,
} from "../../../data/house/types";
import { cn } from "../../../lib/utils";

function formatArea(sqFt: number): string {
	return `${Math.round(sqFt).toLocaleString()} sq ft`;
}

export default function ZonesTab({
	zones,
	selectedZoneId,
	onSelectZone,
}: {
	zones: Zone[];
	selectedZoneId: string | null;
	onSelectZone: (id: string) => void;
}) {
	const selected = zones.find((z) => z.id === selectedZoneId) ?? null;

	return (
		<div className="space-y-4">
			{selected ? (
				<div className="rounded-lg border border-[var(--house-line)] bg-[var(--house-paper)] px-4 py-3">
					<p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--house-moss)]">
						{ZONE_KIND_LABELS[selected.kind]}
					</p>
					<h3 className="font-display text-xl font-semibold text-[var(--house-ink)]">
						{selected.name}
					</h3>
					<p className="mt-1 text-sm text-[var(--house-muted)]">
						{formatArea(selected.areaSqFt)}
						{selected.perimeterFt != null &&
							` · ${Math.round(selected.perimeterFt)} ft perimeter`}
					</p>
					<p className="mt-2 text-xs text-[var(--house-muted)]">
						Source: {selected.source} · Confidence: {selected.confidence}
					</p>
					{selected.notes && (
						<p className="mt-3 text-sm leading-snug text-[var(--house-ink)]/90">
							{selected.notes}
						</p>
					)}
					{selected.elevationNotes && (
						<p className="mt-2 text-sm text-[var(--house-soil)]">
							Elevation: {selected.elevationNotes}
						</p>
					)}
				</div>
			) : (
				<p className="text-sm text-[var(--house-muted)]">
					Select a zone on the map for details.
				</p>
			)}

			<ul className="divide-y divide-[var(--house-line)] rounded-lg border border-[var(--house-line)] bg-[var(--house-paper)]">
				{zones.map((zone) => (
					<li key={zone.id}>
						<button
							type="button"
							onClick={() => onSelectZone(zone.id)}
							className={cn(
								"flex w-full items-baseline justify-between gap-3 px-4 py-3 text-left transition-colors",
								zone.id === selectedZoneId
									? "bg-[var(--house-moss)]/10"
									: "hover:bg-[var(--house-moss)]/5",
							)}
						>
							<span>
								<span className="block font-medium text-[var(--house-ink)]">
									{zone.name}
								</span>
								<span className="text-xs text-[var(--house-muted)]">
									{ZONE_KIND_LABELS[zone.kind]} · {zone.confidence}
								</span>
							</span>
							<span className="shrink-0 text-sm tabular-nums text-[var(--house-ink)]">
								{formatArea(zone.areaSqFt)}
							</span>
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
