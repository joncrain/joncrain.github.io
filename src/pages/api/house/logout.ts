export const prerender = false;

import type { APIRoute } from "astro";
import { COOKIE_NAME, houseAuthCookieOptions } from "../../../lib/house-auth";

export const POST: APIRoute = async ({ cookies }) => {
	cookies.delete(COOKIE_NAME, { path: "/" });
	cookies.set(COOKIE_NAME, "", { ...houseAuthCookieOptions(0), maxAge: 0 });

	return new Response(JSON.stringify({ ok: true }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};
