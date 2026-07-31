import { GeneralSetting } from "@aviala-design/icons";
import { useState } from "react";
import { CascaderField } from "@aviala-design/spiral";
import { ComponentDocView } from "../../components/ComponentDocView";
import {
  buildCascaderCode,
  cascaderKnobs,
  cascaderLiveCode,
} from "../../demos/component-demos";

export function CascaderDocPage() {
  return (
    <ComponentDocView
      component="CascaderField"
      scope={{ CascaderField, GeneralSetting, useState }}
      fallback={{
        title: "Cascader 级联选择",
        description: "Figma Information Collect → Cascader。用于多级选项选择。",
        prose: "提供 CascaderField 便捷封装，也可使用 Cascader + Trigger + Content 组合式 API。",
        propsKey: "CascaderField",
        liveCode: cascaderLiveCode,
        knobs: cascaderKnobs,
        buildCode: buildCascaderCode,
      }}
    />
  );
}
