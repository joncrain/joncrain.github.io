import { useEffect, useRef } from "react";
import type { IconType } from "react-icons";
import { FaAws } from "react-icons/fa";
import {
	SiAstro,
	SiChef,
	SiDocker,
	SiDrizzle,
	SiFastapi,
	SiGithub,
	SiGo,
	SiGooglecloud,
	SiKubernetes,
	SiNextdotjs,
	SiPuppet,
	SiPython,
	SiReact,
	SiSwift,
	SiTailwindcss,
	SiTerraform,
	SiTypescript,
} from "react-icons/si";

const logos: { icon: IconType; name: string }[] = [
	{ icon: SiTypescript, name: "TypeScript" },
	{ icon: SiReact, name: "React" },
	{ icon: SiNextdotjs, name: "Next.js" },
	{ icon: SiPython, name: "Python" },
	{ icon: SiGo, name: "Go" },
	{ icon: SiDocker, name: "Docker" },
	{ icon: SiKubernetes, name: "Kubernetes" },
	{ icon: SiTerraform, name: "Terraform" },
	{ icon: FaAws, name: "AWS" },
	{ icon: SiGooglecloud, name: "GCP" },
	{ icon: SiGithub, name: "GitHub" },
	{ icon: SiFastapi, name: "FastAPI" },
	{ icon: SiAstro, name: "Astro" },
	{ icon: SiDrizzle, name: "Drizzle" },
	{ icon: SiTailwindcss, name: "Tailwind CSS" },
	{ icon: SiPuppet, name: "Puppet" },
	{ icon: SiChef, name: "Chef" },
	{ icon: SiSwift, name: "Swift" },
];

export default function TechLogoLoop() {
	const trackRef = useRef<HTMLDivElement>(null);
	const offsetRef = useRef(0);

	useEffect(() => {
		let animId: number;

		const animate = () => {
			const track = trackRef.current;
			if (track) {
				offsetRef.current -= 0.5;
				const halfWidth = track.scrollWidth / 2;
				if (Math.abs(offsetRef.current) >= halfWidth) {
					offsetRef.current = 0;
				}
				track.style.transform = `translateX(${offsetRef.current}px)`;
			}
			animId = requestAnimationFrame(animate);
		};

		animId = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animId);
	}, []);

	const doubled = [...logos, ...logos];

	return (
		<div style={{ position: "relative", overflow: "hidden", width: "100%" }}>
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					bottom: 0,
					width: "80px",
					background:
						"linear-gradient(to right, var(--color-background), transparent)",
					zIndex: 2,
					pointerEvents: "none",
				}}
			/>
			<div
				style={{
					position: "absolute",
					top: 0,
					right: 0,
					bottom: 0,
					width: "80px",
					background:
						"linear-gradient(to left, var(--color-background), transparent)",
					zIndex: 2,
					pointerEvents: "none",
				}}
			/>

			<div
				ref={trackRef}
				style={{
					display: "flex",
					gap: "3rem",
					width: "max-content",
					willChange: "transform",
					padding: "1rem 0",
				}}
			>
				{doubled.map((logo, i) => {
					const Icon = logo.icon;
					return (
						<div
							key={`${logo.name}-${i}`}
							title={logo.name}
							style={{
								flexShrink: 0,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Icon size={32} color="white" style={{ opacity: 0.6 }} />
						</div>
					);
				})}
			</div>
		</div>
	);
}
