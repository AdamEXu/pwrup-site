const GENERAL_FORM =
  "https://docs.google.com/forms/d/e/1FAIpQLSfGztcsv36DX8pSdFCm8Tai8MZD1ZnjdFHDCkIhgWYq6FIVeg/viewform";
const INTERNAL_FORM =
  "https://docs.google.com/forms/d/e/1FAIpQLScxtKLT8RRvoEpeMEobD0_nWtot29ryoKWw9naw2nxv6lT9VQ/viewform?usp=header";
const TECH_CLUB = "https://club-fair-techclub.vercel.app/";

const ROLE_ENTRY = "entry.1824823162";
const ROLES: Record<string, string> = {
  business: "Business",
  marketing: "Marketing",
  software: "Software",
  hardware: "Hardware",
};

function signUpTarget(params: URLSearchParams): string {
  if (params.get("internal") === "true") return INTERNAL_FORM;
  const role = ROLES[params.get("role") ?? ""];
  if (role) {
    return `${GENERAL_FORM}?usp=pp_url&${ROLE_ENTRY}=${encodeURIComponent(role)}`;
  }
  return `${GENERAL_FORM}?usp=header`;
}

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

    switch (path) {
      case "/sign-up":
        return Response.redirect(signUpTarget(url.searchParams), 302);
      case "/submit":
      case "/tech-club":
        return Response.redirect(TECH_CLUB, 302);
      default:
        return env.ASSETS.fetch(request);
    }
  },
} satisfies ExportedHandler<Env>;
