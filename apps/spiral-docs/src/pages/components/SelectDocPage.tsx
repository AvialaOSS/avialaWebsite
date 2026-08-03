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
        description: "用于从预设列表中选出一项。",
        prose: "适合国家、状态、分类等选项固定、占用空间不宜过大的选择场景。",
        liveCode: selectLiveCode,
        knobs: selectKnobs,
        buildCode: buildSelectCode,
      }}
    />
  );
}
