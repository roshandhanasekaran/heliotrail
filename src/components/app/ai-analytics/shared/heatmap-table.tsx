"use client";

interface HeatmapMetric {
  label: string;
  value: number;
}

interface HeatmapRow {
  moduleId: string;
  metrics: HeatmapMetric[];
}

interface HeatmapTableProps {
  rows: HeatmapRow[];
  metricLabels: string[];
  greenThreshold?: number;
  yellowThreshold?: number;
  onModuleClick?: (moduleId: string) => void;
}

function getCellColor(
  value: number,
  greenThreshold: number,
  yellowThreshold: number
): { bg: string; text: string } {
  if (value >= greenThreshold) {
    return { bg: "#DCFCE7", text: "#166534" };
  }
  if (value >= yellowThreshold) {
    return { bg: "#FEF3C7", text: "#92400E" };
  }
  return { bg: "#FEE2E2", text: "#B91C1C" };
}

export function HeatmapTable({
  rows,
  metricLabels,
  greenThreshold = 85,
  yellowThreshold = 70,
  onModuleClick,
}: HeatmapTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-[#D9D9D9] text-xs">
        <thead>
          <tr className="bg-[#F2F2F2]">
            <th className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-[#737373]">
              Module
            </th>
            {metricLabels.map((label) => (
              <th
                key={label}
                className="text-center px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-[#737373]"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.moduleId}
              className={i % 2 === 1 ? "bg-[#FAFAFA]" : "bg-white"}
            >
              <td className="px-3 py-2">
                {onModuleClick ? (
                  <button
                    type="button"
                    onClick={() => onModuleClick(row.moduleId)}
                    className="font-mono text-[10px] font-bold text-[#0D0D0D] underline decoration-dashed underline-offset-2 hover:text-[#22C55E] transition-colors cursor-pointer"
                  >
                    {row.moduleId}
                  </button>
                ) : (
                  <span className="font-mono text-[10px] font-bold text-[#0D0D0D]">
                    {row.moduleId}
                  </span>
                )}
              </td>
              {row.metrics.map((metric) => {
                const colors = getCellColor(
                  metric.value,
                  greenThreshold,
                  yellowThreshold
                );
                return (
                  <td key={metric.label} className="px-3 py-2 text-center">
                    <span
                      className="inline-block px-2 py-0.5 font-mono text-[10px] font-semibold"
                      style={{
                        backgroundColor: colors.bg,
                        color: colors.text,
                      }}
                    >
                      {metric.value.toFixed(1)}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
