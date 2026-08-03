import { useState } from "react";
import { DatePickerField } from "@aviala-design/spiral";
import { ComponentDocView } from "../../components/ComponentDocView";
import { DemoBlock } from "../../components/DemoBlock";
import {
  buildDatePickerCode,
  datePickerDateOnlyCode,
  datePickerKnobs,
  datePickerLiveCode,
  datePickerWithTimeCode,
  datePickerWithTimeRangeCode,
} from "../../demos/component-demos";

const datePickerScope = { DatePickerField, useState };

export function DatePickerDocPage() {
  return (
    <ComponentDocView
      component="DatePickerField"
      scope={datePickerScope}
      fallback={{
        title: "DatePicker 日期选择",
        description: "用于选择日期，或一段日期范围。",
        prose:
          "适合预约、筛选时间段、填写生日等与日历相关的录入场景；需要精确到时刻时也可一并选择。",
        propsKey: "DatePickerField",
        liveCode: datePickerLiveCode,
        knobs: datePickerKnobs,
        buildCode: buildDatePickerCode,
      }}
    >
      <DemoBlock
        title="日期与时间（单选）"
        initialCode={datePickerWithTimeCode}
        scope={datePickerScope}
      />
      <DemoBlock
        title="日期与时间（区间）"
        initialCode={datePickerWithTimeRangeCode}
        scope={datePickerScope}
      />
      <DemoBlock title="仅日期" initialCode={datePickerDateOnlyCode} scope={datePickerScope} />
    </ComponentDocView>
  );
}
