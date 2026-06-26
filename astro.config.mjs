// @ts-check
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

import sitemap from "@astrojs/sitemap";

const secureboardAppcastPath = path.join(
	fileURLToPath(new URL(".", import.meta.url)),
	"public/projects/secureboard/appcast.xml",
);

const secureboardAppcastPlugin = () => ({
	name: "secureboard-appcast",
	resolveId(id) {
		if (id === "virtual:secureboard-appcast") return id;
	},
	load(id) {
		if (id === "virtual:secureboard-appcast") {
			const appcastXml = readFileSync(secureboardAppcastPath, "utf8");
			return `export default ${JSON.stringify(appcastXml)}`;
		}
	},
});

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss(), secureboardAppcastPlugin()],
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