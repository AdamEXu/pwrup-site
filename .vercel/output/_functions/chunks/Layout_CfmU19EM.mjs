import { e as createComponent, f as createAstro, r as renderTemplate, n as renderScript, o as renderSlot, k as renderComponent, p as renderHead, h as addAttribute } from './astro/server_DEBWJpAb.mjs';
/* empty css                        */
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';

function NavBar({
  isHomePage = false
}) {
  const [isVisible, setIsVisible] = useState(!isHomePage);
  useEffect(() => {
    if (!isHomePage) return;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const halfWindowHeight = window.innerHeight * 0.6;
      const shouldShow = scrollY > halfWindowHeight;
      setIsVisible(shouldShow);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    const checkLenis = () => {
      const lenis = window.lenis;
      if (lenis) {
        lenis.on("scroll", handleScroll);
        return () => lenis.off("scroll", handleScroll);
      }
      return null;
    };
    let lenisCleanup = checkLenis();
    const lenisTimeout = setTimeout(() => {
      if (!lenisCleanup) {
        lenisCleanup = checkLenis();
      }
    }, 100);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (lenisCleanup) lenisCleanup();
      clearTimeout(lenisTimeout);
    };
  }, [isHomePage]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      id: "navbar",
      className: "bg-black/30 fixed w-screen left-0 right-0 z-10 p-6 backdrop-blur-lg transition-transform duration-300 ease-in-out",
      style: {
        transform: isVisible ? "translateY(0)" : "translateY(-100%)",
        top: 0
      },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          id: "navcontainer",
          className: "flex justify-between items-center",
          children: [
            /* @__PURE__ */ jsx("div", { id: "navleft", children: /* @__PURE__ */ jsx("a", { href: "/", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: "/PWRUP_text.svg",
                alt: "PWRUP",
                className: "h-8"
              }
            ) }) }),
            /* @__PURE__ */ jsx(
              "div",
              {
                id: "navright",
                className: "flex space-x-6 items-center text-2xl",
                children: /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "/sign-up",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "text-white hover:text-[#70cd35] transition-colors duration-200 font-bold",
                    children: "Register Interest"
                  }
                )
              }
            )
          ]
        }
      )
    }
  );
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title = "Pinewood Robotics",
    description = "Join Pinewood Robotics, FRC team 4765.",
    image = "https://pinewood.one/Slide.jpg",
    canonical
  } = Astro2.props;
  const siteUrl = "http://localhost:4322";
  const fullUrl = canonical || `${siteUrl}${Astro2.url.pathname}`;
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-astro-cid-sckkx6r4> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"', "><!-- SEO Meta Tags --><title>", '</title><meta name="description"', '><link rel="canonical"', '><!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="og:site_name" content="Pinewood Robotics"><!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"', '><meta property="twitter:title"', '><meta property="twitter:description"', '><meta property="twitter:image"', '><!-- Structured Data --><script type="application/ld+json">\n		{\n			JSON.stringify({\n				"@context": "https://schema.org",\n				"@type": "Organization",\n				"name": "Pinewood Robotics",\n				"description": description,\n				"url": fullUrl,\n				"logo": {\n					"@type": "ImageObject",\n					"url": `${siteUrl}/favicon.svg`\n				},\n				"sameAs": []\n			})\n		}\n		<\/script><!-- Google Fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&family=Red+Hat+Display:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet">', '</head> <body data-astro-cid-sckkx6r4> <div style="z-index: 100; position: fixed; top: 0; left: 0; width: 100%;" data-astro-cid-sckkx6r4> ', " </div> ", " ", " </body> </html> "], ['<html lang="en" data-astro-cid-sckkx6r4> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"', "><!-- SEO Meta Tags --><title>", '</title><meta name="description"', '><link rel="canonical"', '><!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="og:site_name" content="Pinewood Robotics"><!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"', '><meta property="twitter:title"', '><meta property="twitter:description"', '><meta property="twitter:image"', '><!-- Structured Data --><script type="application/ld+json">\n		{\n			JSON.stringify({\n				"@context": "https://schema.org",\n				"@type": "Organization",\n				"name": "Pinewood Robotics",\n				"description": description,\n				"url": fullUrl,\n				"logo": {\n					"@type": "ImageObject",\n					"url": \\`\\${siteUrl}/favicon.svg\\`\n				},\n				"sameAs": []\n			})\n		}\n		<\/script><!-- Google Fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&family=Red+Hat+Display:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet">', '</head> <body data-astro-cid-sckkx6r4> <div style="z-index: 100; position: fixed; top: 0; left: 0; width: 100%;" data-astro-cid-sckkx6r4> ', " </div> ", " ", " </body> </html> "])), addAttribute(Astro2.generator, "content"), title, addAttribute(description, "content"), addAttribute(fullUrl, "href"), addAttribute(fullUrl, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(image, "content"), addAttribute(fullUrl, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(image, "content"), renderHead(), renderComponent($$result, "NavBar", NavBar, { "client:load": true, "isHomePage": Astro2.url.pathname === "/", "client:component-hydration": "load", "client:component-path": "/Users/adam/Developer/pwrup-site/src/components/NavBar.tsx", "client:component-export": "default", "data-astro-cid-sckkx6r4": true }), renderSlot($$result, $$slots["default"]), renderScript($$result, "/Users/adam/Developer/pwrup-site/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts"));
}, "/Users/adam/Developer/pwrup-site/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
