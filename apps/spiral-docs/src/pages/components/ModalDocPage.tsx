import { SymbolInformationCircle } from "@aviala-design/icons";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeaderText,
  ModalTrigger,
} from "@aviala-design/spiral";
import { ComponentDocView } from "../../components/ComponentDocView";
import { buildModalCode, modalKnobs, modalLiveCode } from "../../demos/component-demos";

export function ModalDocPage() {
  return (
    <ComponentDocView
      component="Modal"
      scope={{
        Modal,
        ModalTrigger,
        ModalContent,
        ModalHeaderText,
        ModalBody,
        ModalFooter,
        Button,
        SymbolInformationCircle,
      }}
      fallback={{
        title: "Modal 模态框",
        description: "Figma Information Display → Modal。用于需要用户确认或输入的阻断式对话框。",
        prose: "基于 Radix Dialog，包含 Header、Body、Footer 分区，支持默认与 large 宽度。",
        liveCode: modalLiveCode,
        knobs: modalKnobs,
        buildCode: buildModalCode,
      }}
    />
  );
}
