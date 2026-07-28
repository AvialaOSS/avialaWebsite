type CurveSliderProps = {
  value: number;
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
  "aria-label"?: string;
};

export function CurveSlider({
  value,
  min,
  max,
  step = 0.05,
  disabled,
  onChange,
  "aria-label": ariaLabel = "色卡曲线",
}: CurveSliderProps) {
  const ratio = max === min ? 0 : (value - min) / (max - min);
  const percent = Math.min(100, Math.max(0, ratio * 100));

  return (
    <div className={`curve-slider ${disabled ? "is-disabled" : ""}`}>
      <div className="curve-slider-track" aria-hidden>
        <div className="curve-slider-fill" style={{ width: `${percent}%` }} />
        <div className="curve-slider-thumb" style={{ left: `${percent}%` }} />
      </div>
      <input
        type="range"
        className="curve-slider-input"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}
