/**
 * Modal / Segmentator / Switch exist at runtime in @aviala-design/spiral@0.0.2
 * but are missing from the published TypeScript declarations.
 */
import type { ComponentType, ReactNode } from "react";
import * as Spiral from "@aviala-design/spiral";

type AnyProps = Record<string, unknown> & { children?: ReactNode; className?: string };

const S = Spiral as unknown as Record<string, ComponentType<AnyProps>>;

export const Modal = S.Modal;
export const ModalContent = S.ModalContent;
export const ModalHeader = S.ModalHeader;
export const ModalHeaderText = S.ModalHeaderText;
export const ModalTitle = S.ModalTitle;
export const ModalDescription = S.ModalDescription;
export const ModalBody = S.ModalBody;
export const ModalFooter = S.ModalFooter;
export const ModalClose = S.ModalClose;
export const SegmentatorGroup = S.SegmentatorGroup;
export const SegmentatorItem = S.SegmentatorItem;
export const Switch = S.Switch;
export const Tooltip = S.Tooltip;
export const TooltipTrigger = S.TooltipTrigger;
export const TooltipContent = S.TooltipContent;
export const TooltipProvider = S.TooltipProvider;
