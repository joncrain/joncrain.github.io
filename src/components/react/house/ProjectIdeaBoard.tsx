import { useMemo, useState } from "react";
import type { IdeaPhoto, IdeaSection, ProjectBoard } from "../../../data/house/types";
import { IDEA_SECTION_LABELS } from "../../../data/house/types";
import PhotoLightbox from "./PhotoLightbox";

const SECTION_ORDER: IdeaSection[] = ["existing", "inspiration", "concepts"];

export default function ProjectIdeaBoard({ board }: { board: ProjectBoard }) {
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

	const flatPhotos = useMemo(() => {
		const sorted = [...board.photos].sort((a, b) => {
			const sa = SECTION_ORDER.indexOf(a.section);
			const sb = SECTION_ORDER.indexOf(b.section);
			if (sa !== sb) return sa - sb;
			return (a.sort ?? 0) - (b.sort ?? 0);
		});
		return sorted;
	}, [board.photos]);

	const bySection = useMemo(() => {
		const map = new Map<IdeaSection, IdeaPhoto[]>();
		for (const section of SECTION_ORDER) map.set(section, []);
		for (const photo of flatPhotos) {
			map.get(photo.section)?.push(photo);
		}
		return map;
	}, [flatPhotos]);

	function openPhoto(photo: IdeaPhoto) {
		const i = flatPhotos.findIndex((p) => p.id === photo.id);
		if (i >= 0) setLightboxIndex(i);
	}

	return (
		<div className="space-y-8">
			{SECTION_ORDER.map((section) => {
				const photos = bySection.get(section) ?? [];
				if (photos.length === 0) return null;
				return (
					<section key={section}>
						<h3 className="font-display text-xs font-bold uppercase tracking-[0.14em] text-[var(--house-soil)]">
							{IDEA_SECTION_LABELS[section]}
						</h3>
						<ul className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
							{photos.map((photo) => (
								<li key={photo.id}>
									<button
										type="button"
										onClick={() => openPhoto(photo)}
										className="group w-full text-left"
									>
										<img
											src={photo.src}
											alt=""
											loading="lazy"
											className="aspect-[4/3] w-full object-cover transition group-hover:opacity-95"
										/>
										<p className="mt-2 text-sm leading-snug text-[var(--house-ink)]/90">
											{photo.caption}
										</p>
									</button>
								</li>
							))}
						</ul>
					</section>
				);
			})}

			{lightboxIndex !== null && (
				<PhotoLightbox
					photos={flatPhotos}
					index={lightboxIndex}
					onClose={() => setLightboxIndex(null)}
					onNavigate={setLightboxIndex}
				/>
			)}
		</div>
	);
}
