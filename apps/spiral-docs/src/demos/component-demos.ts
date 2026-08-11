import {
  defaultKnobValues,
  getKnobItems,
  type KnobDef,
  type KnobValues,
} from "../components/DemoKnobs";
import { DEFAULT_ICON_NAME, jsxIconProp } from "./demo-icons";

function jsxBool(value: boolean, attr: string) {
  return value ? ` ${attr}` : ` ${attr}={false}`;
}

function jsxString(value: string) {
  return JSON.stringify(value);
}

export const buttonKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "mode",
    label: "mode",
    options: [
      "primary",
      "second",
      "default",
      "defaultCustom",
      "outline",
      "outlineCustom",
      "noBackground",
      "noBackgroundCustom",
      "destructive",
    ],
    defaultValue: "primary",
  },
  {
    kind: "select",
    name: "size",
    label: "size",
    options: ["tiny", "small", "regular", "big"],
    defaultValue: "regular",
  },
  { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
  { kind: "boolean", name: "loading", label: "loading", defaultValue: false },
  { kind: "boolean", name: "allRound", label: "allRound", defaultValue: false },
  { kind: "boolean", name: "compact", label: "compact", defaultValue: false },
  { kind: "boolean", name: "iconOnly", label: "iconOnly", defaultValue: false },
  { kind: "boolean", name: "showLeftIcon", label: "leftIcon 显示", defaultValue: true },
  {
    kind: "icon",
    name: "leftIcon",
    label: "leftIcon",
    defaultValue: DEFAULT_ICON_NAME,
  },
  { kind: "boolean", name: "showRightIcon", label: "rightIcon 显示", defaultValue: false },
  {
    kind: "icon",
    name: "rightIcon",
    label: "rightIcon",
    defaultValue: DEFAULT_ICON_NAME,
  },
  { kind: "string", name: "label", label: "children", defaultValue: "Primary", placeholder: "按钮文字" },
];

export function buildButtonCode(values: KnobValues): string {
  const mode = String(values.mode ?? "primary");
  const size = String(values.size ?? "regular");
  const label = String(values.label ?? "Primary");
  const disabled = Boolean(values.disabled);
  const loading = Boolean(values.loading);
  const allRound = Boolean(values.allRound);
  const compact = Boolean(values.compact);
  const iconOnly = Boolean(values.iconOnly);
  const showLeftIcon = Boolean(values.showLeftIcon);
  const showRightIcon = Boolean(values.showRightIcon);
  const leftIcon = String(values.leftIcon ?? DEFAULT_ICON_NAME);
  const rightIcon = String(values.rightIcon ?? DEFAULT_ICON_NAME);

  const leftIconProp = jsxIconProp(iconOnly || showLeftIcon, leftIcon, "leftIcon");
  const rightIconProp = iconOnly ? "" : jsxIconProp(showRightIcon, rightIcon, "rightIcon");
  const iconOnlyProp = iconOnly ? jsxBool(true, "iconOnly") : "";
  const ariaLabelProp = iconOnly ? `\n    aria-label=${JSON.stringify(label || "Button")}` : "";
  const childrenBlock = iconOnly ? "" : `\n    ${jsxString(label)}\n  `;

  return `render(
  <Button
    mode=${JSON.stringify(mode)}
    size=${JSON.stringify(size)}${jsxBool(disabled, "disabled")}${jsxBool(loading, "loading")}${jsxBool(allRound, "allRound")}${jsxBool(compact, "compact")}${iconOnlyProp}${leftIconProp}${rightIconProp}${ariaLabelProp}
  >${childrenBlock}</Button>
);`;
}

export const buttonLiveCode = buildButtonCode(
  Object.fromEntries(buttonKnobs.map((k) => [k.name, k.kind === "boolean" ? k.defaultValue : k.defaultValue]))
);

export const inputKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "size",
    label: "size",
    options: ["regular", "big"],
    defaultValue: "regular",
  },
  { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
  {
    kind: "string",
    name: "placeholder",
    label: "placeholder",
    defaultValue: "请输入内容",
    placeholder: "占位符",
  },
  {
    kind: "string",
    name: "defaultValue",
    label: "defaultValue",
    defaultValue: "",
    placeholder: "默认值（可选）",
  },
  { kind: "boolean", name: "showLeftIcon", label: "leftIcon 显示", defaultValue: true },
  {
    kind: "icon",
    name: "leftIcon",
    label: "leftIcon",
    defaultValue: "GeneralSearch",
  },
  { kind: "boolean", name: "showRightIcon", label: "rightIcon 显示", defaultValue: false },
  {
    kind: "icon",
    name: "rightIcon",
    label: "rightIcon",
    defaultValue: DEFAULT_ICON_NAME,
  },
];

export function buildInputCode(values: KnobValues): string {
  const size = String(values.size ?? "regular");
  const placeholder = String(values.placeholder ?? "");
  const defaultValue = String(values.defaultValue ?? "");
  const disabled = Boolean(values.disabled);
  const showLeftIcon = Boolean(values.showLeftIcon);
  const showRightIcon = Boolean(values.showRightIcon);
  const leftIcon = String(values.leftIcon ?? "GeneralSearch");
  const rightIcon = String(values.rightIcon ?? "GeneralSetting");

  const defaultValueAttr = defaultValue ? `\n    defaultValue=${JSON.stringify(defaultValue)}` : "";
  const leftIconProp = jsxIconProp(showLeftIcon, leftIcon, "leftIcon");
  const rightIconProp = jsxIconProp(showRightIcon, rightIcon, "rightIcon");

  return `render(
  <Input
    size=${JSON.stringify(size)}
    placeholder=${JSON.stringify(placeholder)}${defaultValueAttr}${jsxBool(disabled, "disabled")}${leftIconProp}${rightIconProp}
    className="max-w-sm"
  />
);`;
}

export const inputLiveCode = buildInputCode(
  Object.fromEntries(inputKnobs.map((k) => [k.name, k.kind === "boolean" ? k.defaultValue : k.defaultValue]))
);

export const segmentatorKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "mode",
    label: "mode",
    options: ["nested", "tiled"],
    defaultValue: "nested",
  },
  {
    kind: "select",
    name: "direction",
    label: "direction",
    options: ["horizontal", "vertical"],
    defaultValue: "horizontal",
  },
  { kind: "boolean", name: "allRound", label: "allRound", defaultValue: false },
  { kind: "boolean", name: "equalWidth", label: "equalWidth", defaultValue: false },
  { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
];

export const segmentatorLiveCode = `function Demo() {
  const [value, setValue] = useState("a");
  return (
    <SegmentatorGroup value={value} onValueChange={setValue} mode="nested">
      <SegmentatorItem value="a">选项 A</SegmentatorItem>
      <SegmentatorItem value="b">选项 B</SegmentatorItem>
      <SegmentatorItem value="c">选项 C</SegmentatorItem>
    </SegmentatorGroup>
  );
}

render(<Demo />);`;

export function buildSegmentatorCode(values: KnobValues): string {
  const mode = String(values.mode ?? "nested");
  const direction = String(values.direction ?? "horizontal");
  const allRound = Boolean(values.allRound);
  const equalWidth = Boolean(values.equalWidth);
  const disabled = Boolean(values.disabled);
  const widthClass = equalWidth
    ? direction === "vertical"
      ? `\n      className="h-48"`
      : `\n      className="w-full max-w-md"`
    : "";
  const directionProp =
    direction === "vertical" ? `\n      direction="vertical"` : "";

  return `function Demo() {
  const [value, setValue] = useState("a");
  return (
    <SegmentatorGroup
      value={value}
      onValueChange={setValue}
      mode=${JSON.stringify(mode)}${directionProp}${jsxBool(allRound, "allRound")}${jsxBool(equalWidth, "equalWidth")}${jsxBool(disabled, "disabled")}${widthClass}
    >
      <SegmentatorItem value="a">选项 A</SegmentatorItem>
      <SegmentatorItem value="b">选项 B</SegmentatorItem>
      <SegmentatorItem value="c">选项 C</SegmentatorItem>
    </SegmentatorGroup>
  );
}

render(<Demo />);`;
}

export const selectLiveCode = `render(
  <Select defaultValue="a">
    <SelectTrigger className="w-[200px]">
      <SelectValue placeholder="请选择" />
    </SelectTrigger>
    <SelectContent>
      <SelectItemGroup label="选项">
        <SelectItem value="a" itemFunction="radio">选项 A</SelectItem>
        <SelectItem value="b" itemFunction="radio">选项 B</SelectItem>
        <SelectItem value="c" itemFunction="radio">选项 C</SelectItem>
      </SelectItemGroup>
    </SelectContent>
  </Select>
);`;

export const selectKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "defaultValue",
    label: "defaultValue",
    options: ["a", "b", "c"],
    defaultValue: "a",
  },
  {
    kind: "string",
    name: "placeholder",
    label: "placeholder",
    defaultValue: "请选择",
  },
];

export function buildSelectCode(values: KnobValues): string {
  const defaultValue = String(values.defaultValue ?? "a");
  const placeholder = String(values.placeholder ?? "请选择");

  return `render(
  <Select defaultValue=${JSON.stringify(defaultValue)}>
    <SelectTrigger className="w-[200px]">
      <SelectValue placeholder=${JSON.stringify(placeholder)} />
    </SelectTrigger>
    <SelectContent>
      <SelectItemGroup label="选项">
        <SelectItem value="a" itemFunction="radio">选项 A</SelectItem>
        <SelectItem value="b" itemFunction="radio">选项 B</SelectItem>
        <SelectItem value="c" itemFunction="radio">选项 C</SelectItem>
      </SelectItemGroup>
    </SelectContent>
  </Select>
);`;
}

export const alertKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "type",
    label: "type",
    options: ["info", "warning", "error", "success", "neutral"],
    defaultValue: "info",
  },
  {
    kind: "select",
    name: "size",
    label: "size",
    options: ["default", "small"],
    defaultValue: "default",
  },
  {
    kind: "select",
    name: "appearance",
    label: "appearance",
    options: ["default", "light"],
    defaultValue: "default",
  },
  { kind: "boolean", name: "dismissible", label: "dismissible", defaultValue: true },
  { kind: "boolean", name: "showActions", label: "showActions", defaultValue: false },
  {
    kind: "string",
    name: "title",
    label: "title",
    defaultValue: "Information",
    placeholder: "标题",
  },
  {
    kind: "string",
    name: "description",
    label: "description",
    defaultValue: "Supporting details for this alert message.",
    placeholder: "描述",
  },
];

export function buildAlertCode(values: KnobValues): string {
  const type = String(values.type ?? "info");
  const size = String(values.size ?? "default");
  const appearance = String(values.appearance ?? "default");
  const title = String(values.title ?? "Information");
  const description = String(values.description ?? "");
  const dismissible = Boolean(values.dismissible);
  const showActions = Boolean(values.showActions);

  const descriptionProp =
    size === "default" && description
      ? `\n    description=${JSON.stringify(description)}`
      : "";

  const actionsBlock = showActions
    ? `\n    showActions\n    action="Confirm"\n    secondaryAction="Cancel"`
    : "";

  return `render(
  <Alert
    type=${JSON.stringify(type)}
    size=${JSON.stringify(size)}
    appearance=${JSON.stringify(appearance)}${jsxBool(dismissible, "dismissible")}${descriptionProp}${actionsBlock}
    title=${JSON.stringify(title)}
  />
);`;
}

