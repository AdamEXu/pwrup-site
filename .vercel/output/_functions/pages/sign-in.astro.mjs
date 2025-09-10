/* empty css                                */
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, n as renderScript } from '../chunks/astro/server_DEBWJpAb.mjs';
import { $ as $$PostHogLayout } from '../chunks/PostHogLayout_DKe_lCLC.mjs';
export { renderers } from '../renderers.mjs';

const $$SignIn = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "PostHogLayout", $$PostHogLayout, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="bg-black text-white min-h-screen flex items-center justify-center"> <div class="max-w-md w-full p-6"> <h1 class="text-3xl mb-6 text-center">Sign In</h1> <div id="clerk-sign-in"></div> </div> </main> ${renderScript($$result2, "/Users/adam/Developer/pwrup-site/src/pages/sign-in.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "/Users/adam/Developer/pwrup-site/src/pages/sign-in.astro", void 0);

const $$file = "/Users/adam/Developer/pwrup-site/src/pages/sign-in.astro";
const $$url = "/sign-in";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$SignIn,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
