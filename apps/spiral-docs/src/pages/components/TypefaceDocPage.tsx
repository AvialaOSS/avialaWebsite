import { Typeface } from "@aviala-design/spiral";
import { ComponentDocView } from "../../components/ComponentDocView";
import {
  buildTypefaceCode,
  typefaceKnobs,
  typefaceLiveCode,
} from "../../demos/component-demos";

export function TypefaceDocPage() {
  return (
    <ComponentDocView
      component="Typeface"
      scope={{ Typeface }}
      fallback={{
        title: "Typeface 字体组合",
        description: "Figma System Composition → Typeface。用于多行文字层级组合。",
        prose: "通过 content 预设控制主 / 副 / 辅助文字组合，也可使用 TypefacePair 快捷封装。",
        liveCode: typefaceLiveCode,
        knobs: typefaceKnobs,
        buildCode: buildTypefaceCode,
      }}
    />
  );
}
