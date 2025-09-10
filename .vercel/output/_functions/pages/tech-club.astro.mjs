/* empty css                                */
import { e as createComponent, f as createAstro } from '../chunks/astro/server_DEBWJpAb.mjs';
import 'clsx';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$TechClub = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$TechClub;
  return Astro2.redirect("https://club-fair-techclub.vercel.app/");
}, "/Users/adam/Developer/pwrup-site/src/pages/tech-club.astro", void 0);

const $$file = "/Users/adam/Developer/pwrup-site/src/pages/tech-club.astro";
const $$url = "/tech-club";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$TechClub,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
