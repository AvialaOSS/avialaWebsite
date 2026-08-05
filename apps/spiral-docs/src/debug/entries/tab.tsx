import {
  Tab,
  TabItem,
  type TabBackground,
  type TabStyle,
} from "@aviala-design/spiral";

import type { KnobValues } from "../../components/DemoKnobs";
import {
  applyIconRoleOverride,
  iconRoleKnobs,
  readIconRoleFromState,
  renderDebugIcon,
} from "../icon-knobs";
import { spiralDebugProps, type DebugComponentEntry } from "../types";

export type TabDebugState = {
  value: string;
  style: TabStyle;
  background: TabBackground;
  disabled: boolean;
  showLeftIcon: boolean;
  leftIconName: string;
  leftIconThickness: string;
  leftIconMode: string;
  leftIconBiggerSize: boolean;
  leftIconLevel: string;
};

const initialState: TabDebugState = {
  value: "a",
  style: "default",
  background: "none",
  disabled: false,
  showLeftIcon: true,
  leftIconName: "GeneralSetting",
  leftIconThickness: "Light",
  leftIconMode: "default",
  leftIconBiggerSize: true,
  leftIconLevel: "text",
};

export const tabEntry: DebugComponentEntry<TabDebugState> = {
  id: "tab",
  label: "Tab",
  description: "Figma Structure Navigation → Tab",
  initialState,
  nodes: [
    {
      debugId: "tab",
      label: "Tab",
      knobs: [
        {
          kind: "select",
          name: "value",
          label: "value",
          options: ["a", "b", "c"],
          defaultValue: "a",
        },
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
        { kind: "boolean", name: "disabled", label: "disabled", defaultValue: false },
      ],
      applyOverride: (state, value: KnobValues) => ({
        ...state,
        value: String(value.value ?? "a"),
        style: String(value.style ?? "default") as TabStyle,
        background: String(value.background ?? "none") as TabBackground,
        disabled: Boolean(value.disabled),
      }),
    },
    {
      debugId: "tab.item",
      label: "Item",
      parent: "tab",
      knobs: iconRoleKnobs("leftIcon", true, "GeneralSetting"),
      description: "Icon knobs apply to the first tab item in preview.",
      applyOverride: (state, value) => applyIconRoleOverride(state, value, "leftIcon"),
    },
  ],
  renderPreview: (state) => {
    const left = readIconRoleFromState(state, "leftIcon", true);
    const leftIcon = renderDebugIcon(
      left.visible,
      left.iconName,
      left.thickness,
      left.mode,
      left.biggerSize,
      left.level
    );

    return (
      <div {...spiralDebugProps("tab")}>
        <Tab
          style={state.style}
          background={state.background}
          value={state.value}
          onValueChange={() => undefined}
          disabled={state.disabled}
        >
          <TabItem value="a" leftIcon={leftIcon}>
            Text
          </TabItem>
          <TabItem value="b">Text</TabItem>
          <TabItem value="c">Text</TabItem>
        </Tab>
      </div>
    );
  },
};
