import { Navigate, Route, Routes } from "react-router-dom";
import { DocLayout } from "./components/DocLayout";
import { AlertDocPage } from "./pages/components/AlertDocPage";
import { AnchorDocPage } from "./pages/components/AnchorDocPage";
import { ButtonDocPage } from "./pages/components/ButtonDocPage";
import { CascaderDocPage } from "./pages/components/CascaderDocPage";
import { CheckboxDocPage } from "./pages/components/CheckboxDocPage";
import { ColorPickerDocPage } from "./pages/components/ColorPickerDocPage";
import { DatePickerDocPage } from "./pages/components/DatePickerDocPage";
import { TimePickerDocPage } from "./pages/components/TimePickerDocPage";
import { FeedbackDocPage } from "./pages/components/FeedbackDocPage";
import { FormFieldDocPage } from "./pages/components/FormFieldDocPage";
import { InputDocPage } from "./pages/components/InputDocPage";
import { LinkDocPage } from "./pages/components/LinkDocPage";
import { ListDocPage } from "./pages/components/ListDocPage";
import { LoadingDocPage } from "./pages/components/LoadingDocPage";
import { ModalDocPage } from "./pages/components/ModalDocPage";
import { NavigationDocPage } from "./pages/components/NavigationDocPage";
import { TabDocPage } from "./pages/components/TabDocPage";
import { PopoverDocPage } from "./pages/components/PopoverDocPage";
import { RadioDocPage } from "./pages/components/RadioDocPage";
import { SegmentatorDocPage } from "./pages/components/SegmentatorDocPage";
import { SelectDocPage } from "./pages/components/SelectDocPage";
import { SwitchDocPage } from "./pages/components/SwitchDocPage";
import { TextareaDocPage } from "./pages/components/TextareaDocPage";
import { NumberInputDocPage } from "./pages/components/NumberInputDocPage";
import { TooltipDocPage } from "./pages/components/TooltipDocPage";
import { TypefaceDocPage } from "./pages/components/TypefaceDocPage";
import { TypographyDocPage } from "./pages/components/TypographyDocPage";
import {
  AvatarDocPage,
  BadgeDocPage,
  BreadcrumbDocPage,
  CardDocPage,
  PageheadDocPage,
  PaginationDocPage,
  ProgressDocPage,
  ScrollDocPage,
  SliderDocPage,
  StepsDocPage,
  TableDocPage,
  TagDocPage,
  UploadDocPage,
  ScrollPickerDocPage,
} from "./pages/components/RemainingComponentsDocPages";
import { InstallationPage } from "./pages/guides/InstallationPage";
import { IntroductionPage } from "./pages/guides/IntroductionPage";
import { ThemePage } from "./pages/guides/ThemePage";
import { LocalePage } from "./pages/guides/LocalePage";
import { ChangelogPage } from "./pages/guides/ChangelogPage";
import { IconsDocPage } from "./pages/reference/IconsDocPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DocLayout />}>
        <Route index element={<Navigate to="/start/introduction" replace />} />
        <Route path="start/introduction" element={<IntroductionPage />} />
        <Route path="start/installation" element={<InstallationPage />} />
        <Route path="start/theme" element={<ThemePage />} />
        <Route path="start/locale" element={<LocalePage />} />
        <Route path="start/changelog" element={<ChangelogPage />} />

        <Route path="components/information-display/avatar" element={<AvatarDocPage />} />
        <Route path="components/information-display/badge" element={<BadgeDocPage />} />
        <Route path="components/information-display/modal" element={<ModalDocPage />} />
        <Route path="components/information-display/popover" element={<PopoverDocPage />} />
        <Route path="components/information-display/table" element={<TableDocPage />} />
        <Route path="components/information-display/tag" element={<TagDocPage />} />
        <Route path="components/information-display/tooltip" element={<TooltipDocPage />} />

        <Route path="components/information-collect/cascader" element={<CascaderDocPage />} />
        <Route path="components/information-collect/checkbox" element={<CheckboxDocPage />} />
        <Route path="components/information-collect/color-picker" element={<ColorPickerDocPage />} />
        <Route path="components/information-collect/date-picker" element={<DatePickerDocPage />} />
        <Route path="components/information-collect/form-field" element={<FormFieldDocPage />} />
        <Route path="components/information-collect/input" element={<InputDocPage />} />
        <Route path="components/information-collect/number-input" element={<NumberInputDocPage />} />
        <Route path="components/information-collect/radio" element={<RadioDocPage />} />
        <Route path="components/information-collect/scroll-picker" element={<ScrollPickerDocPage />} />
        <Route path="components/information-collect/select" element={<SelectDocPage />} />
        <Route path="components/information-collect/slider" element={<SliderDocPage />} />
        <Route path="components/information-collect/textarea" element={<TextareaDocPage />} />
        <Route path="components/information-collect/time-picker" element={<TimePickerDocPage />} />
        <Route path="components/information-collect/upload" element={<UploadDocPage />} />

        <Route path="components/basic-input/button" element={<ButtonDocPage />} />
        <Route path="components/basic-input/link" element={<LinkDocPage />} />
        <Route path="components/basic-input/segmentator" element={<SegmentatorDocPage />} />
        <Route path="components/basic-input/switch" element={<SwitchDocPage />} />

        <Route path="components/feedback/alert" element={<AlertDocPage />} />
        <Route path="components/feedback/feedback" element={<FeedbackDocPage />} />
        <Route path="components/feedback/loading" element={<LoadingDocPage />} />
        <Route path="components/feedback/progress" element={<ProgressDocPage />} />

        <Route path="components/system-composition/icons" element={<IconsDocPage />} />
        <Route path="components/system-composition/typeface" element={<TypefaceDocPage />} />
        <Route path="components/system-composition/scroll" element={<ScrollDocPage />} />
        <Route path="components/system-composition/typography" element={<TypographyDocPage />} />

        <Route path="components/structure-navigation/anchor" element={<AnchorDocPage />} />
        <Route path="components/structure-navigation/breadcrumb" element={<BreadcrumbDocPage />} />
        <Route path="components/structure-navigation/card" element={<CardDocPage />} />
        <Route path="components/structure-navigation/list" element={<ListDocPage />} />
        <Route path="components/structure-navigation/navigation" element={<NavigationDocPage />} />
        <Route path="components/structure-navigation/pagehead" element={<PageheadDocPage />} />
        <Route path="components/structure-navigation/pagination" element={<PaginationDocPage />} />
        <Route path="components/structure-navigation/steps" element={<StepsDocPage />} />
        <Route path="components/structure-navigation/tab" element={<TabDocPage />} />

        {/* Former category paths */}
        <Route
          path="components/basic-input/input"
          element={<Navigate to="/components/information-collect/input" replace />}
        />
        <Route
          path="components/system-composition/popover"
          element={<Navigate to="/components/information-display/popover" replace />}
        />
        <Route
          path="components/system-composition/tooltip"
          element={<Navigate to="/components/information-display/tooltip" replace />}
        />
        <Route
          path="components/system-composition/form-field"
          element={<Navigate to="/components/information-collect/form-field" replace />}
        />
        <Route
          path="components/system-composition/loading"
          element={<Navigate to="/components/feedback/loading" replace />}
        />
        <Route
          path="components/system-composition/anchor"
          element={<Navigate to="/components/structure-navigation/anchor" replace />}
        />
        <Route
          path="reference/icons"
          element={<Navigate to="/components/system-composition/icons" replace />}
        />

        <Route path="*" element={<Navigate to="/start/introduction" replace />} />
      </Route>
    </Routes>
  );
}
