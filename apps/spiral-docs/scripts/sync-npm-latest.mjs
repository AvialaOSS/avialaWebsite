import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const target = path.resolve(dirname, "../src/generated/npm-latest.json");

async function fetchLatest() {
  const url = "https://registry.npmjs.org/@aviala-design/spiral/latest";
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`npm registry ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return {
    name: "@aviala-design/spiral",
    version: String(data.version ?? ""),
    fetchedAt: new Date().toISOString(),
  };
}

try {
  const payload = await fetchLatest();
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`npm latest @aviala-design/spiral@${payload.version} → ${target}`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`Could not fetch npm latest (${message}); writing placeholder.`);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(
    target,
    `${JSON.stringify({ name: "@aviala-design/spiral", version: "", fetchedAt: null, error: message }, null, 2)}\n`,
  );
}