export const alertLiveCode = buildAlertCode(
  Object.fromEntries(alertKnobs.map((k) => [k.name, k.defaultValue]))
);

export const feedbackKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "type",
    label: "type",
    options: ["information", "warning", "wrong", "success", "normal"],
    defaultValue: "information",
  },
  {
    kind: "select",
    name: "size",
    label: "size",
    options: ["default", "small"],
    defaultValue: "default",
  },
  {
    kind: "select",
    name: "mode",
    label: "mode",
    options: ["default", "primary"],
    defaultValue: "default",
  },
  { kind: "boolean", name: "showClose", label: "showClose", defaultValue: true },
  {
    kind: "string",
    name: "title",
    label: "title",
    defaultValue: "Information",
    placeholder: "标题",
  },
  {
    kind: "string",
    name: "description",
    label: "description",
    defaultValue: "Supporting details for this message.",
    placeholder: "描述",
  },
];

export function buildFeedbackCode(values: KnobValues): string {
  const type = String(values.type ?? "information");
  const size = String(values.size ?? "default");
  const mode = String(values.mode ?? "default");
  const title = String(values.title ?? "Information");
  const description = String(values.description ?? "");
  const showClose = Boolean(values.showClose);

  const descriptionProp =
    size === "default" && description
      ? `\n    description=${JSON.stringify(description)}`
      : "";

  return `render(
  <Feedback
    type=${JSON.stringify(type)}
    size=${JSON.stringify(size)}
    mode=${JSON.stringify(mode)}${jsxBool(showClose, "showClose")}${descriptionProp}
    title=${JSON.stringify(title)}
  />
);`;
}

export const feedbackLiveCode = buildFeedbackCode(
  Object.fromEntries(feedbackKnobs.map((k) => [k.name, k.defaultValue]))
);

export const datePickerKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "mode",
    label: "mode",
    options: ["single", "range"],
    defaultValue: "single",
  },
  {
    kind: "select",
    name: "size",
    label: "size",
    options: ["regular", "big"],
    defaultValue: "regular",
  },
  { kind: "boolean", name: "enableTime", label: "enableTime", defaultValue: true },
  { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
  { kind: "boolean", name: "error", label: "error", defaultValue: false },
  { kind: "boolean", name: "allRound", label: "allRound", defaultValue: false },
  {
    kind: "string",
    name: "placeholder",
    label: "placeholder",
    defaultValue: "Select date",
    placeholder: "占位符",
  },
];

export function buildDatePickerCode(values: KnobValues): string {
  const mode = String(values.mode ?? "single");
  const size = String(values.size ?? "regular");
  const placeholder = String(values.placeholder ?? "Select date");
  const enableTime = Boolean(values.enableTime ?? true);
  const disabled = Boolean(values.disabled);
  const error = Boolean(values.error);
  const allRound = Boolean(values.allRound);
  const width = mode === "range" ? "320px" : "290px";

  return `function Demo() {
  const [value, setValue] = useState(${mode === "range" ? "{}" : "undefined"});
  return (
    <DatePickerField
      mode=${JSON.stringify(mode)}
      size=${JSON.stringify(size)}${enableTime ? "" : " enableTime={false}"}
      placeholder=${JSON.stringify(placeholder)}${jsxBool(disabled, "disabled")}${jsxBool(error, "error")}${jsxBool(allRound, "allRound")}
      value={value}
      onValueChange={setValue}
      className="w-[${width}]"
    />
  );
}

render(<Demo />);`;
}

export const datePickerLiveCode = buildDatePickerCode(
  Object.fromEntries(datePickerKnobs.map((k) => [k.name, k.defaultValue]))
);

export const switchKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "size",
    label: "size",
    options: ["regular", "small"],
    defaultValue: "regular",
  },
  { kind: "boolean", name: "defaultChecked", label: "defaultChecked", defaultValue: true },
  { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
];

export function buildSwitchCode(values: KnobValues): string {
  const size = String(values.size ?? "regular");
  const defaultChecked = Boolean(values.defaultChecked);
  const disabled = Boolean(values.disabled);

  return `render(
  <Switch
    size=${JSON.stringify(size)}${jsxBool(defaultChecked, "defaultChecked")}${jsxBool(disabled, "disabled")}
  />
);`;
}

export const switchLiveCode = buildSwitchCode(
  Object.fromEntries(switchKnobs.map((k) => [k.name, k.defaultValue]))
);

export const linkKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "level",
    label: "level",
    options: ["caption", "text"],
    defaultValue: "text",
  },
  {
    kind: "select",
    name: "mode",
    label: "mode",
    options: ["noBackground", "noBackgroundCustom"],
    defaultValue: "noBackground",
  },
  { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
  {
    kind: "string",
    name: "label",
    label: "children",
    defaultValue: "Text",
    placeholder: "链接文字",
  },
];

export function buildLinkCode(values: KnobValues): string {
  const level = String(values.level ?? "text");
  const mode = String(values.mode ?? "noBackground");
  const label = String(values.label ?? "Text");
  const disabled = Boolean(values.disabled);

  return `render(
  <Link
    href="#"
    level=${JSON.stringify(level)}
    mode=${JSON.stringify(mode)}${jsxBool(disabled, "disabled")}
    leftIcon={<GeneralSetting aria-hidden />}
    rightIcon={<GeneralSetting aria-hidden />}
  >
    ${jsxString(label)}
  </Link>
);`;
}

export const linkLiveCode = buildLinkCode(
  Object.fromEntries(linkKnobs.map((k) => [k.name, k.defaultValue]))
);

export const textareaKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "size",
    label: "size",
    options: ["regular", "big"],
    defaultValue: "regular",
  },
  { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
  { kind: "boolean", name: "error", label: "error", defaultValue: false },
  {
    kind: "string",
    name: "placeholder",
    label: "placeholder",
    defaultValue: "Text",
    placeholder: "占位符",
  },
];

export function buildTextareaCode(values: KnobValues): string {
  const size = String(values.size ?? "regular");
  const placeholder = String(values.placeholder ?? "Text");
  const disabled = Boolean(values.disabled);
  const error = Boolean(values.error);

  return `render(
  <Textarea
    size=${JSON.stringify(size)}
    placeholder=${JSON.stringify(placeholder)}
    maxLength={200}${jsxBool(disabled, "disabled")}${jsxBool(error, "error")}
    leftIcon={<GeneralSetting aria-hidden />}
    rightIcon={<GeneralSetting aria-hidden />}
    className="max-w-sm"
  />
);`;
}

export const textareaLiveCode = buildTextareaCode(
  Object.fromEntries(textareaKnobs.map((k) => [k.name, k.defaultValue]))
);

export const numberInputKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "size",
    label: "size",
    options: ["regular", "big"],
    defaultValue: "regular",
  },
  {
    kind: "select",
    name: "inputStyle",
    label: "inputStyle",
    options: ["default", "monospaced"],
    defaultValue: "default",
  },
  { kind: "boolean", name: "allRound", label: "allRound", defaultValue: false },
  { kind: "boolean", name: "showControls", label: "showControls", defaultValue: true },
  { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
  { kind: "boolean", name: "error", label: "error", defaultValue: false },
  {
    kind: "string",
    name: "defaultValue",
    label: "defaultValue",
    defaultValue: "12",
    placeholder: "默认值",
  },
  {
    kind: "string",
    name: "step",
    label: "step",
    defaultValue: "1",
    placeholder: "步长",
  },
  {
    kind: "string",
    name: "min",
    label: "min",
    defaultValue: "0",
    placeholder: "最小值（可空）",
  },
  {
    kind: "string",
    name: "max",
    label: "max",
    defaultValue: "100",
    placeholder: "最大值（可空）",
  },
  {
    kind: "string",
    name: "placeholder",
    label: "placeholder",
    defaultValue: "0",
    placeholder: "占位符",
  },
];

export function buildNumberInputCode(values: KnobValues): string {
  const size = String(values.size ?? "regular");
  const inputStyle = String(values.inputStyle ?? "default");
  const placeholder = String(values.placeholder ?? "0");
  const defaultValue = String(values.defaultValue ?? "12");
  const stepRaw = String(values.step ?? "1").trim();
  const minRaw = String(values.min ?? "").trim();
  const maxRaw = String(values.max ?? "").trim();
  const allRound = Boolean(values.allRound);
  const showControls = Boolean(values.showControls);
  const disabled = Boolean(values.disabled);
  const error = Boolean(values.error);

  const stepAttr = stepRaw ? `\n    step={${Number(stepRaw) || 1}}` : "";
  const minAttr = minRaw !== "" && Number.isFinite(Number(minRaw)) ? `\n    min={${Number(minRaw)}}` : "";
  const maxAttr = maxRaw !== "" && Number.isFinite(Number(maxRaw)) ? `\n    max={${Number(maxRaw)}}` : "";
  const defaultValueAttr =
    defaultValue !== ""
      ? `\n    defaultValue={${Number.isFinite(Number(defaultValue)) ? Number(defaultValue) : JSON.stringify(defaultValue)}}`
      : "";

  return `render(
  <NumberInput
    size=${JSON.stringify(size)}
    inputStyle=${JSON.stringify(inputStyle)}
    placeholder=${JSON.stringify(placeholder)}${defaultValueAttr}${stepAttr}${minAttr}${maxAttr}${jsxBool(allRound, "allRound")}${jsxBool(showControls, "showControls")}${jsxBool(disabled, "disabled")}${jsxBool(error, "error")}
    className="max-w-sm"
  />
);`;
}

export const numberInputLiveCode = buildNumberInputCode(
  Object.fromEntries(numberInputKnobs.map((k) => [k.name, k.defaultValue]))
);

export const checkboxKnobs: KnobDef[] = [
  { kind: "boolean", name: "defaultChecked", label: "defaultChecked", defaultValue: true },
  {
    kind: "select",
    name: "size",
    label: "size",
    options: ["default", "huge"],
    defaultValue: "default",
  },
  { kind: "boolean", name: "round", label: "round", defaultValue: false },
  { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
];

export function buildCheckboxCode(values: KnobValues): string {
  const defaultChecked = Boolean(values.defaultChecked);
  const size = String(values.size ?? "default");
  const round = Boolean(values.round);
  const disabled = Boolean(values.disabled);
  const sizeAttr = size === "default" ? "" : ` size=${jsxString(size)}`;

  return `render(
  <div className="flex items-center gap-3">
    <Checkbox
      id="demo-checkbox"${jsxBool(defaultChecked, "defaultChecked")}${sizeAttr}${jsxBool(round, "round")}${jsxBool(disabled, "disabled")}
    />
    <label htmlFor="demo-checkbox">Checkbox label</label>
  </div>
);`;
}

export const checkboxLiveCode = buildCheckboxCode(
  Object.fromEntries(checkboxKnobs.map((k) => [k.name, k.defaultValue]))
);

export const radioKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "direction",
    label: "direction",
    options: ["vertical", "horizontal"],
    defaultValue: "vertical",
  },
  {
    kind: "select",
    name: "variant",
    label: "variant",
    options: ["default", "card"],
    defaultValue: "default",
  },
];

