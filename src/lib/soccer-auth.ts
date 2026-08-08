const COOKIE_NAME = "soccer_auth";
const TOKEN_PAYLOAD = "mpsc-blue-12u-ok";

type EnvBag = { SOCCER_PASSWORD?: string };

async function getPassword(locals?: unknown): Promise<string | undefined> {
	const fromImport = import.meta.env.SOCCER_PASSWORD as string | undefined;
	if (fromImport) return fromImport;

	const fromLocals = (
		locals as { runtime?: { env?: EnvBag } } | undefined
	)?.runtime?.env?.SOCCER_PASSWORD;
	if (fromLocals) return fromLocals;

	try {
		const { env } = await import("cloudflare:workers");
		return (env as EnvBag).SOCCER_PASSWORD;
	} catch {
		return undefined;
	}
}

async function hmacToken(password: string): Promise<string> {
	const enc = new TextEncoder();
	const key = await crypto.subtle.importKey(
		"raw",
		enc.encode(password),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"],
	);
	const sig = await crypto.subtle.sign("HMAC", key, enc.encode(TOKEN_PAYLOAD));
	return [...new Uint8Array(sig)]
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}

export async function verifySoccerPassword(
	password: string,
	locals?: unknown,
): Promise<boolean> {
	const expected = await getPassword(locals);
	if (!expected) return false;
	return password === expected;
}

export async function createSoccerAuthCookieValue(
	locals?: unknown,
): Promise<string | null> {
	const password = await getPassword(locals);
	if (!password) return null;
	return hmacToken(password);
}

export async function isSoccerAuthenticated(
	cookieValue: string | undefined,
	locals?: unknown,
): Promise<boolean> {
	if (!cookieValue) return false;
	const expected = await createSoccerAuthCookieValue(locals);
	if (!expected) return false;
	return cookieValue === expected;
}

export function soccerAuthCookieOptions(
	maxAgeSec = 60 * 60 * 24 * 60,
	secure = true,
) {
	return {
		path: "/",
		httpOnly: true,
		secure,
		sameSite: "lax" as const,
		maxAge: maxAgeSec,
	};
}

export { COOKIE_NAME };
