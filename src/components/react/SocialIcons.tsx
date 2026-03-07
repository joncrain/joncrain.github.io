import { FaLinkedin } from "react-icons/fa";
import { SiGithub } from "react-icons/si";

export default function SocialIcons() {
	return (
		<div className="flex items-center gap-4 ml-4 border-l border-border pl-4">
			<a
				href="https://github.com/joncrain"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="GitHub"
				className="text-muted-foreground hover:text-foreground transition-colors"
			>
				<SiGithub size={20} />
			</a>
			<a
				href="https://www.linkedin.com/in/jon-crain"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="LinkedIn"
				className="text-muted-foreground hover:text-foreground transition-colors"
			>
				<FaLinkedin size={20} />
			</a>
		</div>
	);
}
