import type { APIRoute } from "astro";
import { getPostById, updatePost, deletePost } from "../../../lib/kv";
import { requireAdmin, AuthError } from "../../../lib/auth";
export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
    const id = params.id!;
    const post = await getPostById(id);
    if (!post) return new Response("Not found", { status: 404 });
    return new Response(JSON.stringify(post), {
        status: 200,
        headers: { "content-type": "application/json" },
    });
};

export const PATCH: APIRoute = async (context) => {
    try {
        await requireAdmin(context);
        const body = await context.request.json();
        const post = await updatePost(context.params.id!, body);
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

export const PUT: APIRoute = async (context) => {
    try {
        await requireAdmin(context);
        const body = await context.request.json();
        const post = await updatePost(context.params.id!, body);
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

export const DELETE: APIRoute = async (context) => {
    try {
        await requireAdmin(context);
        await deletePost(context.params.id!);
        return new Response(null, { status: 204 });
    } catch (e) {
        if (e instanceof AuthError) {
            return new Response(e.message, { status: e.status });
        }
        return new Response("Server error", { status: 500 });
    }
};
