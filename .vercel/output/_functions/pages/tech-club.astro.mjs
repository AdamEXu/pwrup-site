/* empty css                                */
import { e as createComponent, f as createAstro, r as renderTemplate } from '../chunks/astro/server_DEBWJpAb.mjs';
import 'clsx';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$TechClub = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$TechClub;
  return renderTemplate`// Redirect /tech-club
export const prerender = false;

return Astro.redirect('https://club-fair-techclub.vercel.app/');`;
}, "/Users/adam/Developer/pwrup-site/src/pages/tech-club.astro", void 0);

const $$file = "/Users/adam/Developer/pwrup-site/src/pages/tech-club.astro";
const $$url = "/tech-club";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$TechClub,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
