import { createRequire } from "node:module";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";
import { revisionsApiPlugin } from "./vite-plugin-revisions-api";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const spiralDocsSrc = path.resolve(dirname, "../spiral-docs/src");
const revisionsRoot = path.resolve(spiralDocsSrc, "doc-revisions");
const siteNodeModules = path.resolve(dirname, "../../node_modules");

function defaultSpiralAlias(): Record<string, string> | undefined {
  const candidates = [
    path.resolve(dirname, "node_modules/@aviala-design/spiral"),
    path.resolve(dirname, "../../node_modules/@aviala-design/spiral"),
  ];
  const spiralPackageDir = candidates.find((dir) =>
    existsSync(path.join(dir, "package.json")),
  );
  if (!spiralPackageDir) return undefined;
  const distJs = path.resolve(spiralPackageDir, "dist/index.js");
  if (!existsSync(distJs)) return undefined;
  return {
    "@aviala-design/spiral": distJs,
    "@aviala-design/spiral/styles.css": path.resolve(
      spiralPackageDir,
      "dist/styles.css",
    ),
  };
}

type LocalSpiralPaths = {
  root: string;
  ui: string;
  tokens: string;
  icons: string;
  spiralEntry: string;
  useTokensVitePlugin: boolean;
};

function preferLocalSrc() {
  return process.env.DOCS_SPIRAL_LOCAL_DIST !== "1";
}

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
  if (!existsSync(path.join(root, "package.json"))) return null;
  if (!existsSync(path.join(ui, "package.json"))) return null;

  const useSrc = preferLocalSrc();
  const tokensPluginPath = path.join(tokens, "vite-plugin.mjs");
  const useTokensVitePlugin = useSrc && existsSync(tokensPluginPath);
  const srcEntry = path.join(ui, "src/index.ts");
  const distEntry = path.join(ui, "dist/index.js");
  const spiralEntry =
    useSrc && existsSync(srcEntry)
      ? srcEntry
      : existsSync(distEntry)
        ? distEntry
        : srcEntry;

  console.log(
    `[design-guide-editor] DOCS_SPIRAL_LOCAL → ${root} (spiral: ${path.relative(root, spiralEntry)})`,
  );

  return { root, ui, tokens, icons, spiralEntry, useTokensVitePlugin };
}

async function loadLocalTokensVitePlugin(
  local: LocalSpiralPaths,
): Promise<Plugin | null> {
  if (!local.useTokensVitePlugin) return null;
  const pluginFile = path.join(local.tokens, "vite-plugin.mjs");
  try {
    const mod = (await import(pathToFileURL(pluginFile).href)) as {
      default: (options?: { cacheDir?: string }) => Plugin;
    };
    return mod.default({
      cacheDir: path.join(dirname, "node_modules/.cache/aviala-tokens-css"),
    });
  } catch (err) {
    console.warn(`[design-guide-editor] tokens vite-plugin failed:`, err);
    return null;
  }
}

function localSpiralResolvePlugin(local: LocalSpiralPaths): Plugin {
  const packageDirs: Record<string, string> = {
    "@aviala-design/spiral": local.ui,
    "@aviala-design/tokens": local.tokens,
    "@aviala-design/icons": local.icons,
  };
  const useSrc = preferLocalSrc();

  return {
    name: "dge-local-spiral-resolve",
    enforce: "pre",
    resolveId(source) {
      for (const [name, pkgDir] of Object.entries(packageDirs)) {
        if (source !== name && !source.startsWith(`${name}/`)) continue;
        if (local.useTokensVitePlugin) {
          if (name === "@aviala-design/tokens") return null;
          if (source === "@aviala-design/spiral/styles.css") return null;
        }
        if (source === "@aviala-design/spiral") return local.spiralEntry;
        if (source === "@aviala-design/icons") {
          const srcTs = path.join(pkgDir, "src/index.ts");
          const distJs = path.join(pkgDir, "dist/index.js");
          if (useSrc && existsSync(srcTs)) return srcTs;
          return existsSync(distJs) ? distJs : null;
        }
        if (source === "@aviala-design/tokens") {
          const srcTs = path.join(pkgDir, "src/index.ts");
          const distJs = path.join(pkgDir, "dist/index.js");
          if (local.useTokensVitePlugin && existsSync(srcTs)) return srcTs;
          return existsSync(distJs) ? distJs : existsSync(srcTs) ? srcTs : null;
        }
        if (source === "@aviala-design/spiral/styles.css") {
          const css = path.join(pkgDir, "dist/styles.css");
          return existsSync(css) ? css : null;
        }
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

export default defineConfig(async () => {
  const localSpiral = resolveLocalSpiral();
  writeLocalSpiralTailwindSources(localSpiral);
  const tokensVitePlugin = localSpiral
    ? await loadLocalTokensVitePlugin(localSpiral)
    : null;

  const plugins: Plugin[] = [
    revisionsApiPlugin(revisionsRoot),
    react(),
    tailwindcss(),
  ];
  if (tokensVitePlugin) plugins.unshift(tokensVitePlugin);
  if (localSpiral) plugins.unshift(localSpiralResolvePlugin(localSpiral));

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
    plugins,
    resolve: {
      alias: {
        "@spiral-docs": spiralDocsSrc,
        ...(localSpiral ? {} : defaultSpiralAlias()),
        ...reactDedupeAlias,
      },
      // Avoid Spiral package.json "development" → src (npm package only ships dist).
      conditions: ["module", "browser", "import", "default"],
      dedupe: ["react", "react-dom"],
    },
    server: {
      port: 5176,
      strictPort: true,
      fs: {
        allow: [
          path.resolve(dirname, "../.."),
          ...(localSpiral ? [localSpiral.root] : []),
        ],
      },
    },
    preview: {
      port: 5176,
      strictPort: true,
    },
  };
});
