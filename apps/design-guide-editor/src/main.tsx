import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@aviala-design/spiral";
import { App } from "./App";
import "@aviala-design/tokens/styles.css";
import "./styles.css";
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
import "../../spiral-docs/src/styles/monaco-spiral.css";

const root = document.getElementById("design-guide-editor-root");

if (root) {
  createRoot(root).render(
    <StrictMode>
      <ThemeProvider
        defaultMode="light"
        defaultPresetId="ald"
        defaultPrimary="#FF5532"
        storageKey="design-guide-editor-theme"
      >
        <App />
      </ThemeProvider>
    </StrictMode>,
  );
}
