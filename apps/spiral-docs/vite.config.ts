import type { IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import remarkGfm from "remark-gfm";
import { defineConfig, type Plugin } from "vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const docsBasePath = "/docs/spiral";

function docsBaseRedirectPlugin(): Plugin {
  const redirectTarget = `${docsBasePath}/`;

  function maybeRedirect(req: IncomingMessage, res: ServerResponse): boolean {
    const pathname = req.url?.split("?")[0];
    if (pathname !== docsBasePath) {
      return false;
    }

    const query = req.url?.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
    res.writeHead(301, { Location: `${redirectTarget}${query}` });
    res.end();
    return true;
  }

  return {
    name: "spiral-docs-base-redirect",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (maybeRedirect(req, res)) return;
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (maybeRedirect(req, res)) return;
        next();
      });
    },
  };
}

export default defineConfig({
  base: `${docsBasePath}/`,
  plugins: [
    {
      enforce: "pre",
      ...mdx({ remarkPlugins: [remarkGfm] }),
    },
    docsBaseRedirectPlugin(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    // @aviala-design/spiral maps the `development` condition to ./src, which is not
    // published; always resolve the built entry points instead.
    conditions: ["module", "browser", "import", "default"],
  },
  server: { port: 5175 },
  build: {
    outDir: path.resolve(dirname, "../../static/docs/spiral"),
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: "assets/spiral-docs.js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "assets/spiral-docs.css";
          }
          return "assets/[name][extname]";
        },
      },
    },
  },
});
