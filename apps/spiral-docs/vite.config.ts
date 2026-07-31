import type { IncomingMessage, ServerResponse } from "node:http";
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import remarkGfm from "remark-gfm";
import { defineConfig, type Plugin, type PluginOption, loadEnv } from "vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const siteStaticRoot = path.resolve(dirname, "../../static/docs/spiral");

function docsBaseRedirectPlugin(docsBasePath: string): Plugin {
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

/** Resolve @aviala-design/* (incl. subpath CSS) from a versioned npm cache install. */
function docsPkgResolvePlugin(pkgRoot: string): Plugin {
  const requireFromCache = createRequire(path.join(pkgRoot, "package.json"));
  return {
    name: "docs-pkg-resolve",
    enforce: "pre",
    resolveId(source) {
      if (!source.startsWith("@aviala-design/")) return null;
      try {
        return requireFromCache.resolve(source);
      } catch {
        return null;
      }
    },
  };
}

function defaultSpiralAlias(): Record<string, string> | undefined {
  const candidates = [
    path.resolve(dirname, "node_modules/@aviala-design/spiral"),
    path.resolve(dirname, "../../node_modules/@aviala-design/spiral"),
  ];
  const spiralPackageDir = candidates.find((dir) =>
    existsSync(path.join(dir, "package.json")),
  );
  if (!spiralPackageDir) return undefined;
  return {
    "@aviala-design/spiral": path.resolve(spiralPackageDir, "dist/index.js"),
    "@aviala-design/spiral/styles.css": path.resolve(spiralPackageDir, "dist/styles.css"),
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, dirname, "");
  const docsVersion = env.VITE_DOCS_VERSION || process.env.VITE_DOCS_VERSION || "";
  const docsBasePath =
    env.VITE_DOCS_BASENAME ||
    process.env.VITE_DOCS_BASENAME ||
    (docsVersion ? `/docs/spiral/v/${docsVersion}` : "/docs/spiral");
  const outDir =
    process.env.DOCS_OUT_DIR ||
    (docsVersion ? path.join(siteStaticRoot, "v", docsVersion) : siteStaticRoot);
  const pkgRoot = process.env.DOCS_PKG_ROOT;
  const emptyOutDir = process.env.DOCS_EMPTY_OUT_DIR !== "0";

  const plugins = [
    {
      enforce: "pre" as const,
      ...mdx({ remarkPlugins: [remarkGfm] }),
    },
    docsBaseRedirectPlugin(docsBasePath),
    react(),
    tailwindcss(),
  ] satisfies PluginOption[];

  if (pkgRoot && existsSync(path.join(pkgRoot, "package.json"))) {
    plugins.unshift(docsPkgResolvePlugin(pkgRoot));
  }

  return {
    base: `${docsBasePath}/`,
    define: {
      "import.meta.env.VITE_DOCS_BASENAME": JSON.stringify(docsBasePath),
      "import.meta.env.VITE_DOCS_VERSION": JSON.stringify(docsVersion),
    },
    plugins,
    resolve: {
      alias: pkgRoot ? undefined : defaultSpiralAlias(),
      conditions: ["module", "browser", "import", "default"],
    },
    server: {
      host: true,
      port: 5175,
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
      outDir,
      emptyOutDir,
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
  };
});
