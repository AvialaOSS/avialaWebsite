import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@aviala-design/spiral";
import { App } from "./App";
import "./styles.css";

const root = document.getElementById("colorcat-root");

if (root) {
  createRoot(root).render(
    <StrictMode>
      <ThemeProvider
        defaultMode="light"
        defaultPresetId="ald"
        defaultPrimary="#FF5532"
        storageKey="colorcat-ald-theme"
      >
        <App />
      </ThemeProvider>
    </StrictMode>,
  );
}
