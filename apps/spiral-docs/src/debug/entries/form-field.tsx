import {
  FormField,
  Input,
  NumberInput,
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@aviala-design/spiral";

import type { KnobValues } from "../../components/DemoKnobs";
import { spiralDebugProps, type DebugComponentEntry } from "../types";

type ControlKind = "input" | "textarea" | "number-input" | "select";

export type FormFieldDebugState = {
  label: string;
  description: string;
  error: string;
  info: string;
  required: boolean;
  control: ControlKind;
  /** Explicit control `error` override (undefined = inherit FormField tip). */
  controlError: "inherit" | "true" | "false";
  placeholder: string;
  value: string;
};

const initialState: FormFieldDebugState = {
  label: "Username",
  description: "Your public display name.",
  error: "",
  info: "",
  required: false,
  control: "input",
  controlError: "inherit",
  placeholder: "aviala",
  value: "",
};

function resolveControlError(
  mode: FormFieldDebugState["controlError"]
): boolean | undefined {
  if (mode === "inherit") return undefined;
  return mode === "true";
}

function renderControl(state: FormFieldDebugState) {
  const error = resolveControlError(state.controlError);
  const noopChange = () => undefined;
  switch (state.control) {
    case "textarea":
      return (
        <Textarea
          placeholder={state.placeholder}
          value={state.value}
          onChange={noopChange}
          error={error}
          rows={3}
        />
      );
    case "number-input":
      return (
        <NumberInput
          placeholder={state.placeholder}
          value={state.value === "" ? "" : Number(state.value)}
          onChange={noopChange}
          error={error}
        />
      );
    case "select":
      return (
        <Select value={state.value || undefined}>
          <SelectTrigger placeholder={state.placeholder} error={error} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItemGroup>
              <SelectItem value="alpha">Alpha</SelectItem>
              <SelectItem value="beta">Beta</SelectItem>
            </SelectItemGroup>
          </SelectContent>
        </Select>
      );
    case "input":
    default:
      return (
        <Input
          placeholder={state.placeholder}
          value={state.value}
          onChange={noopChange}
          error={error}
        />
      );
  }
}

export const formFieldEntry: DebugComponentEntry<FormFieldDebugState> = {
  id: "form-field",
  label: "FormField",
  description: "System Composition → Form — tip syncs to nested control error state",
  initialState,
  nodes: [
    {
      debugId: "form-field",
      label: "FormField",
      knobs: [
        { kind: "string", name: "label", label: "label", defaultValue: "Username" },
        {
          kind: "string",
          name: "description",
          label: "description",
          defaultValue: "Your public display name.",
        },
        { kind: "string", name: "error", label: "error tip", defaultValue: "" },
        { kind: "string", name: "info", label: "info tip", defaultValue: "" },
        { kind: "boolean", name: "required", label: "required", defaultValue: false },
        {
          kind: "select",
          name: "control",
          label: "control",
          options: ["input", "textarea", "number-input", "select"],
          defaultValue: "input",
        },
        {
          kind: "select",
          name: "controlError",
          label: "control error",
          options: ["inherit", "true", "false"],
          defaultValue: "inherit",
        },
        { kind: "string", name: "placeholder", label: "placeholder", defaultValue: "aviala" },
        { kind: "string", name: "value", label: "value", defaultValue: "" },
      ],
      applyOverride: (state, value: KnobValues) => ({
        ...state,
        label: String(value.label ?? state.label),
        description: String(value.description ?? state.description),
        error: String(value.error ?? state.error),
        info: String(value.info ?? state.info),
        required: Boolean(value.required),
        control: (value.control as ControlKind) ?? state.control,
        controlError:
          (value.controlError as FormFieldDebugState["controlError"]) ?? state.controlError,
        placeholder: String(value.placeholder ?? state.placeholder),
        value: String(value.value ?? state.value),
      }),
    },
  ],
  renderPreview: (state) => {
    const errorTip = state.error.trim() || undefined;
    const infoTip = state.info.trim() || undefined;
    return (
      <div {...spiralDebugProps("form-field")} className="w-full max-w-sm">
        <FormField
          label={state.label}
          description={state.description || undefined}
          error={errorTip}
          info={infoTip}
          required={state.required}
        >
          {renderControl(state)}
        </FormField>
      </div>
    );
  },
};
