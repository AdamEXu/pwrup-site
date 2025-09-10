/* empty css                                */
import { e as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_DEBWJpAb.mjs';
import { $ as $$PostHogLayout } from '../chunks/PostHogLayout_DKe_lCLC.mjs';
import { $ as $$Layout } from '../chunks/Layout_CfmU19EM.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
export { renderers } from '../renderers.mjs';

function BlogPost({ post }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  const formatReadingTime = (minutes) => {
    if (!minutes) return null;
    return `${minutes} min read`;
  };
  const getExcerpt = (content, maxLength = 150) => {
    const plainText = content.replace(/[#*`]/g, "").trim();
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength).trim() + "...";
  };
  return /* @__PURE__ */ jsx("article", { className: "group cursor-pointer", children: /* @__PURE__ */ jsx("a", { href: `/blog/${post.slug}`, className: "block", children: /* @__PURE__ */ jsxs("div", { className: "bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1", children: [
    post.headerImage && /* @__PURE__ */ jsxs("div", { className: "relative h-36 overflow-hidden", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: post.headerImage.url,
          alt: post.headerImage.alt || post.title,
          className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4", children: /* @__PURE__ */ jsx(
        "span",
        {
          className: `px-2 py-1 rounded-full text-xs font-medium ${post.status === "published" ? "bg-green-900/80 text-green-300 backdrop-blur-sm" : "bg-yellow-900/80 text-yellow-300 backdrop-blur-sm"}`,
          children: post.status
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-200 line-clamp-2", children: post.title }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-400 mb-4 line-clamp-3", children: post.description || getExcerpt(post.content) }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between text-sm text-gray-500", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          post.author.image && /* @__PURE__ */ jsx(
            "img",
            {
              src: post.author.image,
              alt: post.author.name,
              className: "w-6 h-6 rounded-full"
            }
          ),
          /* @__PURE__ */ jsx("span", { children: post.author.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              className: "w-4 h-4",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                }
              )
            }
          ),
          /* @__PURE__ */ jsx("span", { children: formatDate(
            post.publishedAt || post.createdAt
          ) })
        ] }),
        post.readingMinutes && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              className: "w-4 h-4",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                }
              )
            }
          ),
          /* @__PURE__ */ jsx("span", { children: formatReadingTime(
            post.readingMinutes
          ) })
        ] })
      ] }) }),
      post.tags && post.tags.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap gap-2", children: [
        post.tags.slice(0, 3).map((tag) => /* @__PURE__ */ jsxs(
          "span",
          {
            className: "px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs hover:bg-gray-700 transition-colors duration-200",
            children: [
              "#",
              tag
            ]
          },
          tag
        )),
        post.tags.length > 3 && /* @__PURE__ */ jsxs("span", { className: "px-2 py-1 text-gray-500 text-xs", children: [
          "+",
          post.tags.length - 3,
          " more"
        ] })
      ] })
    ] })
  ] }) }) });
}

function BlogPage() {
  const getParam = (name, def = "") => {
    if (typeof window === "undefined") return def;
    const sp = new URLSearchParams(window.location.search);
    return sp.get(name) ?? def;
  };
  const [tag, setTag] = useState(() => getParam("tag"));
  const [month, setMonth] = useState(() => getParam("month"));
  const [q, setQ] = useState(() => getParam("q"));
  const [page, setPage] = useState(
    () => parseInt(getParam("page", "1")) || 1
  );
  const [limit, setLimit] = useState(
    () => parseInt(getParam("limit", "10")) || 10
  );
  const [tags, setTags] = useState([]);
  const [months, setMonths] = useState([]);
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  useEffect(() => {
    fetch("/api/posts/meta").then((r) => r.json()).then((data) => {
      if (data.tags) setTags(data.tags);
      if (data.months) setMonths(data.months);
    }).catch(() => {
    });
  }, []);
  useEffect(() => {
    const params = new URLSearchParams();
    if (tag) params.set("tag", tag);
    if (month) params.set("month", month);
    if (q) params.set("q", q);
    params.set("page", String(page));
    params.set("limit", String(limit));
    fetch(`/api/posts?${params.toString()}`).then((r) => r.json()).then((data) => {
      setPosts(data.posts || []);
      setTotal(data.total || 0);
      if (data.tags) setTags(data.tags);
      if (data.months) setMonths(data.months);
    }).catch(() => {
      setPosts([]);
      setTotal(0);
    });
  }, [tag, month, q, page, limit]);
  useEffect(() => {
    const params = new URLSearchParams();
    if (tag) params.set("tag", tag);
    if (month) params.set("month", month);
    if (q) params.set("q", q);
    params.set("page", String(page));
    params.set("limit", String(limit));
    const search = params.toString();
    const url = `${window.location.pathname}?${search}`;
    window.history.replaceState(null, "", url);
  }, [tag, month, q, page, limit]);
  return /* @__PURE__ */ jsxs("main", { className: "bg-black text-white min-h-screen p-6", children: [
    /* @__PURE__ */ jsx("div", { id: "push", style: { height: "56px" } }),
    /* @__PURE__ */ jsxs("div", { className: "blog-page max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "filters mt-12 flex flex-row gap-4 flex-wrap justify-center", children: [
        /* @__PURE__ */ jsx("div", { className: "tags flex flex-wrap gap-4", children: tags.map((t) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setTag(t === tag ? "" : t);
              setPage(1);
            },
            className: `${t === tag ? "selected" : ""} px-4 py-2 rounded-full bg-white/10 hover:bg-white/20`,
            children: t
          },
          t
        )) }),
        /* @__PURE__ */ jsx("div", { className: "month-select mt-4", children: /* @__PURE__ */ jsxs(
          "select",
          {
            value: month,
            onChange: (e) => {
              setMonth(e.target.value);
              setPage(1);
            },
            className: "bg-white/10 rounded-full px-4 py-2 hover:bg-white/20",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "All months" }),
              months.map((m) => /* @__PURE__ */ jsx("option", { value: m, children: m }, m))
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "search-input mt-4", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: q,
            placeholder: "Search",
            onChange: (e) => {
              setQ(e.target.value);
              setPage(1);
            },
            className: "bg-white/10 rounded-full px-4 py-2 hover:bg-white/20"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx("ul", { className: "posts mt-12 space-y-4", children: posts.map((p, idx) => /* @__PURE__ */ jsx(BlogPost, { post: p }, p.id ?? idx)) }),
      /* @__PURE__ */ jsxs("div", { className: "pagination", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          "Page ",
          page,
          " of ",
          totalPages,
          " (",
          total,
          " total)"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "links", children: [
          page > 1 && /* @__PURE__ */ jsx("button", { onClick: () => setPage(page - 1), children: "Previous" }),
          page < totalPages && /* @__PURE__ */ jsx("button", { onClick: () => setPage(page + 1), children: "Next" })
        ] })
      ] })
    ] })
  ] });
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "PostHogLayout", $$PostHogLayout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Layout", $$Layout, {}, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "BlogPage", BlogPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/adam/Developer/pwrup-site/src/components/BlogPage.tsx", "client:component-export": "default" })} ` })} ` })}`;
}, "/Users/adam/Developer/pwrup-site/src/pages/blog/index.astro", void 0);

const $$file = "/Users/adam/Developer/pwrup-site/src/pages/blog/index.astro";
const $$url = "/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
