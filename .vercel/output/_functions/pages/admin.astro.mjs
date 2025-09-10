/* empty css                                */
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from '../chunks/astro/server_DEBWJpAb.mjs';
import { $ as $$Layout } from '../chunks/Layout_CfmU19EM.mjs';
import { $ as $$PostHogLayout } from '../chunks/PostHogLayout_DKe_lCLC.mjs';
import { r as redis, k as keys, g as getPostById } from '../chunks/kv_BGMYywOY.mjs';
import { r as requireAdmin, A as AuthError } from '../chunks/auth_DZR22y3g.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  let posts = [];
  try {
    await requireAdmin(Astro2);
    const pubIds = await redis.zrange(keys.zPublished, 0, 50, { rev: true });
    const draftIds = await redis.zrange(keys.zDraft, 0, 50, { rev: true });
    const allIds = [...draftIds, ...pubIds];
    posts = (await Promise.all(allIds.map((id) => getPostById(id)))).filter((p) => p !== null);
  } catch (e) {
    if (e instanceof AuthError) {
      if (e.status === 401) {
        return Astro2.redirect("/sign-in");
      }
      return new Response(e.message, { status: e.status });
    }
    return new Response("Server error", { status: 500 });
  }
  return renderTemplate`${renderComponent($$result, "PostHogLayout", $$PostHogLayout, {}, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Layout", $$Layout, {}, { "default": async ($$result3) => renderTemplate` ${maybeRenderHead()}<main class="p-6"> <h1 class="text-2xl mb-4">Admin</h1> <a href="/admin/new" class="text-green-600">Write Post</a> <ul class="mt-6 space-y-4"> ${posts.map((p) => renderTemplate`<li${addAttribute(p.id, "key")}> <a${addAttribute(`/admin/edit/${p.id}`, "href")} class="text-blue-600">${p.title}</a> <span class="text-sm text-gray-500"> (${p.status})</span> </li>`)} </ul> </main> ` })} ` })}`;
}, "/Users/adam/Developer/pwrup-site/src/pages/admin/index.astro", void 0);

const $$file = "/Users/adam/Developer/pwrup-site/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
