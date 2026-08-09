export const prerender = false;

import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { careEvents } from "../../data/house/care";
import { property } from "../../data/house/property";
import { buildHouseCalendarIcs } from "../../lib/house-ics";

type EnvBag = { HOUSE_ICS_TOKEN?: string };

function getIcsToken(locals?: unknown, platformEnv?: EnvBag): string | undefined {
	const fromImport = import.meta.env.HOUSE_ICS_TOKEN as string | undefined;
	if (fromImport) return fromImport;
	if (platformEnv?.HOUSE_ICS_TOKEN) return platformEnv.HOUSE_ICS_TOKEN;
	const fromLocals = (
		locals as { runtime?: { env?: EnvBag } } | undefined
	)?.runtime?.env?.HOUSE_ICS_TOKEN;
	if (fromLocals) return fromLocals;
	return undefined;
}

export const GET: APIRoute = async ({ url, locals }) => {
	const expected = getIcsToken(locals, env as EnvBag);
	const token = url.searchParams.get("token") ?? "";
	if (!expected || token !== expected) {
		return new Response("Unauthorized", { status: 401 });
	}

	const body = buildHouseCalendarIcs(careEvents, property.timezone);
	return new Response(body, {
		status: 200,
		headers: {
			"Content-Type": "text/calendar; charset=utf-8",
			"Cache-Control": "public, max-age=300",
		},
	});
};
