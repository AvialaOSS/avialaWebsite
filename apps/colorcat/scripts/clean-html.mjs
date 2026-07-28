import { unlinkSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../static/tools/colorcat/index.html");

if (existsSync(root)) {
  unlinkSync(root);
  console.log("Removed Vite index.html so Hugo can own /tools/colorcat/");
}
