import { defineMiddleware } from "astro:middleware";
import { redirectFor } from "./lib/redirects";

// In production these redirects are answered by the Worker (src/worker.ts).
// The Astro dev server never runs the Worker, so mirror them here for `pnpm dev`.
export const onRequest = defineMiddleware(({ request, redirect }, next) => {
  if (import.meta.env.DEV) {
    const target = redirectFor(new URL(request.url));
    if (target) return redirect(target, 302);
  }
  return next();
});
