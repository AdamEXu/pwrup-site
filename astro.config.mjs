// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
    output: "static",
    integrations: [tailwind(), react()],
    image: {
        // Enable image optimization
        service: {
            entrypoint: "astro/assets/services/sharp",
        },
    },
    redirects: {
        "/cadsfc-map": "https://maps.app.goo.gl/BF2mQuYUAUtgCkUm7"
    }
});
