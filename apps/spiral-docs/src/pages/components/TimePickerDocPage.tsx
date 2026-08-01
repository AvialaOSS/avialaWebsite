import { useState } from "react";
import {
  FormField,
  TimePicker,
  TimePickerContent,
  TimePickerField,
  TimePickerPanel,
  TimePickerTrigger,
} from "@aviala-design/spiral";
import { ComponentDocView } from "../../components/ComponentDocView";
import { DemoBlock } from "../../components/DemoBlock";
import {
  buildTimePickerCode,
  timePickerCompoundCode,
  timePickerKnobs,
  timePickerLiveCode,
  timePickerWithFormFieldCode,
} from "../../demos/component-demos";

const timePickerScope = {
  TimePicker,
  TimePickerTrigger,
  TimePickerContent,
  TimePickerPanel,
  TimePickerField,
  FormField,
  useState,
};

export function TimePickerDocPage() {
  return (
    <ComponentDocView
      component="TimePickerField"
      scope={timePickerScope}
      fallback={{
        title: "TimePicker 时间选择",
        description: "Figma Information Collect → TimePicker。仅选择小时与分钟，采用滚轮交互。",
        prose:
          "提供 TimePickerField 便捷封装，也可使用 TimePicker + Trigger + Content 组合式 API。分钟步长为 5 分钟。时/分滚轮支持拖拽、鼠标滚轮与触摸滚动；松手或滚轮停止后会吸附到最近选项并居中高亮。",
        propsKey: "TimePickerField",
        liveCode: timePickerLiveCode,
        knobs: timePickerKnobs,
        buildCode: buildTimePickerCode,
      }}
    >
      <DemoBlock
        title="表单字段"
        initialCode={timePickerWithFormFieldCode}
        scope={timePickerScope}
      />
      <DemoBlock title="组合式 API" initialCode={timePickerCompoundCode} scope={timePickerScope} />
    </ComponentDocView>
  );
}
