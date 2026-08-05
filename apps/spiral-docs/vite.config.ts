import type { IncomingMessage, ServerResponse } from "node:http";
import { createRequire } from "node:module";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import remarkGfm from "remark-gfm";
import { defineConfig, type Plugin, type PluginOption, loadEnv } from "vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const siteStaticRoot = path.resolve(dirname, "../../static/docs/spiral");
const siteNodeModules = path.resolve(dirname, "../../node_modules");

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
  const EMPTY_CSS_PREFIX = "\0aviala-empty-css:";
  return {
    name: "docs-pkg-resolve",
    enforce: "pre",
    resolveId(source) {
      if (!source.startsWith("@aviala-design/")) return null;
      try {
        return requireFromCache.resolve(source);
      } catch {
        // Older token packages omit exports added in later minors (e.g. tab-effects.css).
        // Stub empty CSS so one docs SPA source tree can build against every covered pin.
        if (source.startsWith("@aviala-design/tokens/") && source.endsWith(".css")) {
          return `${EMPTY_CSS_PREFIX}${source}`;
        }
        return null;
      }
    },
    load(id) {
      if (!id.startsWith(EMPTY_CSS_PREFIX)) return null;
      return `/* ${id.slice(EMPTY_CSS_PREFIX.length)} unavailable in this docs package pin */\n`;
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

type LocalSpiralPaths = {
  root: string;
  ui: string;
  tokens: string;
  icons: string;
  spiralEntry: string;
};

function resolveLocalSpiral(): LocalSpiralPaths | null {
  const flag = process.env.DOCS_SPIRAL_LOCAL;
  const rootEnv = process.env.DOCS_SPIRAL_ROOT?.trim();
  const enabled =
    Boolean(rootEnv) || flag === "1" || flag === "true" || flag === "yes";
  if (!enabled) return null;

  const root = rootEnv
    ? path.resolve(dirname, rootEnv)
    : path.resolve(dirname, "../../../Spiral2");

  const ui = path.join(root, "packages/ui");
  const tokens = path.join(root, "packages/tokens");
  const icons = path.join(root, "packages/icons");

  for (const [label, dir] of [
    ["Spiral2", root],
    ["@aviala-design/spiral (packages/ui)", ui],
    ["@aviala-design/tokens", tokens],
    ["@aviala-design/icons", icons],
  ] as const) {
    if (!existsSync(path.join(dir, "package.json"))) {
      console.warn(`[spiral-docs] local Spiral missing ${label}: ${dir}`);
      if (label === "Spiral2") {
        console.warn(
          "  Set DOCS_SPIRAL_ROOT to the Spiral2 checkout, or clone it next to avialaWebsite.",
        );
      }
      return null;
    }
  }

  const preferSrc = process.env.DOCS_SPIRAL_LOCAL_DIST !== "1";
  const srcEntry = path.join(ui, "src/index.ts");
  const distEntry = path.join(ui, "dist/index.js");
  const spiralEntry =
    preferSrc && existsSync(srcEntry)
      ? srcEntry
      : existsSync(distEntry)
        ? distEntry
        : srcEntry;

  if (!existsSync(path.join(tokens, "dist/styles.css"))) {
    console.warn(
      `[spiral-docs] local tokens dist missing — run: pnpm --filter @aviala-design/tokens build`,
    );
    console.warn(`  (in ${root})`);
  }
  if (!existsSync(path.join(icons, "dist/index.js"))) {
    console.warn(
      `[spiral-docs] local icons dist missing — run: pnpm --filter @aviala-design/icons build`,
    );
    console.warn(`  (in ${root})`);
  }

  console.log(
    `[spiral-docs] DOCS_SPIRAL_LOCAL → ${root} (spiral: ${path.relative(root, spiralEntry)})`,
  );

  return { root, ui, tokens, icons, spiralEntry };
}

/** Resolve @aviala-design/{spiral,tokens,icons} from a local Spiral2 checkout. */
function localSpiralResolvePlugin(local: LocalSpiralPaths): Plugin {
  const packageDirs: Record<string, string> = {
    "@aviala-design/spiral": local.ui,
    "@aviala-design/tokens": local.tokens,
    "@aviala-design/icons": local.icons,
  };

  /** Prefer ESM/dist — `createRequire().resolve` picks the `require` export (CJS). */
  function resolvePackageEntry(pkgDir: string, kind: "spiral" | "icons" | "tokens") {
    if (kind === "spiral") return local.spiralEntry;

    const distJs = path.join(pkgDir, "dist/index.js");
    const srcTs = path.join(pkgDir, "src/index.ts");
    if (kind === "icons") {
      // Icons are codegen'd into src; prefer src for HMR, else built ESM.
      if (process.env.DOCS_SPIRAL_LOCAL_DIST !== "1" && existsSync(srcTs)) {
        return srcTs;
      }
      return existsSync(distJs) ? distJs : null;
    }
    // tokens root is CSS-first; only resolve if an ESM entry exists.
    return existsSync(distJs) ? distJs : null;
  }

  return {
    name: "docs-local-spiral-resolve",
    enforce: "pre",
    resolveId(source) {
      for (const [name, pkgDir] of Object.entries(packageDirs)) {
        if (source !== name && !source.startsWith(`${name}/`)) continue;

        if (source === "@aviala-design/spiral") {
          return local.spiralEntry;
        }
        if (source === "@aviala-design/icons") {
          return resolvePackageEntry(pkgDir, "icons");
        }
        if (source === "@aviala-design/tokens") {
          return resolvePackageEntry(pkgDir, "tokens");
        }
        if (source === "@aviala-design/spiral/styles.css") {
          const css = path.join(pkgDir, "dist/styles.css");
          return existsSync(css) ? css : null;
        }

        // Subpaths (e.g. tokens/*.css). Prefer package exports → local dist so we
        // never accidentally resolve a second copy from the docs node_modules.
        const subpath = `./${source.slice(name.length + 1)}`;
        try {
          const pkgJson = JSON.parse(
            readFileSync(path.join(pkgDir, "package.json"), "utf8"),
          ) as { exports?: Record<string, string | Record<string, string>> };
          const exp = pkgJson.exports?.[subpath];
          const rel =
            typeof exp === "string"
              ? exp
              : exp && typeof exp === "object"
                ? exp.default || exp.import || exp.require
                : undefined;
          if (typeof rel === "string") {
            const resolved = path.resolve(pkgDir, rel);
            if (existsSync(resolved)) return resolved;
          }
        } catch {
          /* fall through */
        }
        const requireFromPkg = createRequire(path.join(pkgDir, "package.json"));
        try {
          return requireFromPkg.resolve(source);
        } catch {
          return null;
        }
      }
      return null;
    },
  };
}

function writeLocalSpiralTailwindSources(local: LocalSpiralPaths | null) {
  const outDir = path.join(dirname, "src/.generated");
  const outFile = path.join(outDir, "local-spiral-sources.css");
  mkdirSync(outDir, { recursive: true });
  if (!local) {
    writeFileSync(outFile, "/* local Spiral Tailwind @source: off */\n");
    return;
  }
  const uiSrc = path.join(local.ui, "src");
  const rel = path.relative(outDir, uiSrc).replace(/\\/g, "/");
  writeFileSync(
    outFile,
    `/* auto-generated by vite.config — DOCS_SPIRAL_LOCAL */\n@source "${rel}";\n`,
  );
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
  const localSpiral = resolveLocalSpiral();
  writeLocalSpiralTailwindSources(localSpiral);

  const plugins = [
    {
      enforce: "pre" as const,
      ...mdx({ remarkPlugins: [remarkGfm] }),
    },
    docsBaseRedirectPlugin(docsBasePath),
    react(),
    tailwindcss(),
  ] satisfies PluginOption[];

  if (localSpiral) {
    plugins.unshift(localSpiralResolvePlugin(localSpiral));
  } else if (pkgRoot && existsSync(path.join(pkgRoot, "package.json"))) {
    plugins.unshift(docsPkgResolvePlugin(pkgRoot));
  }

  const reactDedupeAlias =
    localSpiral && existsSync(path.join(siteNodeModules, "react"))
      ? {
          react: path.join(siteNodeModules, "react"),
          "react-dom": path.join(siteNodeModules, "react-dom"),
          "react/jsx-runtime": path.join(siteNodeModules, "react/jsx-runtime"),
          "react/jsx-dev-runtime": path.join(
            siteNodeModules,
            "react/jsx-dev-runtime",
          ),
        }
      : undefined;

  return {
    base: `${docsBasePath}/`,
    define: {
      "import.meta.env.VITE_DOCS_BASENAME": JSON.stringify(docsBasePath),
      "import.meta.env.VITE_DOCS_VERSION": JSON.stringify(docsVersion),
      "import.meta.env.VITE_DOCS_SPIRAL_LOCAL": JSON.stringify(
        localSpiral ? "1" : "",
      ),
    },
    plugins,
    resolve: {
      alias: {
        ...(pkgRoot || localSpiral ? {} : defaultSpiralAlias()),
        ...reactDedupeAlias,
      },
      // Avoid Spiral package.json "development" → src when using npm dist.
      // Local mode resolves spiral via plugin (src or dist) explicitly.
      conditions: ["module", "browser", "import", "default"],
      dedupe: ["react", "react-dom"],
    },
    server: {
      host: true,
      port: 5175,
      cors: true,
      fs: {
        allow: [
          path.resolve(dirname, "../.."),
          ...(localSpiral ? [localSpiral.root] : []),
        ],
      },
      // Do not hardcode hmr.host=localhost — breaks Network IP preview and
      // some embedded browsers. Client uses the page's current host:port.
      hmr: {
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