export function buildRadioCode(values: KnobValues): string {
  const direction = String(values.direction ?? "vertical");
  const variant = String(values.variant ?? "default");
  const variantAttr = variant === "card" ? ' variant="card"' : "";

  return `render(
  <RadioGroup defaultValue="a" direction=${JSON.stringify(direction)} className="w-[200px]">
    <RadioInput value="a" id="radio-a" title="Text" description="Text"${variantAttr} />
    <RadioInput value="b" id="radio-b" title="Text" description="Text"${variantAttr} />
  </RadioGroup>
);`;
}

export const radioLiveCode = buildRadioCode(
  Object.fromEntries(radioKnobs.map((k) => [k.name, k.defaultValue]))
);

export const cascaderKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "size",
    label: "size",
    options: ["regular", "big"],
    defaultValue: "regular",
  },
  { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
  { kind: "boolean", name: "error", label: "error", defaultValue: false },
  { kind: "boolean", name: "allRound", label: "allRound", defaultValue: false },
  {
    kind: "string",
    name: "placeholder",
    label: "placeholder",
    defaultValue: "Text",
    placeholder: "占位符",
  },
];

export function buildCascaderCode(values: KnobValues): string {
  const size = String(values.size ?? "regular");
  const placeholder = String(values.placeholder ?? "Text");
  const disabled = Boolean(values.disabled);
  const error = Boolean(values.error);
  const allRound = Boolean(values.allRound);

  return `const regionOptions = [
  {
    value: "china",
    label: "China",
    children: [
      {
        value: "hainan",
        label: "Hainan",
        children: [
          { value: "haikou", label: "Haikou" },
          { value: "sanya", label: "Sanya" },
        ],
      },
    ],
  },
];

function Demo() {
  const [value, setValue] = useState(["china", "hainan", "haikou"]);
  return (
    <CascaderField
      options={regionOptions}
      value={value}
      onValueChange={setValue}
      size=${JSON.stringify(size)}
      placeholder=${JSON.stringify(placeholder)}${jsxBool(disabled, "disabled")}${jsxBool(error, "error")}${jsxBool(allRound, "allRound")}
      leftIcon={<GeneralSetting aria-hidden />}
      rightIcon={<GeneralSetting aria-hidden />}
      className="w-[290px]"
    />
  );
}

render(<Demo />);`;
}

export const cascaderLiveCode = buildCascaderCode(
  Object.fromEntries(cascaderKnobs.map((k) => [k.name, k.defaultValue]))
);

export const colorPickerKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "size",
    label: "size",
    options: ["regular", "big"],
    defaultValue: "regular",
  },
  { kind: "boolean", name: "allRound", label: "allRound", defaultValue: false },
  { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
];

export function buildColorPickerCode(values: KnobValues): string {
  const size = String(values.size ?? "regular");
  const allRound = Boolean(values.allRound);
  const disabled = Boolean(values.disabled);

  return `function Demo() {
  const [color, setColor] = useState("#165DFF");
  return (
    <ColorPicker value={color} onChange={setColor} disabled={${disabled}}>
      <ColorPickerTrigger
        size=${JSON.stringify(size)}${jsxBool(allRound, "allRound")}
        className="w-[120px]"
      />
      <ColorPickerContent />
    </ColorPicker>
  );
}

render(<Demo />);`;
}

export const colorPickerLiveCode = buildColorPickerCode(
  Object.fromEntries(colorPickerKnobs.map((k) => [k.name, k.defaultValue]))
);

export const listKnobs: KnobDef[] = [
  {
    kind: "string",
    name: "title",
    label: "title",
    defaultValue: "Text",
    placeholder: "列表标题",
  },
  {
    kind: "items",
    name: "items",
    label: "items",
    itemLabel: "ListItem",
    min: 1,
    max: 8,
    fields: [
      {
        kind: "string",
        name: "title",
        label: "title",
        defaultValue: "Text",
        placeholder: "行标题",
      },
      {
        kind: "select",
        name: "type",
        label: "itemType",
        options: ["action", "switch", "select"],
        defaultValue: "action",
      },
    ],
    defaultValue: [
      { title: "Text", type: "select" },
      { title: "Text", type: "select" },
      { title: "Text", type: "action" },
    ],
  },
];

export function buildListCode(values: KnobValues): string {
  const title = String(values.title ?? "Text");
  const items = getKnobItems(values, "items", [
    { title: "Text", type: "select" },
    { title: "Text", type: "select" },
    { title: "Text", type: "action" },
  ]);

  const rows = items
    .map((item) => {
      const rowTitle = String(item.title ?? "Text");
      const type = String(item.type ?? "action");
      if (type === "select") {
        return `    <ListItem itemType="select" leading="shaped" title=${JSON.stringify(rowTitle)} subtitle="Text" select={<DemoSelect />} />`;
      }
      if (type === "switch") {
        return `    <ListItem itemType="switch" leading="shaped" title=${JSON.stringify(rowTitle)} subtitle="Text" switchProps={{ defaultChecked: true }} />`;
      }
      return `    <ListItem itemType="action" leading="shaped" title=${JSON.stringify(rowTitle)} subtitle="Text" />`;
    })
    .join("\n");

  return `function DemoSelect() {
  return (
    <Select defaultValue="a">
      <SelectTrigger
        size="regular"
        placeholder="Text"
        leftIcon={<GeneralSetting aria-hidden />}
        className="w-full"
      />
      <SelectContent portalled={false}>
        <SelectItemGroup>
          <SelectItem value="a">Option A</SelectItem>
          <SelectItem value="b">Option B</SelectItem>
        </SelectItemGroup>
      </SelectContent>
    </Select>
  );
}

render(
  <List title=${JSON.stringify(title)} className="w-[387px]">
${rows}
  </List>
);`;
}

export const listLiveCode = buildListCode(defaultKnobValues(listKnobs));

export const typographyKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "level",
    label: "level",
    options: ["display", "headline1", "headline2", "title", "subtitle", "text", "caption"],
    defaultValue: "text",
  },
  {
    kind: "select",
    name: "content",
    label: "content",
    options: ["text", "number"],
    defaultValue: "text",
  },
  {
    kind: "select",
    name: "tone",
    label: "tone",
    options: ["default", "white"],
    defaultValue: "default",
  },
  {
    kind: "string",
    name: "label",
    label: "children",
    defaultValue: "Text",
    placeholder: "文字内容",
  },
];

export function buildTypographyCode(values: KnobValues): string {
  const level = String(values.level ?? "text");
  const content = String(values.content ?? "text");
  const tone = String(values.tone ?? "default");
  const label = String(values.label ?? "Text");

  return `render(
  <Typography level=${JSON.stringify(level)} content=${JSON.stringify(content)} tone=${JSON.stringify(tone)}>
    ${jsxString(label)}
  </Typography>
);`;
}

export const typographyLiveCode = buildTypographyCode(
  Object.fromEntries(typographyKnobs.map((k) => [k.name, k.defaultValue]))
);

export const typefaceKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "content",
    label: "content",
    options: [
      "allCustom",
      "textCaption",
      "textCaptionSubtitle",
      "textTitle",
      "textHeadline2",
      "textHeadline1",
    ],
    defaultValue: "textCaption",
  },
  {
    kind: "string",
    name: "primary",
    label: "primary",
    defaultValue: "Primary line",
    placeholder: "主文字",
  },
  {
    kind: "string",
    name: "secondary",
    label: "secondary",
    defaultValue: "Caption line",
    placeholder: "副文字",
  },
];

export function buildTypefaceCode(values: KnobValues): string {
  const content = String(values.content ?? "textCaption");
  const primary = String(values.primary ?? "Primary line");
  const secondary = String(values.secondary ?? "Caption line");

  return `render(
  <Typeface
    content=${JSON.stringify(content)}
    primary=${JSON.stringify(primary)}
    secondary=${JSON.stringify(secondary)}
  />
);`;
}

export const typefaceLiveCode = buildTypefaceCode(
  Object.fromEntries(typefaceKnobs.map((k) => [k.name, k.defaultValue]))
);

export const formFieldKnobs: KnobDef[] = [
  {
    kind: "string",
    name: "label",
    label: "label",
    defaultValue: "Username",
    placeholder: "字段标签",
  },
  {
    kind: "string",
    name: "description",
    label: "description",
    defaultValue: "Your public display name.",
    placeholder: "描述文字",
  },
  {
    kind: "string",
    name: "placeholder",
    label: "input placeholder",
    defaultValue: "aviala",
    placeholder: "输入框占位符",
  },
];

export function buildFormFieldCode(values: KnobValues): string {
  const label = String(values.label ?? "Username");
  const description = String(values.description ?? "");
  const placeholder = String(values.placeholder ?? "aviala");
  const descriptionProp = description ? `\n    description=${JSON.stringify(description)}` : "";

  return `render(
  <FormField label=${JSON.stringify(label)}${descriptionProp} className="max-w-sm">
    <Input placeholder=${JSON.stringify(placeholder)} />
  </FormField>
);`;
}

export const formFieldLiveCode = buildFormFieldCode(
  Object.fromEntries(formFieldKnobs.map((k) => [k.name, k.defaultValue]))
);

export const anchorKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "activeItem",
    label: "activeItem",
    options: ["Getting started", "Installation", "Quick start"],
    defaultValue: "Getting started",
  },
];

export function buildAnchorCode(values: KnobValues): string {
  const activeItem = String(values.activeItem ?? "Getting started");

  return `render(
  <Anchor aria-label="Page sections" className="w-[200px]">
    <AnchorItem href="#" indentLevel={0} activated={${activeItem === "Getting started"}}>
      Getting started
    </AnchorItem>
    <AnchorItem href="#" indentLevel={0} activated={${activeItem === "Installation"}}>
      Installation
    </AnchorItem>
    <AnchorItem href="#" indentLevel={1} activated={${activeItem === "Quick start"}}>
      Quick start
    </AnchorItem>
    <AnchorItem href="#" indentLevel={2}>
      Configuration
    </AnchorItem>
  </Anchor>
);`;
}

export const anchorLiveCode = buildAnchorCode(
  Object.fromEntries(anchorKnobs.map((k) => [k.name, k.defaultValue]))
);

export const popoverKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "side",
    label: "side",
    options: ["top", "right", "bottom", "left"],
    defaultValue: "bottom",
  },
  {
    kind: "select",
    name: "appearance",
    label: "appearance",
    options: ["default", "tooltip", "primary"],
    defaultValue: "default",
  },
  {
    kind: "select",
    name: "level",
    label: "level",
    options: ["caption", "text"],
    defaultValue: "text",
  },
  { kind: "boolean", name: "showArrow", label: "showArrow", defaultValue: false },
  { kind: "boolean", name: "flush", label: "flush", defaultValue: false },
];

