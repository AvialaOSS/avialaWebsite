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
        description: "用于承载应用的主导航结构。",
        prose:
          "适合侧边栏、顶栏等需要在多个页面或模块间切换的场景。",
        liveCode: navigationLiveCode,
        knobs: navigationKnobs,
        buildCode: buildNavigationCode,
      }}
    />
  );
}
