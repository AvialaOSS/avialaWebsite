import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@aviala-design/spiral";
import { AppRoutes } from "./App";
import { DocsVersionProvider } from "./components/DocsVersionProvider";
import { getDocsBasename } from "./docs-base";
/* Tailwind + docs chrome first (preflight). Spiral aggregate after so
   aviala-* effects win, matching the previous tokens-effects-after-index order. */
import "./index.css";
import "@aviala-design/spiral/styles.css";

const SPIRAL_DOCS_REDIRECT_KEY = "aviala-spiral-docs-redirect";
const docsBasename = getDocsBasename();

try {
  const redirect = sessionStorage.getItem(SPIRAL_DOCS_REDIRECT_KEY);
  if (redirect?.startsWith("/docs")) {
    sessionStorage.removeItem(SPIRAL_DOCS_REDIRECT_KEY);
    window.history.replaceState(null, "", redirect);
  }
} catch {
  // sessionStorage may be unavailable
}

const mount =
  document.getElementById("spiral-docs-root") ?? document.getElementById("root");

if (mount) {
  createRoot(mount).render(
    <StrictMode>
      <ThemeProvider defaultMode="light" defaultPresetId="ald" storageKey="aviala-spiral-docs">
        <BrowserRouter basename={docsBasename}>
          <DocsVersionProvider>
            <AppRoutes />
          </DocsVersionProvider>
        </BrowserRouter>
      </ThemeProvider>
    </StrictMode>
  );
}
