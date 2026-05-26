// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  image: {
    endpoint: {
      route: "/_image",
      entrypoint: "@astrojs/cloudflare/image-endpoint"
    }
  },

  adapter: cloudflare(),
  site: 'https://jackk.dev',
  integrations: [sitemap()],
});