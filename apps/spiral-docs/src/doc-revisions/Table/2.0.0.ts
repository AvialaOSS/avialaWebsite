import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  revision: "2.0.0",
  title: "Table 表格",
  description: "用于行列对照地浏览结构化数据，支持行选择与单元格操作区。",
  prose:
    "适合订单、成员、日志等需要多字段对齐比较的数据场景。checkbox 列可做行选择（表头可放全选）；操作列使用 `content=\"action\"` 与 `actions`。",
};

export default revision;
