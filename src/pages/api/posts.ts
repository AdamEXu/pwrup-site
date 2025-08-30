import type { APIRoute } from "astro";
import {
    createPost,
    redis,
    keys,
    normalizeTag,
    getPostById,
    type Post,
} from "../../lib/kv";
import { requireAdmin, AuthError } from "../../lib/auth";
export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
    const statusParam = url.searchParams.get("status");
    const status = statusParam === "draft" ? "draft" : "published";
    const tag = url.searchParams.get("tag");
    const month = url.searchParams.get("month");
    const q = url.searchParams.get("q")?.toLowerCase() || "";
    const page = Number(url.searchParams.get("page") || "1");
    const limit = Math.min(Number(url.searchParams.get("limit") || "20"), 50);

    const zKey = status === "published" ? keys.zPublished : keys.zDraft;
    let ids = await redis.zrange<string[]>(zKey, 0, 499, { rev: true });
    if (tag) {
        const tagIds = await redis.smembers<string[]>(
            keys.tag(normalizeTag(tag))
        );
        ids = ids.filter((id) => tagIds.includes(id));
    }
    if (month) {
        const monthIds = await redis.smembers<string[]>(keys.month(month));
        ids = ids.filter((id) => monthIds.includes(id));
    }
    let posts = await Promise.all(ids.map((id) => getPostById(id)));
    posts = posts.filter((p): p is Post => p !== null);
    if (q) {
        posts = posts.filter(
            (p) =>
                p.title.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.tags.some((t) => t.includes(q))
        );
    }
    const total = posts.length;
    const start = (page - 1) * limit;
    posts = posts.slice(start, start + limit);
    const summaries = posts.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        description: p.description,
        tags: p.tags,
        author: p.author,
        headerImage: p.headerImage,
        publishedAt: p.publishedAt,
    }));
    return new Response(
        JSON.stringify({ page, limit, total, posts: summaries }),
        {
            status: 200,
            headers: { "content-type": "application/json" },
        }
    );
};

export const POST: APIRoute = async (context) => {
    try {
        const author = await requireAdmin(context);
        const body = await context.request.json();

        if (!body.title || !body.content) {
            return new Response("Missing required fields: title and content", {
                status: 400,
            });
        }

        // Set defaults for optional fields
        const postData = {
            title: body.title,
            slug:
                body.slug ||
                body.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, ""),
            description: body.description || "",
            content: body.content,
            tags: Array.isArray(body.tags) ? body.tags : [],
            status: body.status || "draft",
            readingTime: body.readingTime || undefined,
            headerImage: body.headerImage || undefined,
            author,
        };

        const post = await createPost(postData);

        return new Response(JSON.stringify(post), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        console.error("Create post error:", e);
        if (e instanceof AuthError) {
            return new Response(e.message, { status: e.status });
        }
        return new Response("Server error", { status: 500 });
    }
};
