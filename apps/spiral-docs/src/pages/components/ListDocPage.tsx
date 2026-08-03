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
        description: "用于展示可点选或可配置的条目列表。",
        prose: "适合设置项、菜单列表、账户选项等一行一项、可继续操作的场景。",
        liveCode: listLiveCode,
        knobs: listKnobs,
        buildCode: buildListCode,
      }}
    />
  );
}
