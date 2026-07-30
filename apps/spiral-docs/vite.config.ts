import type { IncomingMessage, ServerResponse } from "node:http";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import remarkGfm from "remark-gfm";
import { defineConfig, type Plugin } from "vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const docsBasePath = "/docs/spiral";
// Prefer nested apps/spiral-docs install (1.0.0) over a hoisted root 0.2.0.
const spiralPackageCandidates = [
  path.resolve(dirname, "node_modules/@aviala-design/spiral"),
  path.resolve(dirname, "../../node_modules/@aviala-design/spiral"),
];
const spiralPackageDir = spiralPackageCandidates.find((dir) =>
  existsSync(path.join(dir, "package.json"))
);

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
    // Prefer apps/spiral-docs nested 1.0.0 over a hoisted root 0.2.0 (e.g. colorcat).
    alias: spiralPackageDir
      ? {
          "@aviala-design/spiral": path.resolve(spiralPackageDir, "dist/index.js"),
          "@aviala-design/spiral/styles.css": path.resolve(spiralPackageDir, "dist/styles.css"),
        }
      : undefined,
    // @aviala-design/spiral maps the `development` condition to ./src, which is not
    // published; always resolve the built entry points instead.
    conditions: ["module", "browser", "import", "default"],
  },
  server: {
    host: true,
    port: 5175,
    // Allow Hugo (localhost:1313) to load Vite modules + HMR websocket.
    cors: true,
    origin: "http://localhost:5175",
    hmr: {
      host: "localhost",
      protocol: "ws",
      clientPort: 5175,
    },
  },
  preview: { host: true, port: 5175 },
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
