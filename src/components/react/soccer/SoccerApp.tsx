import { useMemo, useState, type FormEvent } from "react";
import {
	FORMAT_LABELS,
	THEME_LABELS,
	type DrillCard,
	type PracticeBlock,
	type PracticeSession,
} from "../../../data/soccer/types";
import { getNextSession, sessions } from "../../../data/soccer/sessions";
import { cn } from "../../../lib/utils";

function formatClock(practiceStart: string, offsetMin: number): string {
	// practiceStart like "5:30"
	const match = practiceStart.match(/(\d{1,2}):(\d{2})/);
	if (!match) return `+${offsetMin}m`;
	let h = Number(match[1]);
	let m = Number(match[2]);
	// assume PM for evening practices if hour < 12 and label has pm elsewhere
	if (h < 12) h += 12;
	m += offsetMin;
	h += Math.floor(m / 60);
	m = m % 60;
	h = h % 24;
	const ampm = h >= 12 ? "pm" : "am";
	const h12 = h % 12 || 12;
	return `${h12}:${m.toString().padStart(2, "0")}${ampm}`;
}

function practiceStartTime(timeLabel: string): string {
	const part = timeLabel.split("–")[0]?.trim() ?? timeLabel;
	return part.replace(/\s*pm/i, "").trim();
}

function DrillBody({ drill }: { drill: DrillCard }) {
	return (
		<div className="space-y-4 text-[15px] leading-snug">
			{drill.gear && (
				<p className="text-soccer-muted">
					<span className="font-semibold text-soccer-ink">Gear: </span>
					{drill.gear}
				</p>
			)}
			<div>
				<p className="mb-1 text-xs font-bold uppercase tracking-wider text-soccer-blue">
					Setup
				</p>
				<p className="text-soccer-ink/90">{drill.setup}</p>
			</div>
			{drill.rules.length > 0 && (
				<div>
					<p className="mb-1 text-xs font-bold uppercase tracking-wider text-soccer-blue">
						Rules
					</p>
					<ul className="list-disc space-y-1 pl-4 text-soccer-ink/90">
						{drill.rules.map((r) => (
							<li key={r}>{r}</li>
						))}
					</ul>
				</div>
			)}
			{drill.constraint && (
				<div className="rounded-md border border-soccer-orange/40 bg-soccer-orange/10 px-3 py-2">
					<p className="text-xs font-bold uppercase tracking-wider text-soccer-orange">
						Constraint
					</p>
					<p className="text-soccer-ink">{drill.constraint}</p>
				</div>
			)}
			<div>
				<p className="mb-1 text-xs font-bold uppercase tracking-wider text-soccer-blue">
					Coach points
				</p>
				<ul className="space-y-1">
					{drill.coachingPoints.map((c) => (
						<li
							key={c}
							className="border-l-2 border-soccer-blue pl-3 font-medium text-soccer-ink"
						>
							{c}
						</li>
					))}
				</ul>
			</div>
			{drill.liveCues && drill.liveCues.length > 0 && (
				<div>
					<p className="mb-1 text-xs font-bold uppercase tracking-wider text-soccer-muted">
						Live cues
					</p>
					<p className="font-semibold text-soccer-ink">
						{drill.liveCues.join(" · ")}
					</p>
				</div>
			)}
			{drill.freezeIf && (
				<p className="text-sm text-soccer-muted">
					<span className="font-semibold text-soccer-ink">Freeze if: </span>
					{drill.freezeIf}
				</p>
			)}
			<div className="rounded-md bg-soccer-blue/10 px-3 py-2">
				<p className="text-xs font-bold uppercase tracking-wider text-soccer-blue">
					Success looks like
				</p>
				<p className="text-soccer-ink">{drill.successLooksLike}</p>
			</div>
		</div>
	);
}

