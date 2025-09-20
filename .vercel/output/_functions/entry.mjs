import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_BgLQ0rnP.mjs';
import { manifest } from './manifest_BNCBjEbl.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/sign-up.astro.mjs');
const _page2 = () => import('./pages/tech-club.astro.mjs');
const _page3 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/.pnpm/astro@5.13.5_@types+node@24.3.0_@upstash+redis@1.35.3_@vercel+functions@2.2.13_@aws-sdk+crede_pww2basmkgkikqz33ncqllwxau/node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/sign-up.astro", _page1],
    ["src/pages/tech-club.astro", _page2],
    ["src/pages/index.astro", _page3]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "3a1ace13-099f-44f7-bd5b-61595e3030f5",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
