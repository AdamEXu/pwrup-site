import { r as redis, k as keys, n as normalizeTag, g as getPostById, c as createPost } from '../../chunks/kv_BGMYywOY.mjs';
import { r as requireAdmin, A as AuthError } from '../../chunks/auth_DZR22y3g.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async ({ url }) => {
  const statusParam = url.searchParams.get("status");
  const status = statusParam === "draft" ? "draft" : "published";
  const tag = url.searchParams.get("tag");
  const month = url.searchParams.get("month");
  const q = url.searchParams.get("q")?.toLowerCase() || "";
  const page = Number(url.searchParams.get("page") || "1");
  const limit = Math.min(Number(url.searchParams.get("limit") || "20"), 50);
  const zKey = status === "published" ? keys.zPublished : keys.zDraft;
  let ids = await redis.zrange(zKey, 0, 499, { rev: true });
  if (tag) {
    const tagIds = await redis.smembers(
      keys.tag(normalizeTag(tag))
    );
    ids = ids.filter((id) => tagIds.includes(id));
  }
  if (month) {
    const monthIds = await redis.smembers(keys.month(month));
    ids = ids.filter((id) => monthIds.includes(id));
  }
  let posts = await Promise.all(ids.map((id) => getPostById(id)));
  posts = posts.filter((p) => p !== null);
  if (q) {
    posts = posts.filter(
      (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q))
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
    publishedAt: p.publishedAt
  }));
  return new Response(
    JSON.stringify({ page, limit, total, posts: summaries }),
    {
      status: 200,
      headers: { "content-type": "application/json" }
    }
  );
};
const POST = async (context) => {
  try {
    const author = await requireAdmin(context);
    const body = await context.request.json();
    if (!body.title || !body.content) {
      return new Response("Missing required fields: title and content", {
        status: 400
      });
    }
    const postData = {
      title: body.title,
      slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      description: body.description || "",
      content: body.content,
      tags: Array.isArray(body.tags) ? body.tags : [],
      status: body.status || "draft",
      readingTime: body.readingTime || void 0,
      headerImage: body.headerImage || void 0,
      author
    };
    const post = await createPost(postData);
    return new Response(JSON.stringify(post), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    console.error("Create post error:", e);
    if (e instanceof AuthError) {
      return new Response(e.message, { status: e.status });
    }
    return new Response("Server error", { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    POST,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
