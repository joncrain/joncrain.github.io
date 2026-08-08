const COOKIE_NAME = "house_auth";
const TOKEN_PAYLOAD = "house-exterior-ok";

type EnvBag = { HOUSE_PASSWORD?: string };

function getPassword(locals?: unknown, platformEnv?: EnvBag): string | undefined {
	const fromImport = import.meta.env.HOUSE_PASSWORD as string | undefined;
	if (fromImport) return fromImport;

	if (platformEnv?.HOUSE_PASSWORD) return platformEnv.HOUSE_PASSWORD;

	const fromLocals = (
		locals as { runtime?: { env?: EnvBag } } | undefined
	)?.runtime?.env?.HOUSE_PASSWORD;
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

export async function verifyHousePassword(
	password: string,
	locals?: unknown,
	platformEnv?: EnvBag,
): Promise<boolean> {
	const expected = getPassword(locals, platformEnv);
	if (!expected) return false;
	return password === expected;
}

export async function createHouseAuthCookieValue(
	locals?: unknown,
	platformEnv?: EnvBag,
): Promise<string | null> {
	const password = getPassword(locals, platformEnv);
	if (!password) return null;
	return hmacToken(password);
}

export async function isHouseAuthenticated(
	cookieValue: string | undefined,
	locals?: unknown,
	platformEnv?: EnvBag,
): Promise<boolean> {
	if (!cookieValue) return false;
	const expected = await createHouseAuthCookieValue(locals, platformEnv);
	if (!expected) return false;
	return cookieValue === expected;
}

export function houseAuthCookieOptions(
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
