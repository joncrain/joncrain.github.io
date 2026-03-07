import DecryptedText from "./DecryptedText";
import RotatingText from "./RotatingText";

export default function HeroContent() {
	return (
		<div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
			<h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
				<DecryptedText
					text="joncrain"
					speed={50}
					maxIterations={8}
					animateOn="view"
					className="block"
				/>
			</h1>

			<div
				className="text-xl md:text-2xl mb-8 h-10 flex items-center justify-center"
				style={{ color: "var(--color-accent-light)" }}
			>
				<RotatingText
					texts={[
						"Client Platform Engineer",
						"Full-Stack Developer",
						"Automation Architect",
						"Open Source Contributor",
						"Internal Tools Builder",
					]}
					interval={6000}
					className="font-semibold"
				/>
			</div>

			<p
				className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
				style={{ color: "var(--color-muted-foreground)" }}
			>
				I build product-quality internal platforms that turn manual IT processes
				into automated, self-service systems. From full-stack apps to AI
				integrations, I turn operational pain into engineering solutions.
			</p>

			<div className="flex flex-col sm:flex-row gap-4 justify-center">
				<a
					href="/about"
					className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-medium transition-all hover:scale-105"
					style={{
						backgroundColor: "var(--color-accent)",
						color: "white",
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.backgroundColor = "#6b3fff";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.backgroundColor = "var(--color-accent)";
					}}
				>
					About Me
				</a>
				<a
					href="/blog"
					className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-medium transition-all hover:scale-105"
					style={{
						border: "1px solid var(--color-border)",
						color: "var(--color-foreground)",
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.backgroundColor = "var(--color-muted)";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.backgroundColor = "transparent";
					}}
				>
					Read the Blog
				</a>
			</div>
		</div>
	);
}
