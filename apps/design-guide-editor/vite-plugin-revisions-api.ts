import type { IncomingMessage, ServerResponse } from "node:http";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { Connect, Plugin } from "vite";

const SAFE_SEGMENT = /^[A-Za-z0-9._-]+$/;

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function sendText(res: ServerResponse, status: number, text: string) {
  res.statusCode = status;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end(text);
}

function safeJoin(revisionsRoot: string, ...segments: string[]): string | null {
  const filePath = path.join(revisionsRoot, ...segments);
  if (!filePath.startsWith(revisionsRoot)) return null;
  return filePath;
}

/**
 * Dev-only API:
 * - `/api/design-guides/:component` → `{Component}/design-guide.ts` (versionless)
 * - `/api/revisions/:component/:version` → legacy semver revision files
 */
export function revisionsApiPlugin(revisionsRoot: string): Plugin {
  function attach(middlewares: Connect.Server) {
    middlewares.use(async (req, res, next) => {
      const url = req.url?.split("?")[0] ?? "";

      if (url.startsWith("/api/design-guides/")) {
        await handleDesignGuide(req, res, revisionsRoot, url);
        return;
      }

      if (url.startsWith("/api/revisions/")) {
        await handleRevision(req, res, revisionsRoot, url);
        return;
      }

      next();
    });
  }

  return {
    name: "design-guide-revisions-api",
    configureServer(server) {
      attach(server.middlewares);
    },
    configurePreviewServer(server) {
      attach(server.middlewares);
    },
  };
}

async function handleDesignGuide(
  req: IncomingMessage,
  res: ServerResponse,
  revisionsRoot: string,
  url: string,
) {
  const rest = url.slice("/api/design-guides/".length);
  const parts = rest.split("/").filter(Boolean);
  if (parts.length !== 1) {
    sendJson(res, 400, { error: "Expected /api/design-guides/:component" });
    return;
  }
  const component = parts[0]!.replace(/\.ts$/i, "");
  if (!SAFE_SEGMENT.test(component) || component === "design-guide") {
    sendJson(res, 400, { error: "Invalid component" });
    return;
  }

  const dirPath = safeJoin(revisionsRoot, component);
  const filePath = safeJoin(revisionsRoot, component, "design-guide.ts");
  if (!dirPath || !filePath) {
    sendJson(res, 400, { error: "Path escape blocked" });
    return;
  }

  try {
    if (req.method === "GET") {
      if (!existsSync(filePath)) {
        sendJson(res, 404, {
          error: `Missing ${component}/design-guide.ts`,
          empty: true,
        });
        return;
      }
      sendText(res, 200, readFileSync(filePath, "utf8"));
      return;
    }

    if (req.method === "PUT") {
      mkdirSync(dirPath, { recursive: true });
      const body = await readBody(req);
      writeFileSync(filePath, body, "utf8");
      sendJson(res, 200, { ok: true, path: `${component}/design-guide.ts` });
      return;
    }

    res.statusCode = 405;
    res.end("Method Not Allowed");
  } catch (err) {
    sendJson(res, 500, {
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

async function handleRevision(
  req: IncomingMessage,
  res: ServerResponse,
  revisionsRoot: string,
  url: string,
) {
  const rest = url.slice("/api/revisions/".length);
  const parts = rest.split("/").filter(Boolean);
  if (parts.length !== 2) {
    sendJson(res, 400, { error: "Expected /api/revisions/:component/:version" });
    return;
  }
  const [component, versionWithExt] = parts;
  const version = versionWithExt!.replace(/\.ts$/i, "");
  if (!SAFE_SEGMENT.test(component!) || !SAFE_SEGMENT.test(version)) {
    sendJson(res, 400, { error: "Invalid component or version" });
    return;
  }

  const filePath = safeJoin(revisionsRoot, component!, `${version}.ts`);
  if (!filePath) {
    sendJson(res, 400, { error: "Path escape blocked" });
    return;
  }

  try {
    if (req.method === "GET") {
      if (!existsSync(filePath)) {
        sendJson(res, 404, {
          error: `Missing ${component}/${version}.ts — scaffold the revision first`,
        });
        return;
      }
      sendText(res, 200, readFileSync(filePath, "utf8"));
      return;
    }

    if (req.method === "PUT") {
      if (!existsSync(filePath)) {
        sendJson(res, 404, {
          error: `Missing ${component}/${version}.ts — cannot create in v1`,
        });
        return;
      }
      const body = await readBody(req);
      writeFileSync(filePath, body, "utf8");
      sendJson(res, 200, { ok: true, path: `${component}/${version}.ts` });
      return;
    }

    res.statusCode = 405;
    res.end("Method Not Allowed");
  } catch (err) {
    sendJson(res, 500, {
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
