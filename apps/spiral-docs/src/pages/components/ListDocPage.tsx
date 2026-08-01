import { GeneralSetting } from "@aviala-design/icons";
import {
  List,
  ListItem,
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectTrigger,
} from "@aviala-design/spiral";
import { ComponentDocView } from "../../components/ComponentDocView";
import { buildListCode, listKnobs, listLiveCode } from "../../demos/component-demos";

export function ListDocPage() {
  return (
    <ComponentDocView
      component="List"
      scope={{
        List,
        ListItem,
        Select,
        SelectTrigger,
        SelectContent,
        SelectItemGroup,
        SelectItem,
        GeneralSetting,
      }}
      fallback={{
        title: "List 列表",
        description: "Figma Structure Navigation → List。用于设置项或表单分组列表。",
        prose: "支持 select / action / switch 尾部类型，以及 shaped / default / none 前置图标样式。",
        liveCode: listLiveCode,
        knobs: listKnobs,
        buildCode: buildListCode,
      }}
    />
  );
}
