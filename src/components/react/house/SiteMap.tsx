import { projects } from "../../../data/house/projects";
import type { PropertyInfo, Zone, ZoneKind } from "../../../data/house/types";
import { ZONE_KIND_LABELS } from "../../../data/house/types";
import { cn } from "../../../lib/utils";

/** Illustrative landscape-plan fills (Houzz-style site plan, not photo). */
const KIND_FILL: Record<ZoneKind, string> = {
	lawn: "#9cb87a",
	bed: "#6d8f5a",
	drive: "#c5c0b6",
	hardscape: "#b7b1a6",
	structure: "#e8dfd0",
	other: "#d4cfc4",
};

const KIND_STROKE: Record<ZoneKind, string> = {
	lawn: "#6f8f55",
	bed: "#4f6b40",
	drive: "#8e887c",
	hardscape: "#7d776c",
	structure: "#5c5348",
	other: "#8a8478",
};

function pointsToSvg(polygon: Zone["polygon"]): string {
	return polygon.map((p) => `${p.x},${p.y}`).join(" ");
}

function centroid(polygon: Zone["polygon"]): { x: number; y: number } {
	const n = polygon.length || 1;
	const s = polygon.reduce(
		(acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }),
		{ x: 0, y: 0 },
	);
	return { x: s.x / n, y: s.y / n };
}

function PlantSymbol({
	cx,
	cy,
	r = 2.2,
}: {
	cx: number;
	cy: number;
	r?: number;
}) {
	return (
		<g>
			<circle
				cx={cx}
				cy={cy}
				r={r}
				fill="#5f7d4e"
				fillOpacity={0.85}
				stroke="#3e5434"
				strokeWidth={0.25}
			/>
			<circle
				cx={cx}
				cy={cy}
				r={r * 0.45}
				fill="#7a9a64"
				fillOpacity={0.9}
			/>
		</g>
	);
}

function NorthArrow({ x, y }: { x: number; y: number }) {
	return (
		<g transform={`translate(${x} ${y})`}>
			<polygon points="0,-7 3.2,5 -3.2,5" fill="#2a3226" />
			<text
				x={0}
				y={12}
				textAnchor="middle"
				fontSize={4}
				fontFamily="Georgia, serif"
				fontWeight={700}
				fill="#2a3226"
			>
				N
			</text>
		</g>
	);
}

