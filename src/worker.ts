import { redirectFor } from "./lib/redirects";

interface Env {
  ASSETS: Fetcher;
}

function parseRange(
  header: string,
  size: number,
): { start: number; end: number } | null {
  const m = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!m || (m[1] === "" && m[2] === "")) return null;
  let start: number;
  let end: number;
  if (m[1] === "") {
    const suffix = Number(m[2]);
    if (suffix === 0) return null;
    start = Math.max(size - suffix, 0);
    end = size - 1;
  } else {
    start = Number(m[1]);
    end = m[2] === "" ? size - 1 : Math.min(Number(m[2]), size - 1);
  }
  if (start > end || start >= size) return null;
  return { start, end };
}

// Static assets answer every request with a full 200 and no Accept-Ranges.
// Safari will not play media from such an origin, so the background video is
// routed through the Cache API, which serves byte ranges once the object is
// cached. The cold request cannot wait for that (the cache reports the object
// as still filling), so it is buffered and sliced here while the cache warms.
async function serveVideo(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  const cache = caches.default;
  const key = new Request(request.url);

  const hit = await cache.match(request);
  if (hit) return hit;

  const full = await env.ASSETS.fetch(key);
  if (!full.ok) return full;
  const headers = new Headers(full.headers);
  headers.set("accept-ranges", "bytes");
  ctx.waitUntil(cache.put(key, new Response(full.clone().body, { headers })));

  const buffer = await full.arrayBuffer();
  const size = buffer.byteLength;
  headers.set("content-length", String(size));
  const rangeHeader = request.headers.get("range");
  if (!rangeHeader) return new Response(buffer, { status: 200, headers });

  const range = parseRange(rangeHeader, size);
  if (!range) {
    headers.set("content-range", `bytes */${size}`);
    return new Response(null, { status: 416, headers });
  }
  headers.set("content-range", `bytes ${range.start}-${range.end}/${size}`);
  headers.set("content-length", String(range.end - range.start + 1));
  return new Response(buffer.slice(range.start, range.end + 1), {
    status: 206,
    headers,
  });
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> | Response {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    if (path.startsWith("/video/") && path.endsWith(".mp4")) {
      return serveVideo(request, env, ctx);
    }

    const target = redirectFor(url);
    if (target) return Response.redirect(target, 302);
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