function BlockCard({
	block,
	startLabel,
	expanded,
	onToggle,
}: {
	block: PracticeBlock;
	startLabel: string;
	expanded: boolean;
	onToggle: () => void;
}) {
	return (
		<article
			className={cn(
				"rounded-lg border bg-white shadow-sm transition-shadow",
				expanded
					? "border-soccer-blue shadow-md"
					: "border-soccer-line hover:border-soccer-blue/40",
			)}
		>
			<button
				type="button"
				onClick={onToggle}
				className="flex w-full items-start gap-3 px-3 py-3 text-left"
			>
				<div className="w-14 shrink-0 pt-0.5 text-center">
					<p className="font-display text-sm font-bold tabular-nums text-soccer-blue">
						{startLabel}
					</p>
					<p className="text-[11px] font-medium text-soccer-muted">
						{block.durationMin}m
					</p>
				</div>
				<div className="min-w-0 flex-1">
					<p className="text-[11px] font-bold uppercase tracking-wide text-soccer-orange">
						{block.label}
					</p>
					<p className="font-display text-lg font-semibold leading-tight text-soccer-ink">
						{block.drill.title}
					</p>
				</div>
				<span className="mt-1 text-soccer-muted" aria-hidden>
					{expanded ? "▾" : "▸"}
				</span>
			</button>
			{expanded && (
				<div className="space-y-4 border-t border-soccer-line px-3 py-4">
					<DrillBody drill={block.drill} />
					{block.stations?.map((station) => (
						<div
							key={station.id}
							className="rounded-md border border-soccer-line bg-soccer-field/40 p-3"
						>
							<p className="mb-2 font-display text-base font-bold text-soccer-blue">
								{station.title}
							</p>
							<DrillBody drill={station} />
						</div>
					))}
				</div>
			)}
		</article>
	);
}

function SessionView({
	session,
	onBack,
}: {
	session: PracticeSession;
	onBack: () => void;
}) {
	const [openId, setOpenId] = useState<string | null>(session.blocks[0]?.id ?? null);
	const start = practiceStartTime(session.timeLabel);

	return (
		<div className="mx-auto max-w-lg pb-16">
			<header className="sticky top-0 z-20 border-b border-soccer-line/80 bg-soccer-field/95 px-3 py-3 backdrop-blur">
				<button
					type="button"
					onClick={onBack}
					className="mb-2 text-sm font-semibold text-soccer-blue"
				>
					← All sessions
				</button>
				<p className="font-display text-xs font-bold uppercase tracking-[0.14em] text-soccer-orange">
					{session.dayLabel} · {session.timeLabel}
				</p>
				<h1 className="font-display text-2xl font-bold leading-tight text-soccer-ink">
					{session.title}
				</h1>
				<p className="mt-1 text-sm text-soccer-muted">{session.themeSummary}</p>
				<div className="mt-2 flex flex-wrap gap-1.5">
					<span className="rounded bg-soccer-blue px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
						{FORMAT_LABELS[session.format]}
					</span>
					{session.themes.map((t) => (
						<span
							key={t}
							className="rounded bg-white px-2 py-0.5 text-[11px] font-semibold text-soccer-blue ring-1 ring-soccer-blue/20"
						>
							{THEME_LABELS[t]}
						</span>
					))}
				</div>
			</header>

			<section className="space-y-3 px-3 pt-4">
				<div className="rounded-lg border border-soccer-line bg-white p-3">
					<p className="mb-1 text-xs font-bold uppercase tracking-wider text-soccer-blue">
						Objectives
					</p>
					<ul className="list-disc space-y-1 pl-4 text-sm text-soccer-ink/90">
						{session.objectives.map((o) => (
							<li key={o}>{o}</li>
						))}
					</ul>
					{session.notes && session.notes.length > 0 && (
						<ul className="mt-3 space-y-1 border-t border-soccer-line pt-3 text-sm text-soccer-muted">
							{session.notes.map((n) => (
								<li key={n}>• {n}</li>
							))}
						</ul>
					)}
				</div>

				{session.blocks.map((block) => (
					<BlockCard
						key={block.id}
						block={block}
						startLabel={formatClock(start, block.startOffsetMin)}
						expanded={openId === block.id}
						onToggle={() =>
							setOpenId((id) => (id === block.id ? null : block.id))
						}
					/>
				))}
			</section>
		</div>
	);
}

