export type ColorFormat = "hex" | "rgb" | "hsl";

export type PaletteKind = "color" | "neutral";

export type PaletteItem = {
  id: string;
  name: string;
  caption: string;
  color: string;
  kind: PaletteKind;
  steps: number;
  curveGamma: number;
  protectHues: boolean;
  /** 0–2, matches @aviala-design/color protectHueStrength */
  protectHueStrength: number;
  asTheme: boolean;
  useSystemConfig: boolean;
  useSystemName: boolean;
};

export const FORMAT_OPTIONS: { value: ColorFormat; label: string }[] = [
  { value: "hex", label: "HEX" },
  { value: "rgb", label: "RGB" },
  { value: "hsl", label: "HSL" },
];

export const SYSTEM_STEPS = 12;
export const DEFAULT_CURVE_GAMMA = 1;
export const CURVE_GAMMA_MIN = 0.5;
export const CURVE_GAMMA_MAX = 3;
export const DEFAULT_PROTECT_HUE_STRENGTH = 2;
export const PROTECT_HUE_STRENGTH_MIN = 0;
export const PROTECT_HUE_STRENGTH_MAX = 2;

export const SYSTEM_COLOR_NAMES = [
  { value: "success", label: "success" },
  { value: "warning", label: "warning" },
  { value: "error", label: "error" },
  { value: "info", label: "info" },
  { value: "primary", label: "primary" },
] as const;

export const SYSTEM_NEUTRAL_NAMES = [
  { value: "neutral", label: "neutral" },
] as const;

export const DEFAULT_PALETTE_DRAFT: Omit<PaletteItem, "id"> = {
  name: "",
  caption: "自定义色",
  color: "#FF5532",
  kind: "color",
  steps: SYSTEM_STEPS,
  curveGamma: DEFAULT_CURVE_GAMMA,
  protectHues: true,
  protectHueStrength: DEFAULT_PROTECT_HUE_STRENGTH,
  asTheme: false,
  useSystemConfig: false,
  useSystemName: false,
};

export const DEFAULT_PALETTES: PaletteItem[] = [
  {
    id: "success",
    name: "success",
    caption: "表意色 成功",
    color: "#70B450",
    kind: "color",
    steps: SYSTEM_STEPS,
    curveGamma: DEFAULT_CURVE_GAMMA,
    protectHues: true,
    protectHueStrength: DEFAULT_PROTECT_HUE_STRENGTH,
    asTheme: false,
    useSystemConfig: true,
    useSystemName: true,
  },
  {
    id: "primary",
    name: "primary",
    caption: "主题色",
    color: "#FF5532",
    kind: "color",
    steps: SYSTEM_STEPS,
    curveGamma: DEFAULT_CURVE_GAMMA,
    protectHues: true,
    protectHueStrength: DEFAULT_PROTECT_HUE_STRENGTH,
    asTheme: true,
    useSystemConfig: true,
    useSystemName: true,
  },
];
