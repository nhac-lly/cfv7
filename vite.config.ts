import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// By default react-router's dev server uses Node.js, so we want to remove their server
// configuration to use the dev server provided by Vite + Workerd.
const reactRouterPlugins = reactRouter();
// biome-ignore lint/style/noNonNullAssertion: <explanation>
const reactRouterPlugin = reactRouterPlugins.find(
  (plugin) => plugin.name === "react-router",
)!;
reactRouterPlugin.configureServer = undefined;

export default defineConfig({
  plugins: [tailwindcss(), cloudflare(), reactRouterPlugins, tsconfigPaths()],
  ssr: {
    resolve: {
      conditions: ["workerd", "worker", "browser"],
    },
  },
  resolve: {
    mainFields: ["browser", "module", "main"],
  },
  build: {
    minify: true,
  },
});
