import { DirectionArrowLeft, GeneralSetting, SymbolMore, UsersUserCircle } from "@aviala-design/icons";
import {
  Avatar,
  Badge,
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbEllipsisItem,
  BreadcrumbItem,
  BreadcrumbSeparator,
  Button,
  Card,
  CardBody,
  CardBottom,
  CardHead,
  Pagehead,
  Pagination,
  Progress,
  Scroll,
  ScrollPicker,
  ScrollPickerColumn,
  Slider,
  Steps,
  StepsItem,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Tag,
  Upload,
} from "@aviala-design/spiral";
import { useState } from "react";

import type { KnobDef, KnobValues } from "../../components/DemoKnobs";
import { ComponentDocView } from "../../components/ComponentDocView";
import {
  avatarKnobs,
  avatarLiveCode,
  badgeKnobs,
  badgeLiveCode,
  breadcrumbKnobs,
  breadcrumbLiveCode,
  buildAvatarCode,
  buildBadgeCode,
  buildBreadcrumbCode,
  buildCardCode,
  buildPageheadCode,
  buildPaginationCode,
  buildProgressCode,
  buildScrollCode,
  buildScrollPickerCode,
  buildSliderCode,
  buildStepsCode,
  buildTableCode,
  buildTagCode,
  buildUploadCode,
  cardKnobs,
  cardLiveCode,
  pageheadKnobs,
  pageheadLiveCode,
  paginationKnobs,
  paginationLiveCode,
  progressKnobs,
  progressLiveCode,
  scrollKnobs,
  scrollLiveCode,
  scrollPickerKnobs,
  scrollPickerLiveCode,
  sliderKnobs,
  sliderLiveCode,
  stepsKnobs,
  stepsLiveCode,
  tableKnobs,
  tableLiveCode,
  tagKnobs,
  tagLiveCode,
  uploadKnobs,
  uploadLiveCode,
} from "../../demos/component-demos";

function DocShell({
  title,
  description,
  prose,
  componentKey,
  scope,
  knobs,
  buildCode,
  liveCode,
}: {
  title: string;
  description: string;
  prose: string;
  componentKey: string;
  scope: Record<string, unknown>;
  knobs: KnobDef[];
  buildCode: (values: KnobValues) => string;
  liveCode: string;
}) {
  return (
    <ComponentDocView
      component={componentKey}
      scope={scope}
      fallback={{
        title,
        description,
        prose,
        propsKey: componentKey,
        liveCode,
        knobs,
        buildCode,
      }}
    />
  );
}

export function BadgeDocPage() {
  return (
    <DocShell
      title="Badge 徽章"
      description="用于在名称旁标注数量、状态或类别。"
      prose="适合未读数、新消息、状态角标等需要一眼扫到的轻量标记。"
      componentKey="Badge"
      scope={{ Badge }}
      knobs={badgeKnobs}
      buildCode={buildBadgeCode}
      liveCode={badgeLiveCode}
    />
  );
}

export function AvatarDocPage() {
  return (
    <DocShell
      title="Avatar 头像"
      description="用于展示用户或对象的身份形象。"
      prose="适合列表、评论、个人资料等需要快速辨认是谁的场景。"
      componentKey="Avatar"
      scope={{ Avatar, UsersUserCircle }}
      knobs={avatarKnobs}
      buildCode={buildAvatarCode}
      liveCode={avatarLiveCode}
    />
  );
}

export function TagDocPage() {
  return (
    <DocShell
      title="Tag 标签"
      description="用于标记分类、属性或可移除的关键词。"
      prose="适合筛选标签、人物标签、已选条件等需要成组展示并可去掉的场景。"
      componentKey="Tag"
      scope={{ Tag }}
      knobs={tagKnobs}
      buildCode={buildTagCode}
      liveCode={tagLiveCode}
    />
  );
}

export function ProgressDocPage() {
  return (
    <DocShell
      title="Progress 进度"
      description="用于展示任务或流程完成到哪一步。"
      prose="适合上传进度、加载百分比、流程完成度等需要看得见进展的场景。"
      componentKey="Progress"
      scope={{ Progress }}
      knobs={progressKnobs}
      buildCode={buildProgressCode}
      liveCode={progressLiveCode}
    />
  );
}

export function ScrollDocPage() {
  return (
    <DocShell
      title="Scroll 滚动条"
      description="用于在有限区域内滚动查看溢出内容。"
      prose="适合侧栏、面板、长列表等容器高度固定但仍有更多内容的场景。"
      componentKey="Scroll"
      scope={{ Scroll }}
      knobs={scrollKnobs}
      buildCode={buildScrollCode}
      liveCode={scrollLiveCode}
    />
  );
}

