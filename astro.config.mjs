// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// Tailwind 3 is applied via postcss.config.js (Astro processes PostCSS natively).
// @astrojs/tailwind is deprecated and does not support Astro 6/7.
// https://astro.build/config
export default defineConfig({
    output: "static",
    integrations: [react()],
    image: {
        // Enable image optimization
        service: {
            entrypoint: "astro/assets/services/sharp",
        },
    },
    redirects: {
        "/cadsfc-map": "https://maps.app.goo.gl/BF2mQuYUAUtgCkUm7",
        "/tech-club": "https://club-fair-techclub.vercel.app/",
        "/submit": "https://club-fair-techclub.vercel.app/",
    }
});
