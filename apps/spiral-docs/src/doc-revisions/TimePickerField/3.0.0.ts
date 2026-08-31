import previous from "./2.6.1";
import type { ComponentDocRevision } from "../types";

/** Scaffolded from 2.6.1 + component changelog. Review before marking ready. */
const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.0.0",
  prose: previous.prose + " 3.0.0：时间面板不再使用 `role=\"application\"`，改为 `role=\"group\"`；面板内的时 / 分列仍是可 Tab 到达的 listbox，支持 Up / Down / Home / End。",
};

export default revision;
