"use client";

interface BarChartBar {
  label: string;
  value: number;
  color: string;
}

interface BarChartProps {
  bars: BarChartBar[];
  maxValue?: number;
  baselineValue?: number;
  baselineLabel?: string;
  showValues?: boolean;
  valueSuffix?: string;
  barHeight?: number;
}

export function BarChart({
  bars,
  maxValue: maxProp,
  baselineValue,
  baselineLabel,
  showValues = true,
  valueSuffix = "",
  barHeight = 20,
}: BarChartProps) {
  if (bars.length === 0) return null;

  const maxValue = maxProp ?? Math.max(...bars.map((b) => b.value)) * 1.15;
  const gap = 8;
  const labelWidth = 120;
  const valueWidth = 60;

  return (
    <div className="w-full space-y-0">
      {bars.map((bar, i) => {
        const pct = maxValue > 0 ? (bar.value / maxValue) * 100 : 0;
        return (
          <div
            key={i}
            className="flex items-center gap-3"
            style={{ marginBottom: i < bars.length - 1 ? gap : 0 }}
          >
            <span
              className="text-[10px] text-[#737373] truncate shrink-0"
              style={{ width: labelWidth }}
            >
              {bar.label}
            </span>
            <div className="flex-1 relative" style={{ height: barHeight }}>
              {/* Track */}
              <div className="absolute inset-0 bg-[#F2F2F2]" />
              {/* Bar */}
              <div
                className="absolute left-0 top-0 h-full transition-all duration-500"
                style={{
                  width: `${Math.min(pct, 100)}%`,
                  backgroundColor: bar.color,
                }}
              />
              {/* Baseline */}
              {baselineValue != null && maxValue > 0 && (
                <div
                  className="absolute top-0 h-full border-l-2 border-dashed border-[#0D0D0D]"
                  style={{
                    left: `${Math.min((baselineValue / maxValue) * 100, 100)}%`,
                  }}
                />
              )}
            </div>
            {showValues && (
              <span
                className="font-mono text-[10px] font-semibold text-[#0D0D0D] shrink-0 text-right"
                style={{ width: valueWidth }}
              >
                {typeof bar.value === "number" && bar.value % 1 !== 0
                  ? bar.value.toFixed(2)
                  : bar.value}
                {valueSuffix}
              </span>
            )}
          </div>
        );
      })}
      {baselineValue != null && baselineLabel && (
        <div className="flex items-center gap-1.5 mt-2 ml-[132px]">
          <div className="h-0 w-3 border-t-2 border-dashed border-[#0D0D0D]" />
          <span className="text-[9px] text-[#737373]">
            {baselineLabel}
          </span>
        </div>
      )}
    </div>
  );
}