export function SliderDocPage() {
  return (
    <DocShell
      title="Slider 滑块"
      description="用于在连续范围内拖动选定数值。"
      prose="适合音量、亮度、价格区间等用拖动比键盘输入更直观的调节场景。"
      componentKey="Slider"
      scope={{ Slider }}
      knobs={sliderKnobs}
      buildCode={buildSliderCode}
      liveCode={sliderLiveCode}
    />
  );
}

export function UploadDocPage() {
  return (
    <DocShell
      title="Upload 上传"
      description="用于选择并上传本地文件。"
      prose="适合头像、附件、导入数据等需要把文件交给系统的场景。"
      componentKey="Upload"
      scope={{ Upload }}
      knobs={uploadKnobs}
      buildCode={buildUploadCode}
      liveCode={uploadLiveCode}
    />
  );
}

export function ScrollPickerDocPage() {
  return (
    <DocShell
      title="ScrollPicker 滚轮选择"
      description="用于通过滚轮点选离散选项。"
      prose="适合时间、地区代码等选项较多、用滚轮比点选列表更顺手的场景。"
      componentKey="ScrollPicker"
      scope={{ ScrollPicker, ScrollPickerColumn, useState }}
      knobs={scrollPickerKnobs}
      buildCode={buildScrollPickerCode}
      liveCode={scrollPickerLiveCode}
    />
  );
}

export function BreadcrumbDocPage() {
  return (
    <DocShell
      title="Breadcrumb 面包屑"
      description="用于展示当前位置，并支持回到上级路径。"
      prose="适合多层页面结构，帮助用户理解自己在哪、如何返回。"
      componentKey="Breadcrumb"
      scope={{
        Breadcrumb,
        BreadcrumbItem,
        BreadcrumbSeparator,
        BreadcrumbEllipsis,
        BreadcrumbEllipsisItem,
        useState,
      }}
      knobs={breadcrumbKnobs}
      buildCode={buildBreadcrumbCode}
      liveCode={breadcrumbLiveCode}
    />
  );
}

export function PageheadDocPage() {
  return (
    <DocShell
      title="Pagehead 页头"
      description="用于页面顶部交代标题、上下文与主要操作。"
      prose="适合详情页、列表页开头，把面包屑、说明和关键按钮收在页眉区域。"
      componentKey="Pagehead"
      scope={{
        Pagehead,
        Breadcrumb,
        BreadcrumbItem,
        BreadcrumbSeparator,
        Button,
        DirectionArrowLeft,
      }}
      knobs={pageheadKnobs}
      buildCode={buildPageheadCode}
      liveCode={pageheadLiveCode}
    />
  );
}

export function StepsDocPage() {
  return (
    <DocShell
      title="Steps 步骤条"
      description="用于展示多步骤流程当前走到哪。"
      prose="适合注册向导、结账流程、配置向导等需要按阶段推进的场景。"
      componentKey="Steps"
      scope={{ Steps, StepsItem }}
      knobs={stepsKnobs}
      buildCode={buildStepsCode}
      liveCode={stepsLiveCode}
    />
  );
}

export function PaginationDocPage() {
  return (
    <DocShell
      title="Pagination 分页"
      description="用于在大量数据中翻页浏览。"
      prose="适合表格、搜索结果、内容列表等一屏装不下、需要按页查看的场景。"
      componentKey="Pagination"
      scope={{ Pagination, useState }}
      knobs={paginationKnobs}
      buildCode={buildPaginationCode}
      liveCode={paginationLiveCode}
    />
  );
}

export function CardDocPage() {
  return (
    <DocShell
      title="Card 卡片"
      description="用于把一组相关内容收成可浏览的信息块。"
      prose="适合首页模块、设置分组、内容摘要等需要标题、正文与操作落在同一视觉区块的场景。"
      componentKey="Card"
      scope={{ Card, CardHead, CardBody, CardBottom }}
      knobs={cardKnobs}
      buildCode={buildCardCode}
      liveCode={cardLiveCode}
    />
  );
}

export function TableDocPage() {
  return (
    <DocShell
      title="Table 表格"
      description="用于行列对照地浏览结构化数据。"
      prose="适合订单、成员、日志等需要多字段对齐比较的数据场景。"
      componentKey="Table"
      scope={{ Table, TableRow, TableHead, TableCell, Avatar, Button, GeneralSetting, SymbolMore }}
      knobs={tableKnobs}
      buildCode={buildTableCode}
      liveCode={tableLiveCode}
    />
  );
}