export function buildPopoverCode(values: KnobValues): string {
  const side = String(values.side ?? "bottom");
  const appearance = String(values.appearance ?? "default");
  const level = String(values.level ?? "text");
  const showArrow = Boolean(values.showArrow);
  const flush = Boolean(values.flush);
  const appearanceProp =
    appearance === "default" ? "" : `\n      appearance=${JSON.stringify(appearance)}`;
  const levelProp =
    (appearance === "tooltip" && level === "caption") ||
    (appearance !== "tooltip" && level === "text")
      ? ""
      : `\n      level=${JSON.stringify(level)}`;

  return `render(
  <Popover>
    <PopoverTrigger asChild>
      <Button mode="default">Open popover</Button>
    </PopoverTrigger>
    <PopoverContent side=${JSON.stringify(side)}${appearanceProp}${levelProp}${jsxBool(showArrow, "showArrow")}${jsxBool(flush, "flush")}>
      Popover content with ${level} typography.
    </PopoverContent>
  </Popover>
);`;
}

export const popoverLiveCode = buildPopoverCode(
  Object.fromEntries(popoverKnobs.map((k) => [k.name, k.defaultValue]))
);

export const hoverPopoverKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "side",
    label: "side",
    options: ["top", "right", "bottom", "left"],
    defaultValue: "top",
  },
  { kind: "boolean", name: "showArrow", label: "showArrow", defaultValue: true },
];

export function buildHoverPopoverCode(values: KnobValues): string {
  const side = String(values.side ?? "top");
  const showArrow = Boolean(values.showArrow);

  return `render(
  <HoverPopover
    side=${JSON.stringify(side)}${jsxBool(showArrow, "showArrow")}
    content={<Typography level="text">Rich preview content</Typography>}
  >
    <Button mode="default">Hover or focus</Button>
  </HoverPopover>
);`;
}

export const hoverPopoverLiveCode = buildHoverPopoverCode(
  Object.fromEntries(hoverPopoverKnobs.map((k) => [k.name, k.defaultValue]))
);

export const modalKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "size",
    label: "size",
    options: ["default", "large"],
    defaultValue: "default",
  },
  { kind: "boolean", name: "showIcon", label: "showIcon", defaultValue: true },
  { kind: "boolean", name: "showFooter", label: "showFooter", defaultValue: true },
];

export function buildModalCode(values: KnobValues): string {
  const size = String(values.size ?? "default");
  const showIcon = Boolean(values.showIcon);
  const showFooter = Boolean(values.showFooter);
  const sizeAttr = size === "default" ? "" : ` size=${JSON.stringify(size)}`;
  const iconBlock = showIcon
    ? `\n      showIcon\n      icon={<SymbolInformationCircle thickness="Regular" mode="fill" aria-hidden />}`
    : "";

  return `render(
  <Modal>
    <ModalTrigger asChild>
      <Button mode="default">Open modal</Button>
    </ModalTrigger>
    <ModalContent${sizeAttr}>
      <ModalHeaderText${iconBlock}
        title="Modal title"
        description="Supporting caption in the header."
      />
      <ModalBody layout="text" title="Section title" description="Body copy for the dialog." />${
        showFooter
          ? `
      <ModalFooter>
        <Button mode="second">Cancel</Button>
        <Button mode="primary">Confirm</Button>
      </ModalFooter>`
          : ""
      }
    </ModalContent>
  </Modal>
);`;
}

export const modalLiveCode = buildModalCode(
  Object.fromEntries(modalKnobs.map((k) => [k.name, k.defaultValue]))
);

export const tooltipKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "side",
    label: "side",
    options: ["top", "right", "bottom", "left"],
    defaultValue: "top",
  },
  {
    kind: "select",
    name: "level",
    label: "level",
    options: ["caption", "text"],
    defaultValue: "caption",
  },
  {
    kind: "select",
    name: "delayDuration",
    label: "delayDuration",
    options: ["0", "300"],
    defaultValue: "300",
  },
  { kind: "boolean", name: "showArrow", label: "showArrow", defaultValue: true },
];

export function buildTooltipCode(values: KnobValues): string {
  const side = String(values.side ?? "top");
  const level = String(values.level ?? "caption");
  const delayDuration = Number(values.delayDuration ?? 300);
  const showArrow = Boolean(values.showArrow);
  const showArrowProp = showArrow ? "" : "\n      showArrow={false}";
  const delayProp =
    delayDuration === 300 ? "" : `\n    delayDuration={${delayDuration}}`;
  const label =
    level === "text"
      ? "Tooltip with text typography"
      : "Tooltip with caption typography";

  return `render(
  <TooltipProvider${delayProp}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button mode="default">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent side=${JSON.stringify(side)} level=${JSON.stringify(level)}${showArrowProp}>
        ${label}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);`;
}

export const tooltipLiveCode = buildTooltipCode(
  Object.fromEntries(tooltipKnobs.map((k) => [k.name, k.defaultValue]))
);

export const responsiveTooltipKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "side",
    label: "side",
    options: ["top", "right", "bottom", "left"],
    defaultValue: "top",
  },
  {
    kind: "select",
    name: "level",
    label: "level",
    options: ["caption", "text"],
    defaultValue: "caption",
  },
  {
    kind: "select",
    name: "delayDuration",
    label: "delayDuration",
    options: ["0", "300"],
    defaultValue: "300",
  },
  { kind: "boolean", name: "showArrow", label: "showArrow", defaultValue: true },
];

export function buildResponsiveTooltipCode(values: KnobValues): string {
  const side = String(values.side ?? "top");
  const level = String(values.level ?? "caption");
  const delayDuration = Number(values.delayDuration ?? 300);
  const showArrow = Boolean(values.showArrow);
  const showArrowProp = showArrow ? "" : "\n      showArrow={false}";
  const delayProp =
    delayDuration === 300 ? "" : `\n      delayDuration={${delayDuration}}`;

  return `render(
  <TooltipProvider>
    <ResponsiveTooltip
      side=${JSON.stringify(side)}
      level=${JSON.stringify(level)}${showArrowProp}${delayProp}
      content="Desktop: hover tooltip · Touch: long-press, same tooltip skin"
    >
      <Button mode="default">Save</Button>
    </ResponsiveTooltip>
  </TooltipProvider>
);`;
}

export const responsiveTooltipLiveCode = buildResponsiveTooltipCode(
  Object.fromEntries(responsiveTooltipKnobs.map((k) => [k.name, k.defaultValue]))
);

export const loadingKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "level",
    label: "level",
    options: ["display", "headline1", "headline2", "title", "subtitle", "text", "caption"],
    defaultValue: "text",
  },
  {
    kind: "select",
    name: "mode",
    label: "mode",
    options: ["theme", "themeText", "black", "white"],
    defaultValue: "theme",
  },
  { kind: "boolean", name: "lineHeightFix", label: "lineHeightFix", defaultValue: true },
];

export function buildLoadingCode(values: KnobValues): string {
  const level = String(values.level ?? "text");
  const mode = String(values.mode ?? "theme");
  const lineHeightFix = Boolean(values.lineHeightFix);

  return `render(
  <Loading
    level=${JSON.stringify(level)}
    mode=${JSON.stringify(mode)}${jsxBool(lineHeightFix, "lineHeightFix")}
  />
);`;
}

export const loadingLiveCode = buildLoadingCode(
  Object.fromEntries(loadingKnobs.map((k) => [k.name, k.defaultValue]))
);

export const datePickerWithTimeCode = `function Demo() {
  const [value, setValue] = useState(new Date(2026, 5, 10));
  return (
    <DatePickerField
      mode="single"
      value={value}
      onValueChange={setValue}
      className="w-[290px]"
    />
  );
}

render(<Demo />);`;

export const datePickerWithTimeRangeCode = `function Demo() {
  const [value, setValue] = useState({
    from: new Date(2026, 4, 23),
    to: new Date(2026, 4, 28),
  });
  return (
    <DatePickerField
      mode="range"
      value={value}
      onValueChange={setValue}
      className="w-[320px]"
    />
  );
}

render(<Demo />);`;

export const datePickerDateOnlyCode = `render(
  <DatePickerField
    mode="single"
    enableTime={false}
    defaultValue={new Date(2026, 6, 4)}
    className="w-[290px]"
  />
);`;

export const timePickerKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "size",
    label: "size",
    options: ["regular", "big"],
    defaultValue: "regular",
  },
  { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
  { kind: "boolean", name: "error", label: "error", defaultValue: false },
  { kind: "boolean", name: "allRound", label: "allRound", defaultValue: false },
  {
    kind: "string",
    name: "placeholder",
    label: "placeholder",
    defaultValue: "HH:mm",
    placeholder: "占位符",
  },
];

export function buildTimePickerCode(values: KnobValues): string {
  const size = String(values.size ?? "regular");
  const placeholder = String(values.placeholder ?? "HH:mm");
  const disabled = Boolean(values.disabled);
  const error = Boolean(values.error);
  const allRound = Boolean(values.allRound);

  return `function Demo() {
  const [value, setValue] = useState({ hours: 9, minutes: 30 });
  return (
    <TimePickerField
      size=${JSON.stringify(size)}
      placeholder=${JSON.stringify(placeholder)}${jsxBool(disabled, "disabled")}${jsxBool(error, "error")}${jsxBool(allRound, "allRound")}
      value={value}
      onValueChange={setValue}
      className="w-[160px]"
    />
  );
}

render(<Demo />);`;
}

export const timePickerLiveCode = buildTimePickerCode(
  Object.fromEntries(timePickerKnobs.map((k) => [k.name, k.defaultValue]))
);

export const timePickerWithFormFieldCode = `function Demo() {
  const [value, setValue] = useState({ hours: 14, minutes: 0 });
  return (
    <FormField label="预约时间" className="w-[200px]">
      <TimePickerField value={value} onValueChange={setValue} />
    </FormField>
  );
}

render(<Demo />);`;

export const timePickerCompoundCode = `function Demo() {
  const [value, setValue] = useState({ hours: 17, minutes: 0 });
  return (
    <TimePicker value={value} onValueChange={setValue} defaultOpen>
      <TimePickerTrigger className="w-[160px]" />
      <TimePickerContent>
        <TimePickerPanel />
      </TimePickerContent>
    </TimePicker>
  );
}

render(<Demo />);`;

export const tabKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "style",
    label: "style",
    options: ["default", "card", "tiled"],
    defaultValue: "default",
  },
  {
    kind: "select",
    name: "background",
    label: "background",
    options: ["none", "default"],
    defaultValue: "none",
  },
  { kind: "boolean", name: "withSlots", label: "slots", defaultValue: true },
  { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
];