function ScaleBar({
	x,
	y,
	feet = 40,
}: {
	x: number;
	y: number;
	feet?: number;
}) {
	const half = feet / 2;
	return (
		<g transform={`translate(${x} ${y})`}>
			<line
				x1={0}
				y1={0}
				x2={feet}
				y2={0}
				stroke="#2a3226"
				strokeWidth={0.6}
			/>
			<line x1={0} y1={-2} x2={0} y2={2} stroke="#2a3226" strokeWidth={0.6} />
			<line
				x1={half}
				y1={-2}
				x2={half}
				y2={2}
				stroke="#2a3226"
				strokeWidth={0.5}
			/>
			<line
				x1={feet}
				y1={-2}
				x2={feet}
				y2={2}
				stroke="#2a3226"
				strokeWidth={0.6}
			/>
			<text
				x={feet / 2}
				y={7}
				textAnchor="middle"
				fontSize={3.2}
				fontFamily="Georgia, serif"
				fill="#2a3226"
			>
				{feet} ft
			</text>
		</g>
	);
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
	const drawOrder: ZoneKind[] = [
		"lawn",
		"bed",
		"drive",
		"hardscape",
		"structure",
		"other",
	];
	const ordered = [...zones].sort(
		(a, b) => drawOrder.indexOf(a.kind) - drawOrder.indexOf(b.kind),
	);

	const bed = zones.find((z) => z.id === "front-bed");
	const sideYard = zones.find((z) => z.id === "side-yard");
	const pathIdea = projects.find((p) => p.id === "side-path");
	const firepitIdea = projects.find((p) => p.id === "firepit");

	return (
		<div
			className="relative w-full overflow-hidden rounded-lg border border-[var(--house-line)] bg-[#efe8da]"
			style={{ aspectRatio: aspect }}
		>
			<svg
				viewBox={`0 0 ${widthFt} ${heightFt}`}
				className="h-full w-full"
				role="img"
				aria-label="Landscape site plan"
			>
				<title>Landscape site plan — 1890 Leroy Ln</title>
				<defs>
					<pattern
						id="lawn-hatch"
						width={6}
						height={6}
						patternUnits="userSpaceOnUse"
						patternTransform="rotate(35)"
					>
						<line
							x1={0}
							y1={0}
							x2={0}
							y2={6}
							stroke="#7f9a62"
							strokeWidth={0.35}
							opacity={0.35}
						/>
					</pattern>
				</defs>

				{/* Paper / site background */}
				<rect
					x={0}
					y={0}
					width={widthFt}
					height={heightFt}
					fill="#efe8da"
				/>

				{/* Optional faint underlay for tracing — off by default when src omitted */}
				{src && (
					<image
						href={src}
						x={0}
						y={0}
						width={widthFt}
						height={heightFt}
						preserveAspectRatio="none"
						opacity={0.25}
					/>
				)}

				{/* Street label */}
				<text
					x={widthFt / 2}
					y={6}
					textAnchor="middle"
					fontSize={3.5}
					fontFamily="Georgia, serif"
					letterSpacing={1.2}
					fill="#5c6758"
				>
					LEROY LN
				</text>
				<line
					x1={18}
					y1={9.5}
					x2={widthFt - 18}
					y2={9.5}
					stroke="#8a8478"
					strokeWidth={1.2}
				/>

				{/* Zones */}
				{ordered.map((zone) => {
					const selected = zone.id === selectedZoneId;
					return (
						<g key={zone.id}>
							<polygon
								points={pointsToSvg(zone.polygon)}
								fill={KIND_FILL[zone.kind]}
								fillOpacity={selected ? 0.95 : 0.88}
								stroke={selected ? "#1c2419" : KIND_STROKE[zone.kind]}
								strokeWidth={selected ? 1.1 : 0.45}
								className="cursor-pointer"
								onClick={() => onSelectZone(zone.id)}
							>
								<title>{zone.name}</title>
							</polygon>
							{zone.kind === "lawn" && (
								<polygon
									points={pointsToSvg(zone.polygon)}
									fill="url(#lawn-hatch)"
									pointerEvents="none"
								/>
							)}
						</g>
					);
				})}

				{/* Schematic shrubs in foundation bed */}
				{bed &&
					[0.2, 0.4, 0.55, 0.7, 0.85].map((t, i) => {
						const a = bed.polygon[0]!;
						const b = bed.polygon[1]!;
						return (
							<PlantSymbol
								key={`plant-${i}`}
								cx={a.x + (b.x - a.x) * t}
								cy={(a.y + bed.polygon[3]!.y) / 2}
								r={1.8}
							/>
						);
					})}

				{/* Concept overlays: side path + firepit */}
				{pathIdea && sideYard && (
					<g opacity={0.85} pointerEvents="none">
						<path
							d="M 28 50 L 28 120"
							fill="none"
							stroke="#8a5a3a"
							strokeWidth={3.5}
							strokeDasharray="3 2"
							strokeLinecap="round"
						/>
						<text
							x={33}
							y={86}
							fontSize={2.8}
							fontFamily="Georgia, serif"
							fill="#8a5a3a"
						>
							path (idea)
						</text>
					</g>
				)}
				{firepitIdea && (
					<g opacity={0.9} pointerEvents="none">
						<circle
							cx={38}
							cy={110}
							r={6}
							fill="none"
							stroke="#8a5a3a"
							strokeWidth={0.7}
							strokeDasharray="2 1.5"
						/>
						<circle cx={38} cy={110} r={2.2} fill="#c4a35a" opacity={0.7} />
						<text
							x={46}
							y={111}
							fontSize={2.8}
							fontFamily="Georgia, serif"
							fill="#8a5a3a"
						>
							firepit
						</text>
					</g>
				)}

				{/* Property line — dash-dot convention */}
				<polygon
					points={pointsToSvg(property.lotOutline)}
					fill="none"
					stroke="#2a3226"
					strokeWidth={0.85}
					strokeDasharray="5 1.5 1 1.5"
					pointerEvents="none"
				/>

				{/* Zone labels */}
				{zones
					.filter((z) => z.kind === "structure" || z.kind === "lawn")
					.map((z) => {
						const c = centroid(z.polygon);
						return (
							<text
								key={`label-${z.id}`}
								x={c.x}
								y={c.y}
								textAnchor="middle"
								dominantBaseline="middle"
								fontSize={z.kind === "structure" ? 3.6 : 3}
								fontFamily="Georgia, serif"
								fontWeight={z.kind === "structure" ? 700 : 500}
								fill="#2a3226"
								opacity={0.75}
								pointerEvents="none"
							>
								{z.kind === "structure" ? "HOUSE" : z.name.toUpperCase()}
							</text>
						);
					})}

				<NorthArrow x={widthFt - 14} y={28} />
				<ScaleBar x={14} y={heightFt - 12} feet={40} />

				<text
					x={14}
					y={heightFt - 3}
					fontSize={2.6}
					fontFamily="Georgia, serif"
					fill="#5c6758"
				>
					Site plan · concept · not a survey
				</text>
			</svg>

			<div className="pointer-events-none absolute bottom-2 right-2 max-w-[42%] rounded-md border border-[var(--house-line)] bg-[#efe8da]/95 px-2 py-1.5 shadow-sm">
				<p className="mb-1 font-display text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--house-ink)]">
					Legend
				</p>
				<div className="flex flex-wrap gap-1.5">
					{(["lawn", "bed", "drive", "structure"] as ZoneKind[]).map(
						(kind) => (
							<span
								key={kind}
								className={cn(
									"inline-flex items-center gap-1 text-[9px] text-[var(--house-ink)]",
								)}
							>
								<span
									className="inline-block h-2 w-2 rounded-[1px] border border-black/20"
									style={{ backgroundColor: KIND_FILL[kind] }}
								/>
								{ZONE_KIND_LABELS[kind]}
							</span>
						),
					)}
				</div>
			</div>
		</div>
	);
}
