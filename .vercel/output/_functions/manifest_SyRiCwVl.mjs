import { q as decodeKey } from './chunks/astro/server_DEBWJpAb.mjs';
import 'clsx';
import './chunks/index_Bs0HCuc7.mjs';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_hYsG6iDt.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/adam/Developer/pwrup-site/","cacheDir":"file:///Users/adam/Developer/pwrup-site/node_modules/.astro/","outDir":"file:///Users/adam/Developer/pwrup-site/dist/","srcDir":"file:///Users/adam/Developer/pwrup-site/src/","publicDir":"file:///Users/adam/Developer/pwrup-site/public/","buildClientDir":"file:///Users/adam/Developer/pwrup-site/dist/client/","buildServerDir":"file:///Users/adam/Developer/pwrup-site/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/.pnpm/astro@5.13.5_@types+node@24.3.0_@upstash+redis@1.35.3_@vercel+functions@2.2.13_@aws-sdk+crede_pww2basmkgkikqz33ncqllwxau/node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_id_.BOEFWiGw.css"},{"type":"external","src":"/_astro/_id_.Bx_qIffM.css"}],"routeData":{"route":"/admin/edit/[id]","isIndex":false,"type":"page","pattern":"^\\/admin\\/edit\\/([^/]+?)\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"edit","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/admin/edit/[id].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_id_.BOEFWiGw.css"},{"type":"external","src":"/_astro/_id_.Bx_qIffM.css"}],"routeData":{"route":"/admin/new","isIndex":false,"type":"page","pattern":"^\\/admin\\/new\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"new","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/new.astro","pathname":"/admin/new","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_id_.BOEFWiGw.css"},{"type":"external","src":"/_astro/_id_.Bx_qIffM.css"}],"routeData":{"route":"/admin","isIndex":true,"type":"page","pattern":"^\\/admin\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/index.astro","pathname":"/admin","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/admins","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/admins\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admins","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admins/index.ts","pathname":"/api/admins","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/posts/create","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/posts\\/create\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"posts","dynamic":false,"spread":false}],[{"content":"create","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/posts/create.ts","pathname":"/api/posts/create","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/posts/meta","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/posts\\/meta\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"posts","dynamic":false,"spread":false}],[{"content":"meta","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/posts/meta.ts","pathname":"/api/posts/meta","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/posts/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/posts\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"posts","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/posts/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/posts","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/posts\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"posts","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/posts.ts","pathname":"/api/posts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/upload","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/upload\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"upload","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/upload.ts","pathname":"/api/upload","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_id_.BOEFWiGw.css"},{"type":"external","src":"/_astro/_id_.Bx_qIffM.css"}],"routeData":{"route":"/blog/[slug]","isIndex":false,"type":"page","pattern":"^\\/blog\\/([^/]+?)\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"src/pages/blog/[slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_id_.BOEFWiGw.css"},{"type":"external","src":"/_astro/_id_.Bx_qIffM.css"}],"routeData":{"route":"/blog","isIndex":true,"type":"page","pattern":"^\\/blog\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/index.astro","pathname":"/blog","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_id_.BOEFWiGw.css"}],"routeData":{"route":"/sign-in","isIndex":false,"type":"page","pattern":"^\\/sign-in\\/?$","segments":[[{"content":"sign-in","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/sign-in.astro","pathname":"/sign-in","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_id_.BOEFWiGw.css"}],"routeData":{"route":"/sign-up","isIndex":false,"type":"page","pattern":"^\\/sign-up\\/?$","segments":[[{"content":"sign-up","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/sign-up.astro","pathname":"/sign-up","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_id_.BOEFWiGw.css"}],"routeData":{"route":"/tech-club","isIndex":false,"type":"page","pattern":"^\\/tech-club\\/?$","segments":[[{"content":"tech-club","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/tech-club.astro","pathname":"/tech-club","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_id_.BOEFWiGw.css"}],"routeData":{"route":"/test","isIndex":false,"type":"page","pattern":"^\\/test\\/?$","segments":[[{"content":"test","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/test.astro","pathname":"/test","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_id_.BOEFWiGw.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/adam/Developer/pwrup-site/src/pages/admin/edit/[id].astro",{"propagation":"none","containsHead":true}],["/Users/adam/Developer/pwrup-site/src/pages/admin/index.astro",{"propagation":"none","containsHead":true}],["/Users/adam/Developer/pwrup-site/src/pages/admin/new.astro",{"propagation":"none","containsHead":true}],["/Users/adam/Developer/pwrup-site/src/pages/blog/[slug].astro",{"propagation":"none","containsHead":true}],["/Users/adam/Developer/pwrup-site/src/pages/blog/index.astro",{"propagation":"none","containsHead":true}],["/Users/adam/Developer/pwrup-site/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/Users/adam/Developer/pwrup-site/src/pages/sign-in.astro",{"propagation":"none","containsHead":true}],["/Users/adam/Developer/pwrup-site/src/pages/test.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-page:src/pages/admin/edit/[id]@_@astro":"pages/admin/edit/_id_.astro.mjs","\u0000@astro-page:src/pages/admin/new@_@astro":"pages/admin/new.astro.mjs","\u0000@astro-page:src/pages/admin/index@_@astro":"pages/admin.astro.mjs","\u0000@astro-page:src/pages/api/admins/index@_@ts":"pages/api/admins.astro.mjs","\u0000@astro-page:src/pages/api/posts/create@_@ts":"pages/api/posts/create.astro.mjs","\u0000@astro-page:src/pages/api/posts/meta@_@ts":"pages/api/posts/meta.astro.mjs","\u0000@astro-page:src/pages/api/posts/[id]@_@ts":"pages/api/posts/_id_.astro.mjs","\u0000@astro-page:src/pages/api/posts@_@ts":"pages/api/posts.astro.mjs","\u0000@astro-page:src/pages/api/upload@_@ts":"pages/api/upload.astro.mjs","\u0000@astro-page:src/pages/blog/[slug]@_@astro":"pages/blog/_slug_.astro.mjs","\u0000@astro-page:src/pages/blog/index@_@astro":"pages/blog.astro.mjs","\u0000@astro-page:src/pages/sign-in@_@astro":"pages/sign-in.astro.mjs","\u0000@astro-page:src/pages/sign-up@_@astro":"pages/sign-up.astro.mjs","\u0000@astro-page:src/pages/tech-club@_@astro":"pages/tech-club.astro.mjs","\u0000@astro-page:src/pages/test@_@astro":"pages/test.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/.pnpm/astro@5.13.5_@types+node@24.3.0_@upstash+redis@1.35.3_@vercel+functions@2.2.13_@aws-sdk+crede_pww2basmkgkikqz33ncqllwxau/node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_SyRiCwVl.mjs","/Users/adam/Developer/pwrup-site/node_modules/.pnpm/astro@5.13.5_@types+node@24.3.0_@upstash+redis@1.35.3_@vercel+functions@2.2.13_@aws-sdk+crede_pww2basmkgkikqz33ncqllwxau/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_R0WsTSK3.mjs","/Users/adam/Developer/pwrup-site/src/components/BlogPostPage.tsx":"_astro/BlogPostPage.DpZuasKI.js","/Users/adam/Developer/pwrup-site/src/components/BlogPage.tsx":"_astro/BlogPage.CGc2nSJd.js","/Users/adam/Developer/pwrup-site/src/components/Welcome.tsx":"_astro/Welcome.BTvo3wCT.js","/Users/adam/Developer/pwrup-site/src/components/NavBar.tsx":"_astro/NavBar.DpYYpKxj.js","@astrojs/react/client.js":"_astro/client.BYBrYqb_.js","/Users/adam/Developer/pwrup-site/src/pages/sign-in.astro?astro&type=script&index=0&lang.ts":"_astro/sign-in.astro_astro_type_script_index_0_lang.DtKOPCv7.js","/Users/adam/Developer/pwrup-site/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts":"_astro/Layout.astro_astro_type_script_index_0_lang.oH-GBmxU.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/Users/adam/Developer/pwrup-site/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts","const n=new Set,d=t=>{if(n.has(t))return;const e=document.createElement(\"link\");e.rel=\"prefetch\",e.href=t,document.head.appendChild(e),n.add(t)};document.addEventListener(\"mouseover\",t=>{const e=t.target.closest('a[href^=\"/\"]');e&&d(e.href)},{passive:!0});"]],"assets":["/_astro/_id_.BOEFWiGw.css","/_astro/_id_.Bx_qIffM.css","/Hand_Drawn_Arrow.svg","/PWRUP_text.svg","/Reefscape-Robot.png","/Slide.jpg","/business_role.svg","/favicon.svg","/marketing_role.svg","/_astro/BlogPage.CGc2nSJd.js","/_astro/BlogPostPage.DpZuasKI.js","/_astro/NavBar.DpYYpKxj.js","/_astro/Welcome.BTvo3wCT.js","/_astro/client.BYBrYqb_.js","/_astro/index.CQ95-tCy.js","/_astro/jsx-runtime.D_zvdyIk.js","/_astro/sign-in.astro_astro_type_script_index_0_lang.DtKOPCv7.js"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"3+woWU2cQ1ULcWw7yKcS1dDTFnAymrLZ0EHBo0l7qak="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
