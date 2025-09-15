// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
// import vercel from "@astrojs/vercel/static"; // Commented out for Cloudflare Workers migration

// https://astro.build/config
export default defineConfig({
    output: "static",
    // adapter: vercel(), // Commented out for Cloudflare Workers migration
    integrations: [tailwind(), react()],
    image: {
        // Enable image optimization
        service: {
            entrypoint: "astro/assets/services/sharp",
        },
    },
});
