import previous from "./2.0.0";
import type { ComponentDocRevision } from "../types";

/** Scaffolded from 2.0.0 + component changelog. Review before marking ready. */
const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.0.0",
  prose: previous.prose + " 3.0.0：未传 `children` / `primary` / `secondary` / `tertiary` 时不再回填 `Text` 占位文案，改为不渲染任何文本行。",
};

export default revision;
