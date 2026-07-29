import {
  NumberInput,
  type InputSize,
  type NumberInputStyle,
} from "@aviala-design/spiral";

import type { KnobValues } from "../../components/DemoKnobs";
import {
  applyIconRoleOverride,
  iconRoleKnobs,
  readIconRoleFromState,
  renderDebugIcon,
} from "../icon-knobs";
import type { DebugComponentEntry } from "../types";

export type NumberInputDebugState = {
  value: string;
  size: InputSize;
  allRound: boolean;
  inputStyle: NumberInputStyle;
  showControls: boolean;
  disabled: boolean;
  error: boolean;
  fullWidth: boolean;
  placeholder: string;
  step: string;
  min: string;
  max: string;
  showLeftIcon: boolean;
  leftIconName: string;
  leftIconThickness: string;
  leftIconMode: string;
  leftIconBiggerSize: boolean;
  leftIconLevel: string;
  showRightIcon: boolean;
  rightIconName: string;
  rightIconThickness: string;
  rightIconMode: string;
  rightIconBiggerSize: boolean;
  rightIconLevel: string;
};

const initialState: NumberInputDebugState = {
  value: "12",
  size: "regular",
  allRound: false,
  inputStyle: "default",
  showControls: true,
  disabled: false,
  error: false,
  fullWidth: true,
  placeholder: "0",
  step: "1",
  min: "",
  max: "",
  showLeftIcon: false,
  leftIconName: "GeneralSetting",
  leftIconThickness: "Light",
  leftIconMode: "default",
  leftIconBiggerSize: true,
  leftIconLevel: "text",
  showRightIcon: false,
  rightIconName: "GeneralSetting",
  rightIconThickness: "Light",
  rightIconMode: "default",
  rightIconBiggerSize: true,
  rightIconLevel: "text",
};

function parseOptionalNumber(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : undefined;
}

export const numberInputEntry: DebugComponentEntry<NumberInputDebugState> = {
  id: "number-input",
  label: "NumberInput",
  description: "Figma Information Collect → NumberInput",
  initialState,
  nodes: [
    {
      debugId: "number-input",
      label: "NumberInput",
      knobs: [
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
        { kind: "boolean", name: "fullWidth", label: "fullWidth", defaultValue: true },
        { kind: "string", name: "placeholder", label: "placeholder", defaultValue: "0" },
        { kind: "string", name: "value", label: "value", defaultValue: "12" },
        { kind: "string", name: "step", label: "step", defaultValue: "1" },
        { kind: "string", name: "min", label: "min", defaultValue: "" },
        { kind: "string", name: "max", label: "max", defaultValue: "" },
      ],
      applyOverride: (state, value: KnobValues) => ({
        ...state,
        size: String(value.size ?? "regular") as InputSize,
        inputStyle: String(value.inputStyle ?? "default") as NumberInputStyle,
        allRound: Boolean(value.allRound),
        showControls: Boolean(value.showControls),
        disabled: Boolean(value.disabled),
        error: Boolean(value.error),
        fullWidth: Boolean(value.fullWidth ?? true),
        placeholder: String(value.placeholder ?? "0"),
        value: String(value.value ?? ""),
        step: String(value.step ?? "1"),
        min: String(value.min ?? ""),
        max: String(value.max ?? ""),
      }),
    },
    {
      debugId: "number-input.left-icon",
      label: "Left icon",
      parent: "number-input",
      knobs: iconRoleKnobs("leftIcon", false, "GeneralSetting"),
      applyOverride: (state, value) => applyIconRoleOverride(state, value, "leftIcon"),
    },
    {
      debugId: "number-input.field",
      label: "Field",
      parent: "number-input",
      knobs: [],
      applyOverride: (state) => state,
    },
    {
      debugId: "number-input.right-icon",
      label: "Right icon",
      parent: "number-input",
      knobs: iconRoleKnobs("rightIcon", false, "GeneralSetting"),
      applyOverride: (state, value) => applyIconRoleOverride(state, value, "rightIcon"),
    },
  ],
  renderPreview: (state) => {
    const left = readIconRoleFromState(state, "leftIcon", false);
    const right = readIconRoleFromState(state, "rightIcon", false);
    const step = parseOptionalNumber(state.step) ?? 1;
    const min = parseOptionalNumber(state.min);
    const max = parseOptionalNumber(state.max);

    return (
      <NumberInput
        className="max-w-sm"
        size={state.size}
        allRound={state.allRound}
        inputStyle={state.inputStyle}
        showControls={state.showControls}
        disabled={state.disabled}
        error={state.error}
        fullWidth={state.fullWidth}
        placeholder={state.placeholder}
        value={state.value}
        step={step}
        min={min}
        max={max}
        onChange={() => undefined}
        leftIcon={renderDebugIcon(
          left.visible,
          left.iconName,
          left.thickness,
          left.mode,
          left.biggerSize,
          left.level
        )}
        rightIcon={renderDebugIcon(
          right.visible,
          right.iconName,
          right.thickness,
          right.mode,
          right.biggerSize,
          right.level
        )}
      />
    );
  },
};
