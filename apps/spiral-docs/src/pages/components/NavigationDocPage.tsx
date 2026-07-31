import { GeneralCollapseSidebar, GeneralSetting } from "@aviala-design/icons";
import {
  Button,
  Navigation,
  NavigationActions,
  NavigationActionsSlot,
  NavigationBrand,
  NavigationBrandTitle,
  NavigationGroup,
  NavigationItem,
  NavigationItemGroup,
} from "@aviala-design/spiral";
import { ComponentDocView } from "../../components/ComponentDocView";
import {
  buildNavigationCode,
  navigationKnobs,
  navigationLiveCode,
} from "../../demos/component-demos";

export function NavigationDocPage() {
  return (
    <ComponentDocView
      component="Navigation"
      scope={{
        Navigation,
        NavigationBrand,
        NavigationBrandTitle,
        NavigationGroup,
        NavigationItem,
        NavigationItemGroup,
        NavigationActions,
        NavigationActionsSlot,
        Button,
        GeneralSetting,
        GeneralCollapseSidebar,
      }}
      fallback={{
        title: "Navigation 导航",
        description: "Figma Structure Navigation → Navigation。用于侧边栏或顶栏导航结构。",
        prose:
          "支持 vertical / horizontal、default / none 背景与 dividingLine。调参可编辑 Brand、Group items（vertical 下连续 child 会包进 NavigationItemGroup；horizontal 会展平为顶栏 Tab）与 Actions。",
        liveCode: navigationLiveCode,
        knobs: navigationKnobs,
        buildCode: buildNavigationCode,
      }}
    />
  );
}
