import type { APIRoute } from "astro";
import { createPost } from "../../../lib/kv";
import { requireAdmin, AuthError } from "../../../lib/auth";
export const prerender = false;

export const POST: APIRoute = async (context) => {
    try {
        const author = await requireAdmin(context);
        const body = await context.request.json();
        if (!body.title || !body.description || !body.content) {
            return new Response("Missing fields", { status: 400 });
        }
        const post = await createPost({ ...body, author });
        return new Response(JSON.stringify(post), {
            status: 200,
            headers: { "content-type": "application/json" },
        });
    } catch (e) {
        if (e instanceof AuthError) {
            return new Response(e.message, { status: e.status });
        }
        return new Response("Server error", { status: 500 });
    }
};