export const tabLiveCode = `function Demo() {
  const [value, setValue] = useState("a");
  return (
    <Tab
      style="default"
      value={value}
      onValueChange={setValue}
      startSlot={
        <Button
          mode="outlineCustom"
          size="regular"
          allRound
          iconOnly
          leftIcon={<DirectionArrowLeft aria-hidden />}
          aria-label="Previous"
        />
      }
      endSlot={
        <Button
          mode="outlineCustom"
          size="regular"
          allRound
          iconOnly
          leftIcon={<DirectionArrowRight aria-hidden />}
          aria-label="Next"
        />
      }
    >
      <TabItem value="a" leftIcon={<GeneralSetting aria-hidden />}>
        Text
      </TabItem>
      <TabItem value="b" leftIcon={<GeneralSetting aria-hidden />}>
        Text
      </TabItem>
      <TabItem value="c" leftIcon={<GeneralSetting aria-hidden />}>
        Text
      </TabItem>
      <TabItem value="d" leftIcon={<GeneralSetting aria-hidden />}>
        Text
      </TabItem>
    </Tab>
  );
}

render(<Demo />);`;

export function buildTabCode(values: KnobValues): string {
  const style = String(values.style ?? "default");
  const background = String(values.background ?? "none");
  const withSlots = values.withSlots !== false;
  const disabled = Boolean(values.disabled);
  const backgroundProp =
    background !== "none" ? `\n      background=${JSON.stringify(background)}` : "";
  const disabledProp = disabled ? `\n      disabled` : "";
  const slotsProp = withSlots
    ? `
      startSlot={
        <Button
          mode="outlineCustom"
          size="regular"
          allRound
          iconOnly
          leftIcon={<DirectionArrowLeft aria-hidden />}
          aria-label="Previous"
        />
      }
      endSlot={
        <Button
          mode="outlineCustom"
          size="regular"
          allRound
          iconOnly
          leftIcon={<DirectionArrowRight aria-hidden />}
          aria-label="Next"
        />
      }`
    : "";

  const cardWrapOpen =
    style === "card" && background === "none"
      ? `\n    <div style={{ background: "var(--box-box-theme-secondarybackground, #ffe9e5)", padding: 12, borderRadius: 8 }}>`
      : "";
  const cardWrapClose = style === "card" && background === "none" ? `\n    </div>` : "";

  return `function Demo() {
  const [value, setValue] = useState("a");
  return (${cardWrapOpen}
    <Tab
      style=${JSON.stringify(style)}${backgroundProp}${disabledProp}${slotsProp}
      value={value}
      onValueChange={setValue}
    >
      <TabItem value="a" leftIcon={<GeneralSetting aria-hidden />}>
        Text
      </TabItem>
      <TabItem value="b" leftIcon={<GeneralSetting aria-hidden />}>
        Text
      </TabItem>
      <TabItem value="c" leftIcon={<GeneralSetting aria-hidden />}>
        Text
      </TabItem>
      <TabItem value="d" leftIcon={<GeneralSetting aria-hidden />}>
        Text
      </TabItem>
    </Tab>${cardWrapClose}
  );
}

render(<Demo />);`;
}

export const navigationKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "direction",
    label: "direction",
    options: ["vertical", "horizontal"],
    defaultValue: "vertical",
  },
  {
    kind: "select",
    name: "background",
    label: "background",
    options: ["none", "default"],
    defaultValue: "default",
  },
  { kind: "boolean", name: "dividingLine", label: "dividingLine", defaultValue: false },
  { kind: "boolean", name: "showBrand", label: "showBrand", defaultValue: true },
  {
    kind: "string",
    name: "brandTitle",
    label: "brandTitle",
    defaultValue: "Brand",
    placeholder: "品牌标题",
  },
  {
    kind: "items",
    name: "items",
    label: "items（NavigationGroup）",
    itemLabel: "Item",
    min: 1,
    max: 12,
    fields: [
      {
        kind: "string",
        name: "label",
        label: "label",
        defaultValue: "Item",
        placeholder: "文案",
      },
      {
        kind: "select",
        name: "itemType",
        label: "itemType",
        options: ["default", "child"],
        defaultValue: "default",
      },
      { kind: "boolean", name: "active", label: "active", defaultValue: false },
      { kind: "boolean", name: "showLeftIcon", label: "leftIcon", defaultValue: true },
    ],
    defaultValue: [
      { label: "Overview", itemType: "default", active: true, showLeftIcon: true },
      { label: "Active child", itemType: "child", active: true, showLeftIcon: false },
      { label: "Child item", itemType: "child", active: false, showLeftIcon: false },
      { label: "Settings", itemType: "default", active: false, showLeftIcon: true },
    ],
  },
  { kind: "boolean", name: "showActions", label: "showActions", defaultValue: true },
  {
    kind: "string",
    name: "actionLabel",
    label: "actionLabel",
    defaultValue: "Collapse",
    placeholder: "操作按钮文案",
  },
  { kind: "boolean", name: "showActionSlot", label: "showActionSlot", defaultValue: true },
];

function buildNavigationItemLine(item: Record<string, string | boolean>): string {
  const label = String(item.label ?? "Item");
  const itemType = String(item.itemType ?? "default");
  const active = Boolean(item.active);
  const showLeftIcon = Boolean(item.showLeftIcon);
  const typeAttr = itemType === "child" ? ' itemType="child"' : "";
  const activeAttr = active ? " active" : "";
  const iconAttr = showLeftIcon ? " leftIcon={<GeneralSetting aria-hidden />}" : "";
  return `<NavigationItem${typeAttr}${activeAttr}${iconAttr}>${label}</NavigationItem>`;
}

function buildNavigationGroupItems(
  items: Array<Record<string, string | boolean>>,
  direction: string
): string {
  const lines: string[] = [];
  let childBuffer: string[] = [];
  const horizontal = direction === "horizontal";

  const flushChildren = () => {
    if (childBuffer.length === 0) return;
    if (horizontal) {
      /* Horizontal top bar has no child-group layout — render as default tabs. */
      for (const child of childBuffer) {
        lines.push(`      ${child}`);
      }
    } else {
      lines.push("      <NavigationItemGroup>");
      for (const child of childBuffer) {
        lines.push(`        ${child}`);
      }
      lines.push("      </NavigationItemGroup>");
    }
    childBuffer = [];
  };

  for (const item of items) {
    const coerced = horizontal
      ? { ...item, itemType: "default" }
      : item;
    const line = buildNavigationItemLine(coerced);
    if (!horizontal && String(item.itemType ?? "default") === "child") {
      childBuffer.push(line);
    } else {
      flushChildren();
      lines.push(`      ${line}`);
    }
  }
  flushChildren();
  return lines.join("\n");
}

export function buildNavigationCode(values: KnobValues): string {
  const direction = String(values.direction ?? "vertical");
  const background = String(values.background ?? "default");
  const dividingLine = Boolean(values.dividingLine);
  const showBrand = values.showBrand === undefined ? true : Boolean(values.showBrand);
  const brandTitle = String(values.brandTitle ?? "Brand");
  const showActions = values.showActions === undefined ? true : Boolean(values.showActions);
  const actionLabel = String(values.actionLabel ?? "Collapse");
  const showActionSlot = values.showActionSlot === undefined ? true : Boolean(values.showActionSlot);
  const ariaLabel = direction === "vertical" ? "Sidebar" : "Top bar";
  const layoutStyle =
    direction === "vertical"
      ? "{ width: 260 }"
      : "{ width: \"100%\", maxWidth: 1076 }";
  const items = getKnobItems(values, "items", [
    { label: "Overview", itemType: "default", active: true, showLeftIcon: true },
    { label: "Active child", itemType: "child", active: true, showLeftIcon: false },
    { label: "Child item", itemType: "child", active: false, showLeftIcon: false },
    { label: "Settings", itemType: "default", active: false, showLeftIcon: true },
  ]);

  const brandBlock = showBrand
    ? `    <NavigationBrand>
      <NavigationBrandTitle href="#">${brandTitle}</NavigationBrandTitle>
    </NavigationBrand>
`
    : "";

  const groupBlock = `    <NavigationGroup>
${buildNavigationGroupItems(items, direction)}
    </NavigationGroup>
`;

  const actionButton =
    direction === "vertical"
      ? `      <Button mode="noBackgroundCustom" size="regular" leftIcon={<GeneralCollapseSidebar aria-hidden />}>
        ${actionLabel}
      </Button>`
      : "";

  const actionSlot = showActionSlot
    ? `      <NavigationActionsSlot>
        <Button
          mode="noBackgroundCustom"
          size="regular"
          iconOnly
          aria-label="Settings"
          leftIcon={<GeneralSetting aria-hidden />}
        />
      </NavigationActionsSlot>`
    : "";

  const actionsInner = [actionButton, actionSlot].filter(Boolean).join("\n");
  const actionsBlock =
    showActions && actionsInner
      ? `    <NavigationActions>
${actionsInner}
    </NavigationActions>
`
      : "";

  return `render(
  <Navigation
    direction=${JSON.stringify(direction)}
    background=${JSON.stringify(background)}${jsxBool(dividingLine, "dividingLine")}
    style={${layoutStyle}}
    aria-label=${JSON.stringify(ariaLabel)}
  >
${brandBlock}${groupBlock}${actionsBlock}  </Navigation>
);`;
}

export const navigationLiveCode = buildNavigationCode(defaultKnobValues(navigationKnobs));

export const navigationItemStatesCode = `render(
  <div className="flex w-[280px] flex-col gap-3">
    <NavigationItem
      leftIcon={<GeneralSetting aria-hidden />}
      rightIcon={<DirectionArrowDownLight aria-hidden />}
    >
      Default tab item
    </NavigationItem>
    <NavigationItem
      active
      leftIcon={<GeneralSetting aria-hidden />}
      rightIcon={<DirectionArrowDownLight aria-hidden />}
    >
      Active tab item
    </NavigationItem>
    <NavigationItem itemType="child">Default child item</NavigationItem>
    <NavigationItem itemType="child" active>
      Active child item
    </NavigationItem>
  </div>
);`;

export const navigationVerticalVariantsCode = `render(
  <div className="flex flex-wrap gap-4">
    <Navigation direction="vertical" background="none" className="h-[420px] w-[260px]" aria-label="V none">
      <NavigationBrand>
        <NavigationBrandTitle href="#">Brand</NavigationBrandTitle>
      </NavigationBrand>
      <NavigationGroup>
        <NavigationItem active leftIcon={<GeneralSetting aria-hidden />}>Overview</NavigationItem>
        <NavigationItem leftIcon={<GeneralSetting aria-hidden />}>Settings</NavigationItem>
      </NavigationGroup>
    </Navigation>
    <Navigation direction="vertical" background="default" className="h-[420px] w-[260px]" aria-label="V default">
      <NavigationBrand>
        <NavigationBrandTitle href="#">Brand</NavigationBrandTitle>
      </NavigationBrand>
      <NavigationGroup>
        <NavigationItem active leftIcon={<GeneralSetting aria-hidden />}>Overview</NavigationItem>
        <NavigationItem leftIcon={<GeneralSetting aria-hidden />}>Settings</NavigationItem>
      </NavigationGroup>
    </Navigation>
    <Navigation direction="vertical" background="none" dividingLine className="h-[420px] w-[260px]" aria-label="V none divider">
      <NavigationBrand>
        <NavigationBrandTitle href="#">Brand</NavigationBrandTitle>
      </NavigationBrand>
      <NavigationGroup>
        <NavigationItem active leftIcon={<GeneralSetting aria-hidden />}>Overview</NavigationItem>
        <NavigationItem leftIcon={<GeneralSetting aria-hidden />}>Settings</NavigationItem>
      </NavigationGroup>
    </Navigation>
    <Navigation direction="vertical" background="default" dividingLine className="h-[420px] w-[260px]" aria-label="V default divider">
      <NavigationBrand>
        <NavigationBrandTitle href="#">Brand</NavigationBrandTitle>
      </NavigationBrand>
      <NavigationGroup>
        <NavigationItem active leftIcon={<GeneralSetting aria-hidden />}>Overview</NavigationItem>
        <NavigationItem leftIcon={<GeneralSetting aria-hidden />}>Settings</NavigationItem>
      </NavigationGroup>
    </Navigation>
  </div>
);`;

