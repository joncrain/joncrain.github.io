import { useEffect, useCallback } from "react";
import type { IdeaPhoto } from "../../../data/house/types";

export default function PhotoLightbox({
	photos,
	index,
	onClose,
	onNavigate,
}: {
	photos: IdeaPhoto[];
	index: number;
	onClose: () => void;
	onNavigate: (nextIndex: number) => void;
}) {
	const photo = photos[index];
	const hasPrev = index > 0;
	const hasNext = index < photos.length - 1;

	const goPrev = useCallback(() => {
		if (hasPrev) onNavigate(index - 1);
	}, [hasPrev, index, onNavigate]);

	const goNext = useCallback(() => {
		if (hasNext) onNavigate(index + 1);
	}, [hasNext, index, onNavigate]);

	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === "Escape") onClose();
			if (e.key === "ArrowLeft") goPrev();
			if (e.key === "ArrowRight") goNext();
		}
		window.addEventListener("keydown", onKey);
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			window.removeEventListener("keydown", onKey);
			document.body.style.overflow = prevOverflow;
		};
	}, [onClose, goPrev, goNext]);

	if (!photo) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex flex-col bg-black/85"
			role="dialog"
			aria-modal="true"
			aria-label={photo.caption}
		>
			<button
				type="button"
				aria-label="Close"
				className="absolute inset-0 cursor-default"
				onClick={onClose}
			/>
			<div className="relative z-10 flex shrink-0 items-center justify-between px-4 py-3">
				<p className="font-display text-sm font-semibold text-[var(--house-paper)]">
					{index + 1} / {photos.length}
				</p>
				<button
					type="button"
					onClick={onClose}
					className="rounded-md px-3 py-2 text-sm font-semibold text-[var(--house-paper)] hover:bg-white/10"
					aria-label="Close lightbox"
				>
					✕
				</button>
			</div>
			<div className="relative z-10 flex min-h-0 flex-1 items-center justify-center gap-2 px-2 pb-4">
				<button
					type="button"
					onClick={goPrev}
					disabled={!hasPrev}
					className="shrink-0 rounded-md px-3 py-8 text-2xl text-[var(--house-paper)] disabled:opacity-30"
					aria-label="Previous photo"
				>
					‹
				</button>
				<figure className="flex max-h-full max-w-full flex-col items-center">
					<img
						src={photo.src}
						alt={photo.caption}
						className="max-h-[min(70dvh,720px)] max-w-full object-contain"
					/>
					<figcaption className="mt-3 max-w-lg px-2 text-center text-sm leading-snug text-[var(--house-paper)]/90">
						{photo.caption}
					</figcaption>
				</figure>
				<button
					type="button"
					onClick={goNext}
					disabled={!hasNext}
					className="shrink-0 rounded-md px-3 py-8 text-2xl text-[var(--house-paper)] disabled:opacity-30"
					aria-label="Next photo"
				>
					›
				</button>
			</div>
		</div>
	);
}
