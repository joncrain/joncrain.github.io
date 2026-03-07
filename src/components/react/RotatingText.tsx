import { useEffect, useState } from "react";

interface RotatingTextProps {
	texts: string[];
	interval?: number;
	className?: string;
}

export default function RotatingText({
	texts,
	interval = 10000,
	className = "",
}: RotatingTextProps) {
	const [index, setIndex] = useState(0);
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const timer = setInterval(() => {
			setIsVisible(false);
			setTimeout(() => {
				setIndex((prev) => (prev + 1) % texts.length);
				setIsVisible(true);
			}, 600);
		}, interval);

		return () => clearInterval(timer);
	}, [texts.length, interval]);

	return (
		<span
			className={className}
			style={{
				display: "inline-block",
				transition: "opacity 0.8s ease, transform 0.8s ease",
				opacity: isVisible ? 1 : 0,
				transform: isVisible ? "translateY(0)" : "translateY(10px)",
			}}
		>
			{texts[index]}
		</span>
	);
}