function SessionList({
	onSelect,
	onLogout,
}: {
	onSelect: (id: string) => void;
	onLogout: () => void;
}) {
	const next = useMemo(() => getNextSession(), []);

	return (
		<div className="mx-auto max-w-lg px-3 pb-16 pt-6">
			<header className="mb-6">
				<div className="flex items-start justify-between gap-3">
					<div>
						<p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-soccer-orange">
							MPSC · MMYSL
						</p>
						<h1 className="font-display text-3xl font-bold text-soccer-blue">
							Blue 12U
						</h1>
						<p className="mt-1 text-sm text-soccer-muted">
							Practice timeline · sideline cards
						</p>
					</div>
					<button
						type="button"
						onClick={onLogout}
						className="text-xs font-semibold text-soccer-muted underline-offset-2 hover:text-soccer-ink hover:underline"
					>
						Log out
					</button>
				</div>
			</header>

			<button
				type="button"
				onClick={() => onSelect(next.id)}
				className="mb-5 w-full rounded-lg border-2 border-soccer-orange bg-white p-4 text-left shadow-sm"
			>
				<p className="text-xs font-bold uppercase tracking-wider text-soccer-orange">
					Up next
				</p>
				<p className="font-display text-xl font-bold text-soccer-ink">
					{next.dayLabel} — {next.title}
				</p>
				<p className="text-sm text-soccer-muted">
					{next.timeLabel} · {FORMAT_LABELS[next.format]}
				</p>
			</button>

			<ul className="space-y-2">
				{sessions.map((s) => (
					<li key={s.id}>
						<button
							type="button"
							onClick={() => onSelect(s.id)}
							className={cn(
								"flex w-full items-center justify-between rounded-lg border bg-white px-3 py-3 text-left shadow-sm",
								s.id === next.id
									? "border-soccer-blue"
									: "border-soccer-line",
							)}
						>
							<div>
								<p className="text-xs font-semibold text-soccer-muted">
									{s.dayLabel}
								</p>
								<p className="font-display text-base font-bold text-soccer-ink">
									{s.title}
								</p>
							</div>
							<span className="text-xs font-bold uppercase text-soccer-blue">
								{FORMAT_LABELS[s.format].split(" ")[0]}
							</span>
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}

function LoginGate({ onSuccess }: { onSuccess: () => void }) {
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [pending, setPending] = useState(false);

	async function submit(e: FormEvent) {
		e.preventDefault();
		setPending(true);
		setError(null);
		try {
			const res = await fetch("/api/soccer/auth", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ password }),
			});
			if (!res.ok) {
				const data = (await res.json().catch(() => ({}))) as {
					error?: string;
				};
				setError(data.error ?? "Could not sign in");
				return;
			}
			onSuccess();
		} catch {
			setError("Network error");
		} finally {
			setPending(false);
		}
	}

	return (
		<div className="mx-auto flex min-h-[100dvh] max-w-sm flex-col justify-center px-4">
			<div className="rounded-xl border border-soccer-line bg-white p-6 shadow-md">
				<p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-soccer-orange">
					MPSC
				</p>
				<h1 className="font-display text-3xl font-bold text-soccer-blue">
					Blue 12U
				</h1>
				<p className="mt-2 text-sm text-soccer-muted">
					Coach access — practice plans for the sideline.
				</p>
				<form onSubmit={submit} className="mt-6 space-y-3">
					<label className="block">
						<span className="sr-only">Password</span>
						<input
							type="password"
							autoComplete="current-password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Password"
							className="w-full rounded-md border border-soccer-line bg-soccer-field px-3 py-3 text-base text-soccer-ink outline-none ring-soccer-blue focus:ring-2"
						/>
					</label>
					{error && <p className="text-sm font-medium text-red-600">{error}</p>}
					<button
						type="submit"
						disabled={pending}
						className="w-full rounded-md bg-soccer-blue py-3 font-display text-base font-bold text-white disabled:opacity-60"
					>
						{pending ? "Checking…" : "Open plans"}
					</button>
				</form>
			</div>
		</div>
	);
}

export default function SoccerApp({
	authenticated: initialAuth,
}: {
	authenticated: boolean;
}) {
	const [authed, setAuthed] = useState(initialAuth);
	const [sessionId, setSessionId] = useState<string | null>(null);

	const session = sessionId
		? sessions.find((s) => s.id === sessionId) ?? null
		: null;

	async function logout() {
		await fetch("/api/soccer/logout", { method: "POST" });
		setAuthed(false);
		setSessionId(null);
	}

	if (!authed) {
		return <LoginGate onSuccess={() => setAuthed(true)} />;
	}

	if (session) {
		return (
			<SessionView session={session} onBack={() => setSessionId(null)} />
		);
	}

	return (
		<SessionList onSelect={setSessionId} onLogout={logout} />
	);
}
