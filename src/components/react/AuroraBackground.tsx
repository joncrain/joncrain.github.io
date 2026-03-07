import Aurora from "./Aurora";

interface AuroraBackgroundProps {
	colorStops?: [string, string, string];
	speed?: number;
	blend?: number;
	amplitude?: number;
}

export default function AuroraBackground({
	colorStops = ["#5227FF", "#7cff67", "#5227FF"],
	speed = 1.0,
	blend = 0.6,
	amplitude = 1.0,
}: AuroraBackgroundProps) {
	return (
		<div
			style={{
				position: "absolute",
				inset: 0,
				zIndex: 0,
				overflow: "hidden",
			}}
		>
			<Aurora
				colorStops={colorStops}
				speed={speed}
				blend={blend}
				amplitude={amplitude}
			/>
		</div>
	);
}
