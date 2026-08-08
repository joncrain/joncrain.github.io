const COOKIE_NAME = "soccer_auth";
const TOKEN_PAYLOAD = "mpsc-blue-12u-ok";

type EnvBag = { SOCCER_PASSWORD?: string };

function getPassword(locals?: unknown, platformEnv?: EnvBag): string | undefined {
	const fromImport = import.meta.env.SOCCER_PASSWORD as string | undefined;
	if (fromImport) return fromImport;

	if (platformEnv?.SOCCER_PASSWORD) return platformEnv.SOCCER_PASSWORD;

	const fromLocals = (
		locals as { runtime?: { env?: EnvBag } } | undefined
	)?.runtime?.env?.SOCCER_PASSWORD;
	if (fromLocals) return fromLocals;

	return undefined;
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
	platformEnv?: EnvBag,
): Promise<boolean> {
	const expected = getPassword(locals, platformEnv);
	if (!expected) return false;
	return password === expected;
}

export async function createSoccerAuthCookieValue(
	locals?: unknown,
	platformEnv?: EnvBag,
): Promise<string | null> {
	const password = getPassword(locals, platformEnv);
	if (!password) return null;
	return hmacToken(password);
}

export async function isSoccerAuthenticated(
	cookieValue: string | undefined,
	locals?: unknown,
	platformEnv?: EnvBag,
): Promise<boolean> {
	if (!cookieValue) return false;
	const expected = await createSoccerAuthCookieValue(locals, platformEnv);
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