export const navigationHorizontalVariantsCode = `render(
  <div className="flex flex-col gap-4">
    <Navigation direction="horizontal" background="none" className="max-w-[1076px]" aria-label="H none">
      <NavigationBrand>
        <NavigationBrandTitle href="#">Brand</NavigationBrandTitle>
      </NavigationBrand>
      <NavigationGroup>
        <NavigationItem active leftIcon={<GeneralSetting aria-hidden />}>Overview</NavigationItem>
        <NavigationItem leftIcon={<GeneralSetting aria-hidden />}>Settings</NavigationItem>
        <NavigationItem leftIcon={<GeneralSetting aria-hidden />}>Billing</NavigationItem>
      </NavigationGroup>
    </Navigation>
    <Navigation direction="horizontal" background="default" className="max-w-[1076px]" aria-label="H default">
      <NavigationBrand>
        <NavigationBrandTitle href="#">Brand</NavigationBrandTitle>
      </NavigationBrand>
      <NavigationGroup>
        <NavigationItem active leftIcon={<GeneralSetting aria-hidden />}>Overview</NavigationItem>
        <NavigationItem leftIcon={<GeneralSetting aria-hidden />}>Settings</NavigationItem>
        <NavigationItem leftIcon={<GeneralSetting aria-hidden />}>Billing</NavigationItem>
      </NavigationGroup>
    </Navigation>
    <Navigation direction="horizontal" background="none" dividingLine className="max-w-[1076px]" aria-label="H none divider">
      <NavigationBrand>
        <NavigationBrandTitle href="#">Brand</NavigationBrandTitle>
      </NavigationBrand>
      <NavigationGroup>
        <NavigationItem active leftIcon={<GeneralSetting aria-hidden />}>Overview</NavigationItem>
        <NavigationItem leftIcon={<GeneralSetting aria-hidden />}>Settings</NavigationItem>
        <NavigationItem leftIcon={<GeneralSetting aria-hidden />}>Billing</NavigationItem>
      </NavigationGroup>
    </Navigation>
    <Navigation direction="horizontal" background="default" dividingLine className="max-w-[1076px]" aria-label="H default divider">
      <NavigationBrand>
        <NavigationBrandTitle href="#">Brand</NavigationBrandTitle>
      </NavigationBrand>
      <NavigationGroup>
        <NavigationItem active leftIcon={<GeneralSetting aria-hidden />}>Overview</NavigationItem>
        <NavigationItem leftIcon={<GeneralSetting aria-hidden />}>Settings</NavigationItem>
        <NavigationItem leftIcon={<GeneralSetting aria-hidden />}>Billing</NavigationItem>
      </NavigationGroup>
    </Navigation>
  </div>
);`;

/* —— Remaining Components Figma coverage —— */

export const badgeKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "style",
    label: "style",
    options: ["theme", "info", "fail", "warning", "success", "normal"],
    defaultValue: "theme",
  },
  {
    kind: "select",
    name: "level",
    label: "level",
    options: ["caption", "text"],
    defaultValue: "caption",
  },
  { kind: "boolean", name: "primary", label: "primary", defaultValue: false },
  { kind: "boolean", name: "lineHeightFix", label: "lineHeightFix", defaultValue: true },
  { kind: "string", name: "label", label: "children", defaultValue: "Badge", placeholder: "文字" },
];

export function buildBadgeCode(values: KnobValues): string {
  const style = String(values.style ?? "theme");
  const level = String(values.level ?? "caption");
  const label = String(values.label ?? "Badge");
  const primary = Boolean(values.primary);
  const lineHeightFix = Boolean(values.lineHeightFix);
  return `render(
  <Badge
    style=${JSON.stringify(style)}
    level=${JSON.stringify(level)}${jsxBool(primary, "primary")}${jsxBool(lineHeightFix, "lineHeightFix")}
  >
    ${jsxString(label)}
  </Badge>
);`;
}

export const badgeLiveCode = buildBadgeCode(
  Object.fromEntries(badgeKnobs.map((k) => [k.name, k.defaultValue]))
);

export const avatarKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "level",
    label: "level",
    options: ["display", "headline1", "headline2", "title", "subtitle", "text"],
    defaultValue: "display",
  },
  {
    kind: "select",
    name: "content",
    label: "content",
    options: ["text", "picture", "icon"],
    defaultValue: "text",
  },
  { kind: "boolean", name: "lineHeightFix", label: "lineHeightFix", defaultValue: false },
  { kind: "string", name: "label", label: "children", defaultValue: "K", placeholder: "首字母" },
];

export function buildAvatarCode(values: KnobValues): string {
  const level = String(values.level ?? "display");
  const content = String(values.content ?? "text");
  const label = String(values.label ?? "K");
  const lineHeightFix = Boolean(values.lineHeightFix);
  if (content === "icon") {
    return `render(
  <Avatar
    level=${JSON.stringify(level)}
    content="icon"${jsxBool(lineHeightFix, "lineHeightFix")}
    icon={<UsersUserCircle aria-hidden />}
  />
);`;
  }
  if (content === "picture") {
    return `render(
  <Avatar
    level=${JSON.stringify(level)}
    content="picture"${jsxBool(lineHeightFix, "lineHeightFix")}
    src="https://picsum.photos/80"
    alt="Avatar"
  />
);`;
  }
  return `render(
  <Avatar
    level=${JSON.stringify(level)}
    content="text"${jsxBool(lineHeightFix, "lineHeightFix")}
  >
    ${jsxString(label)}
  </Avatar>
);`;
}

export const avatarLiveCode = buildAvatarCode(
  Object.fromEntries(avatarKnobs.map((k) => [k.name, k.defaultValue]))
);

export const tagKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "level",
    label: "level",
    options: ["caption", "text"],
    defaultValue: "caption",
  },
  {
    kind: "select",
    name: "content",
    label: "content",
    options: ["text", "people"],
    defaultValue: "text",
  },
  { kind: "boolean", name: "closable", label: "closable", defaultValue: true },
  { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
  { kind: "string", name: "label", label: "children", defaultValue: "Tag", placeholder: "文字" },
];

export function buildTagCode(values: KnobValues): string {
  const level = String(values.level ?? "caption");
  const content = String(values.content ?? "text");
  const label = String(values.label ?? "Tag");
  const closable = Boolean(values.closable);
  const disabled = Boolean(values.disabled);
  const peopleProps =
    content === "people" ? `\n    avatarText=${JSON.stringify(label.charAt(0) || "T")}` : "";
  return `render(
  <Tag
    level=${JSON.stringify(level)}
    content=${JSON.stringify(content)}${peopleProps}${jsxBool(closable, "closable")}${jsxBool(disabled, "disabled")}
  >
    ${jsxString(label)}
  </Tag>
);`;
}

export const tagLiveCode = buildTagCode(
  Object.fromEntries(tagKnobs.map((k) => [k.name, k.defaultValue]))
);

export const progressKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "type",
    label: "type",
    options: ["default", "success", "fail"],
    defaultValue: "default",
  },
  {
    kind: "select",
    name: "size",
    label: "size",
    options: ["default", "big"],
    defaultValue: "default",
  },
  {
    kind: "select",
    name: "shape",
    label: "shape",
    options: ["bar", "ring"],
    defaultValue: "bar",
  },
  { kind: "boolean", name: "showLabel", label: "showLabel", defaultValue: true },
  {
    kind: "string",
    name: "value",
    label: "value",
    defaultValue: "75",
    placeholder: "0-100",
  },
];

export function buildProgressCode(values: KnobValues): string {
  const type = String(values.type ?? "default");
  const size = String(values.size ?? "default");
  const shape = String(values.shape ?? "bar");
  const value = Number(values.value ?? 75);
  const showLabel = Boolean(values.showLabel);
  return `render(
  <Progress
    type=${JSON.stringify(type)}
    size=${JSON.stringify(size)}
    shape=${JSON.stringify(shape)}
    value={${Number.isFinite(value) ? value : 75}}${jsxBool(showLabel, "showLabel")}
  />
);`;
}

export const progressLiveCode = buildProgressCode(
  Object.fromEntries(progressKnobs.map((k) => [k.name, k.defaultValue]))
);

export const scrollKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "size",
    label: "size",
    options: ["default", "small"],
    defaultValue: "default",
  },
  {
    kind: "select",
    name: "orientation",
    label: "orientation",
    options: ["vertical", "horizontal"],
    defaultValue: "vertical",
  },
];

export function buildScrollCode(values: KnobValues): string {
  const size = String(values.size ?? "default");
  const orientation = String(values.orientation ?? "vertical");
  const box =
    orientation === "horizontal"
      ? `style={{ width: 240, height: 80 }}`
      : `style={{ width: 240, height: 140 }}`;
  const content =
    orientation === "horizontal"
      ? `<div style={{ display: "flex", gap: 12, padding: 8, width: 480 }}>
      {Array.from({ length: 12 }, (_, i) => (
        <span key={i}>Item {i + 1}</span>
      ))}
    </div>`
      : `<div style={{ padding: 8 }}>
      {Array.from({ length: 24 }, (_, i) => (
        <p key={i} style={{ margin: "0 0 8px" }}>Line {i + 1}</p>
      ))}
    </div>`;
  return `render(
  <Scroll size=${JSON.stringify(size)} orientation=${JSON.stringify(orientation)} ${box}>
    ${content}
  </Scroll>
);`;
}

export const scrollLiveCode = buildScrollCode(
  Object.fromEntries(scrollKnobs.map((k) => [k.name, k.defaultValue]))
);

export const sliderKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "type",
    label: "type",
    options: ["default", "range"],
    defaultValue: "default",
  },
  {
    kind: "select",
    name: "size",
    label: "size",
    options: ["default", "big"],
    defaultValue: "default",
  },
  { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
  {
    kind: "boolean",
    name: "showValueTooltip",
    label: "showValueTooltip",
    defaultValue: false,
  },
];

export function buildSliderCode(values: KnobValues): string {
  const type = String(values.type ?? "default");
  const size = String(values.size ?? "default");
  const disabled = Boolean(values.disabled);
  const showValueTooltip = Boolean(values.showValueTooltip);
  const defaultValue = type === "range" ? "[20, 70]" : "[40]";
  return `render(
  <Slider
    type=${JSON.stringify(type)}
    size=${JSON.stringify(size)}
    defaultValue={${defaultValue}}${jsxBool(disabled, "disabled")}${jsxBool(showValueTooltip, "showValueTooltip")}
    style={{ width: 220 }}
  />
);`;
}

