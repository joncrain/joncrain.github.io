export const prerender = false;

import type { APIRoute } from "astro";
import { COOKIE_NAME, soccerAuthCookieOptions } from "../../../lib/soccer-auth";

export const POST: APIRoute = async ({ cookies }) => {
	cookies.delete(COOKIE_NAME, { path: "/" });
	cookies.set(COOKIE_NAME, "", { ...soccerAuthCookieOptions(0), maxAge: 0 });

	return new Response(JSON.stringify({ ok: true }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};
