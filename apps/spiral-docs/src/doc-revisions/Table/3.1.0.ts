import previous from "./3.0.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  prose:
    "表格保持连续结构，行距与列距均为 0；table/size/gap 当前未使用。TableHead 支持可选 leftIcon 与 rightIcon。表头、单元格及边框使用组件 Token。",
};

export default revision;
