import { useCallback, useEffect, useRef, useState } from "react";

interface DecryptedTextProps {
	text: string;
	speed?: number;
	maxIterations?: number;
	characters?: string;
	className?: string;
	revealDirection?: "start" | "end" | "center";
	animateOn?: "view" | "hover";
}

export default function DecryptedText({
	text,
	speed = 50,
	maxIterations = 10,
	characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
	className = "",
	revealDirection = "start",
	animateOn = "view",
}: DecryptedTextProps) {
	const [displayText, setDisplayText] = useState(
		text.replace(/[^ ]/g, characters[0]),
	);
	const isAnimatingRef = useRef(false);
	const [hasAnimated, setHasAnimated] = useState(false);
	const ref = useRef<HTMLSpanElement>(null);

	const animate = useCallback(() => {
		if (isAnimatingRef.current) return;
		isAnimatingRef.current = true;

		let iteration = 0;
		const interval = setInterval(() => {
			setDisplayText(
				text
					.split("")
					.map((char, index) => {
						if (char === " ") return " ";

						let revealIndex: number;
						if (revealDirection === "start") {
							revealIndex = index;
						} else if (revealDirection === "end") {
							revealIndex = text.length - 1 - index;
						} else {
							revealIndex = Math.abs(index - Math.floor(text.length / 2));
						}

						if (revealIndex < iteration) return char;
						return characters[Math.floor(Math.random() * characters.length)];
					})
					.join(""),
			);

			iteration += 1 / maxIterations;

			if (iteration >= text.length) {
				clearInterval(interval);
				setDisplayText(text);
				isAnimatingRef.current = false;
				setHasAnimated(true);
			}
		}, speed);
	}, [text, speed, maxIterations, characters, revealDirection]);

	useEffect(() => {
		if (animateOn !== "view" || hasAnimated) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					animate();
					observer.disconnect();
				}
			},
			{ threshold: 0.1 },
		);

		if (ref.current) observer.observe(ref.current);
		return () => observer.disconnect();
	}, [hasAnimated, animate, animateOn]);

	return (
		<span
			aria-hidden="true"
			ref={ref}
			className={className}
			onMouseEnter={animateOn === "hover" ? animate : undefined}
			style={{ fontFamily: "inherit" }}
		>
			{displayText}
		</span>
	);
}
