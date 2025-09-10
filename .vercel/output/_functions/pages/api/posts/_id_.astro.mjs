import { g as getPostById, u as updatePost, d as deletePost } from '../../../chunks/kv_BGMYywOY.mjs';
import { r as requireAdmin, A as AuthError } from '../../../chunks/auth_DZR22y3g.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ params }) => {
  const id = params.id;
  const post = await getPostById(id);
  if (!post) return new Response("Not found", { status: 404 });
  return new Response(JSON.stringify(post), {
    status: 200,
    headers: { "content-type": "application/json" }
  });
};
const PATCH = async (context) => {
  try {
    await requireAdmin(context);
    const body = await context.request.json();
    const post = await updatePost(context.params.id, body);
    return new Response(JSON.stringify(post), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  } catch (e) {
    if (e instanceof AuthError) {
      return new Response(e.message, { status: e.status });
    }
    return new Response("Server error", { status: 500 });
  }
};
const PUT = async (context) => {
  try {
    await requireAdmin(context);
    const body = await context.request.json();
    const post = await updatePost(context.params.id, body);
    return new Response(JSON.stringify(post), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  } catch (e) {
    if (e instanceof AuthError) {
      return new Response(e.message, { status: e.status });
    }
    return new Response("Server error", { status: 500 });
  }
};
const DELETE = async (context) => {
  try {
    await requireAdmin(context);
    await deletePost(context.params.id);
    return new Response(null, { status: 204 });
  } catch (e) {
    if (e instanceof AuthError) {
      return new Response(e.message, { status: e.status });
    }
    return new Response("Server error", { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    DELETE,
    GET,
    PATCH,
    PUT,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
