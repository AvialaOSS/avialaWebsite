/**
 * Optional Spiral APIs added in later minors (e.g. 2.6.0).
 * Versioned docs builds pin older `@aviala-design/spiral` packages that lack
 * these exports — use namespace access so Rollup does not fail on missing names.
 */
import * as Spiral from "@aviala-design/spiral";
import {
  createElement,
  Fragment,
  type ComponentType,
  type PropsWithChildren,
  type ReactNode,
} from "react";

type Direction = "ltr" | "rtl";

type LocaleLike = {
  code: string;
  [key: string]: unknown;
};

type ConfigProviderProps = PropsWithChildren<{
  direction?: Direction;
  locale?: LocaleLike;
  syncDocumentDir?: boolean;
}>;

type LocaleProviderProps = PropsWithChildren<{
  locale?: LocaleLike;
}>;

const Passthrough = ({ children }: PropsWithChildren) =>
  createElement(Fragment, null, children);

const spiral = Spiral as typeof Spiral & {
  ConfigProvider?: ComponentType<ConfigProviderProps>;
  LocaleProvider?: ComponentType<LocaleProviderProps>;
  zhCN?: LocaleLike;
  enUS?: LocaleLike;
  Tab?: ComponentType<Record<string, unknown>>;
  TabItem?: ComponentType<Record<string, unknown>>;
};

export const spiralHasLocaleRuntime = Boolean(
  spiral.ConfigProvider && spiral.LocaleProvider && spiral.zhCN && spiral.enUS,
);

export const spiralHasTab = Boolean(spiral.Tab && spiral.TabItem);

export const ConfigProvider =
  spiral.ConfigProvider ??
  (({ children }: ConfigProviderProps) => Passthrough({ children }));

export const LocaleProvider =
  spiral.LocaleProvider ??
  (({ children }: LocaleProviderProps) => Passthrough({ children }));

export const zhCN: LocaleLike = spiral.zhCN ?? { code: "zh-CN" };
export const enUS: LocaleLike = spiral.enUS ?? { code: "en-US" };

export const Tab = spiral.Tab;
export const TabItem = spiral.TabItem;

export type { Direction, LocaleLike, ReactNode };
