/* empty css                                */
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_DEBWJpAb.mjs';
import { W as Welcome } from '../chunks/Welcome_Bk_1e_HU.mjs';
import { $ as $$PostHogLayout } from '../chunks/PostHogLayout_DKe_lCLC.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Test = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Test;
  return renderTemplate`${renderComponent($$result, "PostHogLayout", $$PostHogLayout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Welcome", Welcome, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/adam/Developer/pwrup-site/src/components/Welcome.tsx", "client:component-export": "default" })} ` })}`;
}, "/Users/adam/Developer/pwrup-site/src/pages/test.astro", void 0);

const $$file = "/Users/adam/Developer/pwrup-site/src/pages/test.astro";
const $$url = "/test";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Test,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