export const sliderLiveCode = buildSliderCode(
  Object.fromEntries(sliderKnobs.map((k) => [k.name, k.defaultValue]))
);

export const uploadKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "style",
    label: "style",
    options: ["default", "large"],
    defaultValue: "large",
  },
  { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
  { kind: "boolean", name: "multiple", label: "multiple", defaultValue: false },
  {
    kind: "string",
    name: "label",
    label: "label",
    defaultValue: "Upload",
    placeholder: "Default 样式文案",
  },
];

export function buildUploadCode(values: KnobValues): string {
  const style = String(values.style ?? "large");
  const disabled = Boolean(values.disabled);
  const multiple = Boolean(values.multiple);
  const label = String(values.label ?? "Upload");
  const labelProp = style === "default" ? `\n    label=${JSON.stringify(label)}` : "";
  return `render(
  <Upload
    style=${JSON.stringify(style)}${labelProp}${jsxBool(disabled, "disabled")}${jsxBool(multiple, "multiple")}
  />
);`;
}

export const uploadLiveCode = buildUploadCode(
  Object.fromEntries(uploadKnobs.map((k) => [k.name, k.defaultValue]))
);

export const scrollPickerKnobs: KnobDef[] = [
  { kind: "boolean", name: "loop", label: "loop", defaultValue: true },
];

export function buildScrollPickerCode(values: KnobValues): string {
  const loop = Boolean(values.loop);
  return `function Demo() {
  const [hour, setHour] = useState("10");
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  return (
    <ScrollPicker style={{ width: 120 }}>
      <ScrollPickerColumn
        aria-label="Hour"
        values={hours}
        value={hour}
        onChange={setHour}${jsxBool(loop, "loop")}
      />
    </ScrollPicker>
  );
}

render(<Demo />);`;
}

export const scrollPickerLiveCode = buildScrollPickerCode(
  Object.fromEntries(scrollPickerKnobs.map((k) => [k.name, k.defaultValue]))
);

export const breadcrumbKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "size",
    label: "size",
    options: ["default", "small"],
    defaultValue: "default",
  },
  {
    kind: "items",
    name: "items",
    label: "items",
    itemLabel: "Item",
    min: 1,
    max: 12,
    fields: [
      {
        kind: "select",
        name: "type",
        label: "type",
        options: ["content", "separator", "ellipsis"],
        defaultValue: "content",
      },
      {
        kind: "string",
        name: "label",
        label: "label",
        defaultValue: "Item",
        placeholder: "content 文案",
      },
      { kind: "boolean", name: "current", label: "current", defaultValue: false },
      { kind: "boolean", name: "activated", label: "activated", defaultValue: false },
    ],
    defaultValue: [
      { type: "content", label: "Home", current: false, activated: false },
      { type: "separator", label: "", current: false, activated: false },
      { type: "content", label: "Projects", current: false, activated: false },
      { type: "separator", label: "", current: false, activated: false },
      { type: "ellipsis", label: "", current: false, activated: false },
      { type: "separator", label: "", current: false, activated: false },
      { type: "content", label: "Current", current: true, activated: false },
    ],
  },
  {
    kind: "items",
    name: "menuItems",
    label: "menuItems（ellipsis）",
    itemLabel: "Menu",
    min: 0,
    max: 8,
    fields: [
      {
        kind: "string",
        name: "label",
        label: "label",
        defaultValue: "Item",
        placeholder: "菜单项",
      },
    ],
    defaultValue: [{ label: "Library" }, { label: "Docs" }],
  },
];

export function buildBreadcrumbCode(values: KnobValues): string {
  const size = String(values.size ?? "default");
  const items = getKnobItems(values, "items", [
    { type: "content", label: "Home", current: false, activated: false },
    { type: "separator", label: "", current: false, activated: false },
    { type: "content", label: "Projects", current: false, activated: false },
    { type: "separator", label: "", current: false, activated: false },
    { type: "ellipsis", label: "", current: false, activated: false },
    { type: "separator", label: "", current: false, activated: false },
    { type: "content", label: "Current", current: true, activated: false },
  ]);
  const menuItems = getKnobItems(values, "menuItems", [
    { label: "Library" },
    { label: "Docs" },
  ]);

  const ellipsisIndexes = items
    .map((item, index) => (String(item.type) === "ellipsis" ? index : -1))
    .filter((index) => index >= 0);
  const hasEllipsis = ellipsisIndexes.length > 0;

  const menuJsx =
    menuItems.length > 0
      ? `
        menu={
          <>
${menuItems
  .map(
    (item) =>
      `            <BreadcrumbEllipsisItem href="#">${String(item.label ?? "Item")}</BreadcrumbEllipsisItem>`
  )
  .join("\n")}
          </>
        }`
      : "";

  const children = items
    .map((item, index) => {
      const type = String(item.type ?? "content");
      if (type === "separator") {
        return "      <BreadcrumbSeparator />";
      }
      if (type === "ellipsis") {
        const stateName = `activated${ellipsisIndexes.indexOf(index)}`;
        if (hasEllipsis) {
          return `      <BreadcrumbEllipsis
        activated={${stateName}}
        onActivatedChange={setActivated${ellipsisIndexes.indexOf(index)}}${menuJsx}
      />`;
        }
        return `      <BreadcrumbEllipsis${menuJsx} />`;
      }
      const label = String(item.label ?? "Item");
      const current = Boolean(item.current);
      if (current) {
        return `      <BreadcrumbItem current>${label}</BreadcrumbItem>`;
      }
      return `      <BreadcrumbItem href="#">${label}</BreadcrumbItem>`;
    })
    .join("\n");

  if (!hasEllipsis) {
    return `render(
  <Breadcrumb size=${JSON.stringify(size)}>
${children}
  </Breadcrumb>
);`;
  }

  const stateDecls = ellipsisIndexes
    .map((itemIndex, i) => {
      const activated = Boolean(items[itemIndex]?.activated);
      return `  const [activated${i}, setActivated${i}] = useState(${activated});`;
    })
    .join("\n");

  return `function Demo() {
${stateDecls}
  return (
    <Breadcrumb size=${JSON.stringify(size)}>
${children}
    </Breadcrumb>
  );
}

render(<Demo />);`;
}

export const breadcrumbLiveCode = buildBreadcrumbCode(defaultKnobValues(breadcrumbKnobs));

export const pageheadKnobs: KnobDef[] = [
  {
    kind: "string",
    name: "title",
    label: "title",
    defaultValue: "Page title",
    placeholder: "标题",
  },
  {
    kind: "string",
    name: "description",
    label: "description",
    defaultValue: "Supporting description for this page.",
    placeholder: "描述",
  },
  { kind: "boolean", name: "showBack", label: "showBack", defaultValue: false },
  { kind: "boolean", name: "showBreadcrumb", label: "showBreadcrumb", defaultValue: true },
  { kind: "boolean", name: "showActions", label: "showActions", defaultValue: true },
  {
    kind: "select",
    name: "actionCount",
    label: "actionCount",
    options: ["1", "2", "3"],
    defaultValue: "1",
  },
  {
    kind: "items",
    name: "crumbs",
    label: "crumbs",
    itemLabel: "Crumb",
    min: 1,
    max: 8,
    fields: [
      {
        kind: "string",
        name: "label",
        label: "label",
        defaultValue: "Page",
        placeholder: "面包屑文案",
      },
      { kind: "boolean", name: "current", label: "current", defaultValue: false },
    ],
    defaultValue: [
      { label: "Home", current: false },
      { label: "Page", current: true },
    ],
  },
];

export function buildPageheadCode(values: KnobValues): string {
  const title = String(values.title ?? "Page title");
  const description = String(values.description ?? "");
  const showBack = Boolean(values.showBack);
  const showBreadcrumb = Boolean(values.showBreadcrumb);
  const showActions = Boolean(values.showActions);
  const actionCount = Math.min(3, Math.max(1, Number(values.actionCount ?? 1) || 1));
  const crumbs = getKnobItems(values, "crumbs", [
    { label: "Home", current: false },
    { label: "Page", current: true },
  ]);

  const crumbNodes: string[] = [];
  crumbs.forEach((crumb, index) => {
    const label = String(crumb.label ?? "Page");
    const current = Boolean(crumb.current);
    if (index > 0) crumbNodes.push("        <BreadcrumbSeparator />");
    if (current) {
      crumbNodes.push(`        <BreadcrumbItem current>${label}</BreadcrumbItem>`);
    } else {
      crumbNodes.push(`        <BreadcrumbItem href="#">${label}</BreadcrumbItem>`);
    }
  });

  const backProp = showBack
    ? `
    back={
      <Button
        mode="noBackgroundCustom"
        size="small"
        iconOnly
        aria-label="Back"
        leftIcon={<DirectionArrowLeft aria-hidden />}
      />
    }`
    : "";

  const breadcrumbProp = showBreadcrumb
    ? `
    breadcrumb={
      <Breadcrumb size="small">
${crumbNodes.join("\n")}
      </Breadcrumb>
    }`
    : "";

  const actionButtons = Array.from({ length: actionCount }, (_, i) => {
    const label = actionCount === 1 ? "Action" : `Action ${i + 1}`;
    const mode = i === 0 ? "primary" : "default";
    return `<Button mode="${mode}" size="small">${label}</Button>`;
  }).join("\n        ");

  const actionsProp = showActions
    ? `
    actions={
      <>
        ${actionButtons}
      </>
    }`
    : "";

  return `render(
  <Pagehead
    title=${JSON.stringify(title)}
    description=${JSON.stringify(description)}${backProp}${breadcrumbProp}${actionsProp}
  />
);`;
}

export const pageheadLiveCode = buildPageheadCode(defaultKnobValues(pageheadKnobs));

export const stepsKnobs: KnobDef[] = [
  {
    kind: "select",
    name: "direction",
    label: "direction",
    options: ["horizontal", "vertical"],
    defaultValue: "horizontal",
  },
  {
    kind: "items",
    name: "items",
    label: "items",
    itemLabel: "Step",
    min: 1,
    max: 8,
    fields: [
      {
        kind: "select",
        name: "state",
        label: "state",
        options: ["done", "fail", "warning", "waiting", "inProgress", "default"],
        defaultValue: "default",
      },
      {
        kind: "string",
        name: "title",
        label: "title",
        defaultValue: "Step",
        placeholder: "标题",
      },
      {
        kind: "string",
        name: "description",
        label: "description",
        defaultValue: "",
        placeholder: "描述",
      },
      {
        kind: "string",
        name: "index",
        label: "index",
        defaultValue: "1",
        placeholder: "序号",
      },
    ],
    defaultValue: [
      { state: "done", title: "Done", description: "Completed", index: "1" },
      { state: "inProgress", title: "In progress", description: "Working", index: "2" },
      { state: "default", title: "Next", description: "Waiting", index: "3" },
    ],
  },
];

