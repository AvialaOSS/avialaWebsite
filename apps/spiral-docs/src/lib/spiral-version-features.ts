import { getDefaultDocsVersion } from "../versions-registry";

const version = import.meta.env.VITE_DOCS_VERSION || getDefaultDocsVersion();
const [major = 0, minor = 0] = version.split(".").map(Number);

export const usesComponentButtonModes =
  import.meta.env.VITE_DOCS_SPIRAL_LOCAL === "1" ||
  major > 3 ||
  (major === 3 && minor >= 1);
