import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectTrigger,
  SelectValue,
} from "@aviala-design/spiral";
import { ComponentDocView } from "../../components/ComponentDocView";
import { buildSelectCode, selectKnobs, selectLiveCode } from "../../demos/component-demos";

export function SelectDocPage() {
  return (
    <ComponentDocView
      component="Select"
      scope={{
        Select,
        SelectTrigger,
        SelectValue,
        SelectContent,
        SelectItemGroup,
        SelectItem,
      }}
      fallback={{
        title: "Select 选择器",
        description: "下拉选择，支持分组、多种 item 功能变体（radio、form-radio 等）。",
        prose: "基于 Radix Select 的组合式 API。可在 Monaco 编辑器中调整组合式 JSX 结构。",
        liveCode: selectLiveCode,
        knobs: selectKnobs,
        buildCode: buildSelectCode,
      }}
    />
  );
}
