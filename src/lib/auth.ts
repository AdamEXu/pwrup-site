import { clerkClient, verifyToken } from "@clerk/astro/server";
import { redis, keys, type Author } from "./kv";

export class AuthError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export async function requireAdmin(context: any): Promise<Author> {
    try {
        // Check if locals exists and has auth function
        if (!context.locals || typeof context.locals.auth !== "function") {
            console.error("Auth error: context.locals.auth is not available");
            throw new AuthError("Unauthorized", 401);
        }

        // Use Astro's locals.auth() to get authentication state
        const { userId } = context.locals.auth();

        if (!userId) {
            throw new AuthError("Unauthorized", 401);
        }

        // Get the user from Clerk
        const user = await clerkClient(context).users.getUser(userId);
        const email = user.primaryEmailAddress?.emailAddress?.toLowerCase();

        if (!email) {
            throw new AuthError("Unauthorized", 401);
        }

        // For development, allow any authenticated user to be admin
        // In production, you'd check against a whitelist
        const allowed = true; // await redis.sismember(keys.adminEmails, email)
        if (!allowed) {
            throw new AuthError("Forbidden", 403);
        }

        return {
            id: userId,
            name: user.fullName || "",
            email,
            image: user.imageUrl,
        };
    } catch (error) {
        console.error("Auth error:", error);
        throw new AuthError("Unauthorized", 401);
    }
}
