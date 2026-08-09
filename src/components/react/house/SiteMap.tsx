import type { PropertyInfo, Zone, ZoneKind } from "../../../data/house/types";
import { ZONE_KIND_LABELS } from "../../../data/house/types";
import { cn } from "../../../lib/utils";

/** Illustrative landscape-plan fills (site plan, not photo). */
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

function isTree(zone: Zone): boolean {
	return zone.id.startsWith("tree-");
}

function TreeCanopy({ zone, selected }: { zone: Zone; selected: boolean }) {
	const c = centroid(zone.polygon);
	const rs = zone.polygon.map((p) => Math.hypot(p.x - c.x, p.y - c.y));
	const r = rs.reduce((a, b) => a + b, 0) / rs.length;
	return (
		<g>
			<circle
				cx={c.x}
				cy={c.y}
				r={r}
				fill="#4f7344"
				fillOpacity={selected ? 0.85 : 0.72}
				stroke={selected ? "#1c2419" : "#2f4a2a"}
				strokeWidth={selected ? 1 : 0.45}
			/>
			<circle
				cx={c.x - r * 0.25}
				cy={c.y - r * 0.15}
				r={r * 0.55}
				fill="#6a9458"
				opacity={0.55}
			/>
			<circle
				cx={c.x + r * 0.2}
				cy={c.y + r * 0.1}
				r={r * 0.4}
				fill="#3d5c36"
				opacity={0.45}
			/>
			<title>{zone.name}</title>
		</g>
	);
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
			<circle cx={cx} cy={cy} r={r * 0.45} fill="#7a9a64" fillOpacity={0.9} />
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
			<line x1={0} y1={0} x2={feet} y2={0} stroke="#2a3226" strokeWidth={0.6} />
			<line x1={0} y1={-2} x2={0} y2={2} stroke="#2a3226" strokeWidth={0.6} />
			<line x1={half} y1={-2} x2={half} y2={2} stroke="#2a3226" strokeWidth={0.5} />
			<line x1={feet} y1={-2} x2={feet} y2={2} stroke="#2a3226" strokeWidth={0.6} />
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
	const utility = zones.find((z) => z.id === "utility-island");

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
					<pattern
						id="river-rock"
						width={4}
						height={4}
						patternUnits="userSpaceOnUse"
					>
						<circle cx={1} cy={1.2} r={0.7} fill="#cfc8bc" />
						<circle cx={2.8} cy={2.5} r={0.55} fill="#b8b0a4" />
						<circle cx={2} cy={0.8} r={0.45} fill="#ddd6ca" />
					</pattern>
				</defs>

				<rect x={0} y={0} width={widthFt} height={heightFt} fill="#efe8da" />

				{src && (
					<image
						href={src}
						x={0}
						y={0}
						width={widthFt}
						height={heightFt}
						preserveAspectRatio="none"
						opacity={0.55}
					/>
				)}

				{/* Street label — only when no photo underlay */}
				{!src && (
					<>
						<path
							d="M 15 55 Q 30 18 78 8 Q 120 6 150 30"
							fill="none"
							stroke="#8a8478"
							strokeWidth={2.2}
						/>
						<text
							x={78}
							y={5}
							textAnchor="middle"
							fontSize={3.2}
							fontFamily="Georgia, serif"
							letterSpacing={1.1}
							fill="#5c6758"
						>
							LEROY LN
						</text>
					</>
				)}

				{ordered.map((zone) => {
					const selected = zone.id === selectedZoneId;
					if (isTree(zone)) {
						return (
							<g
								key={zone.id}
								className="cursor-pointer"
								onClick={() => onSelectZone(zone.id)}
							>
								<TreeCanopy zone={zone} selected={selected} />
							</g>
						);
					}

					const isUtility = zone.id === "utility-island";
					const isTrampoline = zone.id === "trampoline";
					const baseOpacity = src ? 0.28 : 0.88;

					return (
						<g key={zone.id}>
							<polygon
								points={pointsToSvg(zone.polygon)}
								fill={
									isUtility
										? "url(#river-rock)"
										: isTrampoline
											? "#3a3a3a"
											: KIND_FILL[zone.kind]
								}
								fillOpacity={
									isTrampoline
										? selected
											? 0.55
											: 0.35
										: selected
											? Math.min(baseOpacity + 0.25, 0.9)
											: baseOpacity
								}
								stroke={selected ? "#ffcc00" : KIND_STROKE[zone.kind]}
								strokeWidth={selected ? 2.2 : src ? 1.4 : 0.7}
								className="cursor-pointer"
								onClick={() => onSelectZone(zone.id)}
							>
								<title>{zone.name}</title>
							</polygon>
							{zone.kind === "lawn" && !src && (
								<polygon
									points={pointsToSvg(zone.polygon)}
									fill="url(#lawn-hatch)"
									pointerEvents="none"
								/>
							)}
							{isTrampoline && (
								<circle
									cx={centroid(zone.polygon).x}
									cy={centroid(zone.polygon).y}
									r={3.5}
									fill="none"
									stroke="#1c2419"
									strokeWidth={0.5}
									opacity={0.5}
									pointerEvents="none"
								/>
							)}
						</g>
					);
				})}

				{/* Boxwoods along foundation bed */}
				{bed &&
					[0.15, 0.32, 0.48, 0.64, 0.8].map((t, i) => {
						const a = bed.polygon[0]!;
						const b = bed.polygon[1]!;
						return (
							<PlantSymbol
								key={`box-${i}`}
								cx={a.x + (b.x - a.x) * t}
								cy={(a.y + bed.polygon[3]!.y) / 2}
								r={1.6}
							/>
						);
					})}

				{/* Bushes on utility island */}
				{utility &&
					[0, 1, 2, 3].map((i) => {
						const c = centroid(utility.polygon);
						const ang = (Math.PI / 2) * i + 0.4;
						return (
							<PlantSymbol
								key={`util-plant-${i}`}
								cx={c.x + Math.cos(ang) * 3.2}
								cy={c.y + Math.sin(ang) * 3.2}
								r={1.5}
							/>
						);
					})}

				{/* Property line */}
				<polygon
					points={pointsToSvg(property.lotOutline)}
					fill="none"
					stroke="#2a3226"
					strokeWidth={0.85}
					strokeDasharray="5 1.5 1 1.5"
					pointerEvents="none"
				/>

				{zones
					.filter((z) => z.kind === "structure" || z.id === "trampoline")
					.map((z) => {
						const c = centroid(z.polygon);
						return (
							<text
								key={`label-${z.id}`}
								x={c.x}
								y={c.y}
								textAnchor="middle"
								dominantBaseline="middle"
								fontSize={z.kind === "structure" ? 3.4 : 2.6}
								fontFamily="Georgia, serif"
								fontWeight={700}
								fill="#2a3226"
								opacity={0.8}
								pointerEvents="none"
							>
								{z.kind === "structure" ? "HOUSE" : "TRAMP"}
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

			<div className="pointer-events-none absolute bottom-2 right-2 max-w-[46%] rounded-md border border-[var(--house-line)] bg-[#efe8da]/95 px-2 py-1.5 shadow-sm">
				<p className="mb-1 font-display text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--house-ink)]">
					Legend
				</p>
				<div className="flex flex-wrap gap-1.5">
					{(["lawn", "bed", "drive", "structure", "hardscape"] as ZoneKind[]).map(
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
					<span className="inline-flex items-center gap-1 text-[9px] text-[var(--house-ink)]">
						<span className="inline-block h-2 w-2 rounded-full bg-[#4f7344]" />
						Tree
					</span>
				</div>
			</div>
		</div>
	);
}
