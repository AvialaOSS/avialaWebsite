import { Feedback } from "@aviala-design/spiral";
import { ComponentDocView } from "../../components/ComponentDocView";
import { buildFeedbackCode, feedbackKnobs, feedbackLiveCode } from "../../demos/component-demos";

export function FeedbackDocPage() {
  return (
    <ComponentDocView
      component="Feedback"
      scope={{ Feedback }}
      fallback={{
        title: "Feedback 反馈",
        description: "Figma Response And Feedback → Feedback。用于轻量 inline 反馈条。",
        prose: "支持 information、warning、wrong、success、normal 类型，以及 default / primary 模式。",
        liveCode: feedbackLiveCode,
        knobs: feedbackKnobs,
        buildCode: buildFeedbackCode,
      }}
    />
  );
}
