/// <reference types="vite/client" />

declare module "turndown-plugin-gfm" {
  import type TurndownService from "turndown";
  export function gfm(service: TurndownService): void;
}

interface ImportMetaEnv {
  readonly VITE_DOCS_BASENAME?: string;
  readonly VITE_DOCS_VERSION?: string;
  readonly VITE_DESIGN_GUIDE_EDITOR_ORIGIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
