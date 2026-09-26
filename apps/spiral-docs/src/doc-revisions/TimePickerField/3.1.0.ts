import previous from "./3.0.0";
import type { ComponentDocRevision } from "../types";
import { defaultKnobValues } from "../../components/DemoKnobs";
import {
  timePickerKnobs,
  buildTimePickerCode,
} from "../../demos/component-demos";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  liveCode: buildTimePickerCode(defaultKnobValues(timePickerKnobs)).replace(
    "<TimePickerField",
    "<TimePickerField showSeconds",
  ),
  knobs: [
    ...timePickerKnobs,
    {
      kind: "boolean",
      name: "showSeconds",
      label: "showSeconds",
      defaultValue: true,
    },
  ],
  buildCode: (values) =>
    buildTimePickerCode(values).replace(
      "<TimePickerField",
      `<TimePickerField showSeconds={${Boolean(values.showSeconds)}}`,
    ),
  prose:
    "支持受控时间和时分滚轮，showSeconds 可显示秒列，默认仍为时分。开启秒列后使用含秒的时间值。各列支持键盘 Up/Down/Home/End；外层为 group，不使用 application。滚轮边界与触控手感仍待真实设备验收。",
};

export default revision;
