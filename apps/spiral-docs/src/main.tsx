import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@aviala-design/spiral";
import { AppRoutes } from "./App";
import { DocsVersionProvider } from "./components/DocsVersionProvider";
import { getDocsBasename } from "./docs-base";
/* Via JS import so DOCS_SPIRAL_LOCAL resolve plugin applies (CSS @import via Tailwind hits npm). */
import "@aviala-design/tokens/styles.css";
import "./index.css";
import "@aviala-design/tokens/ald-theme.css";
import "@aviala-design/tokens/input-effects.css";
import "@aviala-design/tokens/basic-input-effects.css";
import "@aviala-design/tokens/cascader-effects.css";
import "@aviala-design/tokens/popover-effects.css";
import "@aviala-design/tokens/modal-effects.css";
import "@aviala-design/tokens/tooltip-effects.css";
import "@aviala-design/tokens/color-picker-effects.css";
import "@aviala-design/tokens/loading-effects.css";
import "@aviala-design/tokens/typeface-effects.css";
import "@aviala-design/tokens/button-effects.css";
import "@aviala-design/tokens/icon-effects.css";
import "@aviala-design/tokens/list-effects.css";
import "@aviala-design/tokens/navigation-effects.css";
import "@aviala-design/tokens/tab-effects.css";
import "@aviala-design/tokens/feedback-effects.css";
import "@aviala-design/tokens/alert-effects.css";
import "@aviala-design/tokens/datepicker-effects.css";
import "@aviala-design/tokens/badge-effects.css";
import "@aviala-design/tokens/progress-effects.css";
import "@aviala-design/tokens/layout-effects.css";
import "@aviala-design/tokens/information-display-extras.css";
import "@aviala-design/tokens/information-collect-extras.css";
import "@aviala-design/tokens/structure-navigation-extras.css";

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
