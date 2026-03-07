import Aurora from "./Aurora";

export default function AuroraStrip() {
	return (
		<div
			style={{
				position: "fixed",
				inset: 0,
				height: "60vh",
				zIndex: 0,
				overflow: "hidden",
				pointerEvents: "none",
				maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
				WebkitMaskImage:
					"linear-gradient(to bottom, black 50%, transparent 100%)",
			}}
		>
			<Aurora
				colorStops={["#5227FF", "#7cff67", "#5227FF"]}
				speed={0.3}
				blend={0.8}
				amplitude={0.3}
			/>
		</div>
	);
}
