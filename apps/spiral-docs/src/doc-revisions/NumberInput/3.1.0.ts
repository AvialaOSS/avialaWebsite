import previous from "./2.0.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  prose:
    "步进操作和输入外观分别消费组件 Token。输入区域沿用共享 BaseInput 的 hover、焦点和禁用层级，保留数值边界及受控值行为。",
};

export default revision;
