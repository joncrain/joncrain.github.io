export const prerender = false;

import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import {
	COOKIE_NAME,
	createSoccerAuthCookieValue,
	soccerAuthCookieOptions,
	verifySoccerPassword,
} from "../../../lib/soccer-auth";

export const POST: APIRoute = async ({ request, cookies, locals }) => {
	try {
		let body: { password?: string };
		try {
			body = await request.json();
		} catch {
			return new Response(JSON.stringify({ error: "Invalid request" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		const password = body.password?.trim() ?? "";
		if (!password) {
			return new Response(JSON.stringify({ error: "Password required" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		const platformEnv = env as { SOCCER_PASSWORD?: string };
		const ok = await verifySoccerPassword(password, locals, platformEnv);
		if (!ok) {
			return new Response(JSON.stringify({ error: "Wrong password" }), {
				status: 401,
				headers: { "Content-Type": "application/json" },
			});
		}

		const token = await createSoccerAuthCookieValue(locals, platformEnv);
		if (!token) {
			return new Response(
				JSON.stringify({ error: "Auth is not configured on the server" }),
				{ status: 503, headers: { "Content-Type": "application/json" } },
			);
		}

		const secure = new URL(request.url).protocol === "https:";
		cookies.set(
			COOKIE_NAME,
			token,
			soccerAuthCookieOptions(60 * 60 * 24 * 60, secure),
		);

		return new Response(JSON.stringify({ ok: true }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Soccer auth error:", error);
		return new Response(JSON.stringify({ error: "Auth failed" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
};
