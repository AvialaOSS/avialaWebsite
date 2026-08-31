import previous from "./2.6.1";
import type { ComponentDocRevision } from "../types";

/** Scaffolded from 2.6.1 + component changelog. */
const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.0.0",
  prose: previous.prose + " 3.0.0：时间面板不再使�?`role=\"application\"`，改�?`role=\"group\"`；面板内的时 / 分列仍是�?Tab 到达�?listbox，支�?Up / Down / Home / End�?,
};

export default revision;