export function buildStepsCode(values: KnobValues): string {
  const direction = String(values.direction ?? "horizontal");
  const widthProp = direction === "horizontal" ? `\n    style={{ width: 420 }}` : "";
  const items = getKnobItems(values, "items", [
    { state: "done", title: "Done", description: "Completed", index: "1" },
    { state: "inProgress", title: "In progress", description: "Working", index: "2" },
    { state: "default", title: "Next", description: "Waiting", index: "3" },
  ]);

  const stepNodes = items
    .map((item, i) => {
      const state = String(item.state ?? "default");
      const title = String(item.title ?? `Step ${i + 1}`);
      const description = String(item.description ?? "");
      const indexNum = Number(item.index);
      const indexAttr = Number.isFinite(indexNum) ? ` index={${indexNum}}` : "";
      return `    <StepsItem state=${JSON.stringify(state)} title=${JSON.stringify(title)} description=${JSON.stringify(description)}${indexAttr} />`;
    })
    .join("\n");

  return `render(
  <Steps direction=${JSON.stringify(direction)}${widthProp}>
${stepNodes}
  </Steps>
);`;
}

export const stepsLiveCode = buildStepsCode(defaultKnobValues(stepsKnobs));

export const paginationKnobs: KnobDef[] = [
  {
    kind: "string",
    name: "page",
    label: "page",
    defaultValue: "1",
    placeholder: "当前页",
  },
  {
    kind: "string",
    name: "pageCount",
    label: "pageCount",
    defaultValue: "20",
    placeholder: "总页数",
  },
  { kind: "boolean", name: "showJump", label: "showJump", defaultValue: true },
  { kind: "boolean", name: "showSizeChanger", label: "showSizeChanger", defaultValue: true },
];

export function buildPaginationCode(values: KnobValues): string {
  const page = Number(values.page ?? 1);
  const pageCount = Number(values.pageCount ?? 20);
  const showJump = Boolean(values.showJump);
  const showSizeChanger = Boolean(values.showSizeChanger);
  return `function Demo() {
  const [page, setPage] = useState(${Number.isFinite(page) ? page : 1});
  return (
    <Pagination
      page={page}
      pageCount={${Number.isFinite(pageCount) ? pageCount : 20}}
      onPageChange={setPage}${jsxBool(showJump, "showJump")}${jsxBool(showSizeChanger, "showSizeChanger")}
    />
  );
}

render(<Demo />);`;
}

export const paginationLiveCode = buildPaginationCode(
  Object.fromEntries(paginationKnobs.map((k) => [k.name, k.defaultValue]))
);

export const cardKnobs: KnobDef[] = [
  {
    kind: "string",
    name: "title",
    label: "title",
    defaultValue: "Card title",
    placeholder: "标题",
  },
  {
    kind: "string",
    name: "description",
    label: "description",
    defaultValue: "Caption text",
    placeholder: "描述",
  },
  { kind: "boolean", name: "showBody", label: "showBody", defaultValue: true },
  { kind: "boolean", name: "showBottom", label: "showBottom", defaultValue: true },
  {
    kind: "select",
    name: "bottomSlotType",
    label: "bottomSlotType",
    options: ["action", "switch", "select"],
    defaultValue: "action",
  },
];

export function buildCardCode(values: KnobValues): string {
  const slotType = String(values.bottomSlotType ?? values.slotType ?? "action");
  const title = String(values.title ?? "Card title");
  const description = String(values.description ?? "");
  const showBody = Boolean(values.showBody);
  const showBottom = values.showBottom === undefined ? true : Boolean(values.showBottom);
  const body = showBody ? `\n    <CardBody>Body content for this card.</CardBody>` : "";
  const bottom = showBottom
    ? `\n    <CardBottom slotType=${JSON.stringify(slotType)} />`
    : "";
  /* Figma Card composite: head (title only) + optional body + optional bottom */
  return `render(
  <Card style={{ width: 387 }}>
    <CardHead
      title=${JSON.stringify(title)}
      description=${JSON.stringify(description)}
      trailing={null}
    />${body}${bottom}
  </Card>
);`;
}

export const cardLiveCode = buildCardCode(defaultKnobValues(cardKnobs));

const TABLE_COLUMN_DEFAULTS = [
  { label: "Name", content: "people" },
  { label: "Status", content: "badge" },
  { label: "Notify", content: "switch" },
  { label: "Actions", content: "action" },
];

const TABLE_ROW_DEFAULTS = [
  { name: "Kai Lark", badge: "Active", switchOn: true, checked: false },
  { name: "Ada Chen", badge: "Away", switchOn: false, checked: true },
];

export const tableKnobs: KnobDef[] = [
  { kind: "boolean", name: "showCheckbox", label: "showCheckbox", defaultValue: true },
  { kind: "boolean", name: "stickyHeader", label: "stickyHeader", defaultValue: false },
  { kind: "boolean", name: "showActions", label: "showActions", defaultValue: true },
  {
    kind: "items",
    name: "columns",
    label: "columns",
    itemLabel: "Column",
    min: 1,
    max: 6,
    fields: [
      {
        kind: "string",
        name: "label",
        label: "label",
        defaultValue: "Column",
        placeholder: "表头",
      },
      {
        kind: "select",
        name: "content",
        label: "content",
        options: ["people", "text", "badge", "switch", "icon+text", "icon-place+text", "action"],
        defaultValue: "text",
      },
    ],
    defaultValue: TABLE_COLUMN_DEFAULTS,
  },
  {
    kind: "items",
    name: "rows",
    label: "rows",
    itemLabel: "Row",
    min: 1,
    max: 8,
    fields: [
      {
        kind: "string",
        name: "name",
        label: "name / text",
        defaultValue: "Kai Lark",
        placeholder: "人名或文本",
      },
      {
        kind: "string",
        name: "badge",
        label: "badge",
        defaultValue: "Active",
        placeholder: "徽章文案",
      },
      { kind: "boolean", name: "switchOn", label: "switchOn", defaultValue: true },
      { kind: "boolean", name: "checked", label: "checked", defaultValue: false },
    ],
    defaultValue: TABLE_ROW_DEFAULTS,
  },
];

function buildTableCellCode(
  content: string,
  row: { name?: string | boolean; badge?: string | boolean; switchOn?: string | boolean },
  showActions: boolean
): string {
  const name = String(row.name ?? "Text");
  const badge = String(row.badge ?? "Active");
  const switchOn = Boolean(row.switchOn);
  const initial = (name.trim().charAt(0) || "A").toUpperCase();
  const actionsAttr = showActions ? " actions={rowActions}" : "";

  if (content === "people") {
    return `        <TableCell
          content="people"
          people={<Avatar content="text" level="text" lineHeightFix={false}>${initial}</Avatar>}
          text=${jsxString(name)}
          caption="Member"${actionsAttr}
        />`;
  }
  if (content === "badge") {
    return `        <TableCell content="badge" badgeLabel=${jsxString(badge)}${actionsAttr} />`;
  }
  if (content === "switch") {
    return switchOn
      ? `        <TableCell content="switch" switchProps={{ defaultChecked: true }} />`
      : `        <TableCell content="switch" />`;
  }
  if (content === "icon+text") {
    return `        <TableCell
          content="icon+text"
          icon={<${DEFAULT_ICON_NAME} aria-hidden />}
          text=${jsxString(name)}${actionsAttr}
        />`;
  }
  if (content === "icon-place+text") {
    return `        <TableCell
          content="icon-place+text"
          iconPlace={<Avatar content="text" level="text" lineHeightFix={false}>${initial}</Avatar>}
          text=${jsxString(name)}${actionsAttr}
        />`;
  }
  if (content === "action") {
    return showActions
      ? `        <TableCell content="action" actions={rowActions} />`
      : `        <TableCell content="action" />`;
  }
  return `        <TableCell content="text" text=${jsxString(name)}${actionsAttr} />`;
}

export function buildTableCode(values: KnobValues): string {
  const showCheckbox = Boolean(values.showCheckbox);
  const stickyHeader = Boolean(values.stickyHeader);
  const showActions = Boolean(values.showActions);
  const columns = getKnobItems(values, "columns", TABLE_COLUMN_DEFAULTS);
  const rows = getKnobItems(values, "rows", TABLE_ROW_DEFAULTS);

  const initialSelected = rows
    .map((row, index) => `${index}: ${Boolean(row.checked)}`)
    .join(", ");

  const headCells = [
    showCheckbox
      ? `        <TableHead
          content="checkbox"
          checkboxProps={{
            checked: allChecked ? true : someChecked ? "indeterminate" : false,
            onCheckedChange: (value) => {
              const next = value === true;
              setSelected(Object.fromEntries(ids.map((id) => [id, next])));
            },
            "aria-label": "Select all rows",
          }}
        />`
      : null,
    ...columns.map((column) => {
      const label = String(column.label ?? "Column");
      const content = String(column.content ?? "text");
      const headActions =
        showActions && content !== "switch" && content !== "action"
          ? " actions={rowActions}"
          : "";
      return `        <TableHead${headActions}>{${jsxString(label)}}</TableHead>`;
    }),
  ]
    .filter(Boolean)
    .join("\n");

  const bodyRows = rows
    .map((row, index) => {
      const checkboxCell = showCheckbox
        ? `        <TableCell
          content="checkbox"
          checkboxProps={{
            checked: Boolean(selected[${index}]),
            onCheckedChange: (value) =>
              setSelected((prev) => ({ ...prev, [${index}]: value === true })),
            "aria-label": ${jsxString(`Select ${String(row.name ?? "row")}`)},
          }}
        />`
        : null;
      const dataCells = columns.map((column) =>
        buildTableCellCode(String(column.content ?? "text"), row, showActions)
      );
      return `      <TableRow>
${[checkboxCell, ...dataCells].filter(Boolean).join("\n")}
      </TableRow>`;
    })
    .join("\n");

  const actionsBlock = showActions
    ? `  const rowActions = (
    <>
      <Button mode="noBackgroundCustom" size="small" iconOnly aria-label="Settings">
        <GeneralSetting aria-hidden />
      </Button>
      <Button mode="noBackgroundCustom" size="small" iconOnly aria-label="More">
        <SymbolMore thickness="Light" aria-hidden />
      </Button>
    </>
  );
`
    : "";

  const stickyAttr = stickyHeader ? " stickyHeader" : "";
  const styleAttr = stickyHeader
    ? ` style={{ width: "100%", minWidth: 480, maxHeight: 320 }}`
    : ` style={{ width: "100%", minWidth: 480 }}`;

  return `function Demo() {
  const ids = [${rows.map((_, index) => index).join(", ")}];
  const [selected, setSelected] = React.useState({ ${initialSelected} });
  const selectedCount = ids.filter((id) => selected[id]).length;
  const allChecked = selectedCount === ids.length;
  const someChecked = selectedCount > 0 && !allChecked;
${actionsBlock}
  return (
    <Table${stickyAttr}${styleAttr}>
      <TableRow header>
${headCells}
      </TableRow>
${bodyRows}
    </Table>
  );
}

render(<Demo />);`;
}

export const tableLiveCode = buildTableCode(defaultKnobValues(tableKnobs));
