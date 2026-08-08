import type { PropertyInfo, Zone, ZoneKind } from "../../../data/house/types";
import { cn } from "../../../lib/utils";

const KIND_FILL: Record<ZoneKind, string> = {
	lawn: "#3f6b45",
	bed: "#6b8f71",
	drive: "#8a8680",
	hardscape: "#9a8f7e",
	structure: "#5c6570",
	other: "#7a7a70",
};

function pointsToSvg(polygon: Zone["polygon"]): string {
	return polygon.map((p) => `${p.x},${p.y}`).join(" ");
}

export default function SiteMap({
	property,
	zones,
	selectedZoneId,
	onSelectZone,
}: {
	property: PropertyInfo;
	zones: Zone[];
	selectedZoneId: string | null;
	onSelectZone: (id: string) => void;
}) {
	const { widthFt, heightFt, src } = property.underlay;
	const aspect = `${widthFt} / ${heightFt}`;

	return (
		<div
			className="relative w-full overflow-hidden rounded-lg border border-[var(--house-line)] bg-[var(--house-moss-deep)]"
			style={{ aspectRatio: aspect }}
		>
			<svg
				viewBox={`0 0 ${widthFt} ${heightFt}`}
				className="h-full w-full"
				role="img"
				aria-label="Property site map"
			>
				<title>Property site map</title>
				<image
					href={src}
					x={0}
					y={0}
					width={widthFt}
					height={heightFt}
					preserveAspectRatio="none"
					opacity={0.88}
				/>
				{zones.map((zone) => {
					const selected = zone.id === selectedZoneId;
					return (
						<polygon
							key={zone.id}
							points={pointsToSvg(zone.polygon)}
							fill={KIND_FILL[zone.kind]}
							fillOpacity={selected ? 0.55 : 0.35}
							stroke={selected ? "#f2e8d5" : "#1a2418"}
							strokeWidth={selected ? 1.2 : 0.5}
							vectorEffect="non-scaling-stroke"
							className="cursor-pointer transition-opacity hover:fill-opacity-50"
							onClick={() => onSelectZone(zone.id)}
						>
							<title>{zone.name}</title>
						</polygon>
					);
				})}
			</svg>
			<p className="pointer-events-none absolute bottom-2 left-3 text-[11px] font-medium tracking-wide text-[var(--house-paper)]/80">
				Tap a zone
			</p>
			<div className="pointer-events-none absolute right-2 top-2 flex flex-wrap justify-end gap-1">
				{(Object.keys(KIND_FILL) as ZoneKind[]).map((kind) => (
					<span
						key={kind}
						className={cn(
							"rounded px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-[var(--house-paper)]",
						)}
						style={{ backgroundColor: `${KIND_FILL[kind]}cc` }}
					>
						{kind}
					</span>
				))}
			</div>
		</div>
	);
}
