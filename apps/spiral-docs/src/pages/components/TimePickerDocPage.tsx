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
        description: "用于选择一天中的具体时刻。",
        prose:
          "适合预约时段、提醒时间等只关心时与分的场景。",
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
