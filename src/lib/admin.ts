import { Clerk } from "@clerk/astro/client";

export async function getSessionToken(): Promise<string | undefined> {
    try {
        return await Clerk.session?.getToken();
    } catch (e) {
        console.error("Failed to get session token", e);
        return undefined;
    }
}

export async function adminFetch(
    input: RequestInfo | URL,
    init: RequestInit = {}
) {
    const token = await getSessionToken();
    const headers = new Headers(init.headers);
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    return fetch(input, { ...init, headers });
}
