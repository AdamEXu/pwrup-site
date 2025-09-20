/* empty css                                 */
import { e as createComponent, f as createAstro } from '../chunks/astro/server_DxG9kOTv.mjs';
import 'clsx';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const prerender = false;
const $$SignUp = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$SignUp;
  if (Astro2.url.searchParams.get("internal") === "true") {
    return Astro2.redirect("https://docs.google.com/forms/d/e/1FAIpQLScxtKLT8RRvoEpeMEobD0_nWtot29ryoKWw9naw2nxv6lT9VQ/viewform?usp=header");
  }
  if (Astro2.url.searchParams.get("role")) {
    const role = Astro2.url.searchParams.get("role");
    const rolesMap = {
      "business": "Business",
      "marketing": "Marketing",
      "software": "Software",
      "hardware": "Hardware"
    };
    if (role && rolesMap[role]) {
      const roleName = rolesMap[role];
      return Astro2.redirect(`https://docs.google.com/forms/d/e/1FAIpQLSfGztcsv36DX8pSdFCm8Tai8MZD1ZnjdFHDCkIhgWYq6FIVeg/viewform?usp=pp_url&entry.1824823162=${roleName}`);
    }
  }
  return Astro2.redirect("https://docs.google.com/forms/d/e/1FAIpQLSfGztcsv36DX8pSdFCm8Tai8MZD1ZnjdFHDCkIhgWYq6FIVeg/viewform?usp=header");
}, "/Users/adam/Developer/pwrup-site/src/pages/sign-up.astro", void 0);

const $$file = "/Users/adam/Developer/pwrup-site/src/pages/sign-up.astro";
const $$url = "/sign-up";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$SignUp,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
