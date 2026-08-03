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
        description: "用于从多级分类中逐级选出一个结果。",
        prose: "适合地区、类目、组织架构等选项本身有层级关系的选择场景。",
        propsKey: "CascaderField",
        liveCode: cascaderLiveCode,
        knobs: cascaderKnobs,
        buildCode: buildCascaderCode,
      }}
    />
  );
}
