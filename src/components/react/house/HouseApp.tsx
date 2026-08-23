import { useState, type FormEvent } from "react";
import { careEvents } from "../../../data/house/care";
import { projects } from "../../../data/house/projects";
import { property } from "../../../data/house/property";
import { zones } from "../../../data/house/zones";
import { cn } from "../../../lib/utils";
import CareTab from "./CareTab";
import ProjectsTab from "./ProjectsTab";
import SiteMap from "./SiteMap";
import ZonesTab from "./ZonesTab";

type TabId = "zones" | "care" | "projects";

const TABS: { id: TabId; label: string }[] = [
	{ id: "zones", label: "Zones" },
	{ id: "care", label: "Care" },
	{ id: "projects", label: "Projects" },
];

function LoginGate({ onSuccess }: { onSuccess: () => void }) {
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [pending, setPending] = useState(false);

	async function submit(e: FormEvent) {
		e.preventDefault();
		setPending(true);
		setError(null);
		try {
			const res = await fetch("/api/house/auth", {
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
			<div className="rounded-xl border border-[var(--house-line)] bg-[var(--house-paper)] p-6 shadow-sm">
				<p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-[var(--house-soil)]">
					Private
				</p>
				<h1 className="font-display text-3xl font-bold text-[var(--house-ink)]">
					House · Exterior
				</h1>
				<p className="mt-2 text-sm text-[var(--house-muted)]">
					Yard map, care schedule, and landscaping plans.
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
							className="w-full rounded-md border border-[var(--house-line)] bg-[var(--house-field)] px-3 py-3 text-base text-[var(--house-ink)] outline-none ring-[var(--house-moss)] focus:ring-2"
						/>
					</label>
					{error && (
						<p className="text-sm font-medium text-red-700">{error}</p>
					)}
					<button
						type="submit"
						disabled={pending}
						className="w-full rounded-md bg-[var(--house-moss)] py-3 font-display text-base font-bold text-[var(--house-paper)] disabled:opacity-60"
					>
						{pending ? "Checking…" : "Open house"}
					</button>
				</form>
			</div>
		</div>
	);
}

export default function HouseApp({
	authenticated: initialAuth,
	calendarSubscribeUrl,
	ideasShareUrl,
}: {
	authenticated: boolean;
	calendarSubscribeUrl: string | null;
	ideasShareUrl: string | null;
}) {
	const [authed, setAuthed] = useState(initialAuth);
	const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
	const [tab, setTab] = useState<TabId>("zones");
	const [copied, setCopied] = useState(false);

	async function logout() {
		await fetch("/api/house/logout", { method: "POST" });
		setAuthed(false);
		setSelectedZoneId(null);
	}

	async function copyCalendarUrl() {
		if (!calendarSubscribeUrl) return;
		try {
			await navigator.clipboard.writeText(calendarSubscribeUrl);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		} catch {
			setCopied(false);
		}
	}

	function selectZone(id: string) {
		setSelectedZoneId(id);
		setTab("zones");
	}

	if (!authed) {
		return <LoginGate onSuccess={() => setAuthed(true)} />;
	}

	return (
		<div className="mx-auto min-h-[100dvh] max-w-3xl px-4 pb-10 pt-5">
			<header className="mb-4 flex flex-wrap items-start justify-between gap-3">
				<div>
					<p className="font-display text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--house-soil)]">
						House
					</p>
					<h1 className="font-display text-3xl font-bold leading-none text-[var(--house-ink)]">
						Exterior
					</h1>
					<p className="mt-1 text-sm text-[var(--house-muted)]">{property.label}</p>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					{calendarSubscribeUrl && (
						<button
							type="button"
							onClick={copyCalendarUrl}
							className="rounded-md border border-[var(--house-line)] bg-[var(--house-paper)] px-3 py-2 text-xs font-semibold text-[var(--house-ink)]"
						>
							{copied ? "Copied ICS URL" : "Copy calendar URL"}
						</button>
					)}
					<button
						type="button"
						onClick={logout}
						className="rounded-md px-3 py-2 text-xs font-semibold text-[var(--house-muted)]"
					>
						Log out
					</button>
				</div>
			</header>

			<SiteMap
				property={property}
				zones={zones}
				selectedZoneId={selectedZoneId}
				onSelectZone={selectZone}
			/>

			<div
				className="mt-4 flex gap-1 border-b border-[var(--house-line)]"
				role="tablist"
				aria-label="House sections"
			>
				{TABS.map((t) => (
					<button
						key={t.id}
						type="button"
						role="tab"
						aria-selected={tab === t.id}
						onClick={() => setTab(t.id)}
						className={cn(
							"px-3 py-2 font-display text-sm font-semibold tracking-wide",
							tab === t.id
								? "border-b-2 border-[var(--house-moss)] text-[var(--house-ink)]"
								: "text-[var(--house-muted)]",
						)}
					>
						{t.label}
					</button>
				))}
			</div>

			<div className="mt-4" role="tabpanel">
				{tab === "zones" && (
					<ZonesTab
						zones={zones}
						selectedZoneId={selectedZoneId}
						onSelectZone={selectZone}
					/>
				)}
				{tab === "care" && (
					<CareTab
						events={careEvents}
						zones={zones}
						selectedZoneId={selectedZoneId}
					/>
				)}
				{tab === "projects" && (
					<ProjectsTab
						projects={projects}
						zones={zones}
						ideasShareUrl={ideasShareUrl}
					/>
				)}
			</div>
		</div>
	);
}
