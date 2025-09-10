import { c as createPost } from '../../../chunks/kv_BGMYywOY.mjs';
import { r as requireAdmin, A as AuthError } from '../../../chunks/auth_DZR22y3g.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async (context) => {
  try {
    const author = await requireAdmin(context);
    const body = await context.request.json();
    if (!body.title || !body.description || !body.content) {
      return new Response("Missing fields", { status: 400 });
    }
    const post = await createPost({ ...body, author });
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

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
