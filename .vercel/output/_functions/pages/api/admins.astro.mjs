import { r as redis, k as keys } from '../../chunks/kv_BGMYywOY.mjs';
import { r as requireAdmin, A as AuthError } from '../../chunks/auth_DZR22y3g.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
async function handleAuth(request) {
  try {
    await requireAdmin(request);
    return null;
  } catch (e) {
    if (e instanceof AuthError) {
      return new Response(e.message, { status: e.status });
    }
    return new Response("Server error", { status: 500 });
  }
}
const GET = async ({ request }) => {
  const auth = await handleAuth(request);
  if (auth) return auth;
  const emails = await redis.smembers(keys.adminEmails);
  return new Response(JSON.stringify(emails), {
    status: 200,
    headers: { "content-type": "application/json" }
  });
};
const POST = async ({ request }) => {
  const auth = await handleAuth(request);
  if (auth) return auth;
  const { email } = await request.json();
  if (!email) return new Response("Email required", { status: 400 });
  await redis.sadd(keys.adminEmails, email.toLowerCase());
  return new Response(null, { status: 204 });
};
const DELETE = async ({ request }) => {
  const auth = await handleAuth(request);
  if (auth) return auth;
  const { email } = await request.json();
  if (!email) return new Response("Email required", { status: 400 });
  await redis.srem(keys.adminEmails, email.toLowerCase());
  return new Response(null, { status: 204 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
