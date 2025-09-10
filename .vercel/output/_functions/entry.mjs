import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_D2uBxK6Z.mjs';
import { manifest } from './manifest_SyRiCwVl.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin/edit/_id_.astro.mjs');
const _page2 = () => import('./pages/admin/new.astro.mjs');
const _page3 = () => import('./pages/admin.astro.mjs');
const _page4 = () => import('./pages/api/admins.astro.mjs');
const _page5 = () => import('./pages/api/posts/create.astro.mjs');
const _page6 = () => import('./pages/api/posts/meta.astro.mjs');
const _page7 = () => import('./pages/api/posts/_id_.astro.mjs');
const _page8 = () => import('./pages/api/posts.astro.mjs');
const _page9 = () => import('./pages/api/upload.astro.mjs');
const _page10 = () => import('./pages/blog/_slug_.astro.mjs');
const _page11 = () => import('./pages/blog.astro.mjs');
const _page12 = () => import('./pages/sign-in.astro.mjs');
const _page13 = () => import('./pages/sign-up.astro.mjs');
const _page14 = () => import('./pages/tech-club.astro.mjs');
const _page15 = () => import('./pages/test.astro.mjs');
const _page16 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/.pnpm/astro@5.13.5_@types+node@24.3.0_@upstash+redis@1.35.3_@vercel+functions@2.2.13_@aws-sdk+crede_pww2basmkgkikqz33ncqllwxau/node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/admin/edit/[id].astro", _page1],
    ["src/pages/admin/new.astro", _page2],
    ["src/pages/admin/index.astro", _page3],
    ["src/pages/api/admins/index.ts", _page4],
    ["src/pages/api/posts/create.ts", _page5],
    ["src/pages/api/posts/meta.ts", _page6],
    ["src/pages/api/posts/[id].ts", _page7],
    ["src/pages/api/posts.ts", _page8],
    ["src/pages/api/upload.ts", _page9],
    ["src/pages/blog/[slug].astro", _page10],
    ["src/pages/blog/index.astro", _page11],
    ["src/pages/sign-in.astro", _page12],
    ["src/pages/sign-up.astro", _page13],
    ["src/pages/tech-club.astro", _page14],
    ["src/pages/test.astro", _page15],
    ["src/pages/index.astro", _page16]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "92ac565c-9c23-4f8c-bd3e-13d233905db2",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
