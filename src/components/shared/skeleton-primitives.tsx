import { Skeleton } from "@/components/ui/skeleton";

/** Small KPI card skeleton — number + label */
export function SkeletonKpi() {
  return (
    <div className="clean-card p-5 space-y-3">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-7 w-28" />
      <Skeleton className="h-2 w-16" />
    </div>
  );
}

/** Card skeleton with N lines of text */
export function SkeletonCard({ lines = 4 }: { lines?: number }) {
  return (
    <div className="clean-card p-5 space-y-3">
      <Skeleton className="h-4 w-32" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-3"
          style={{ width: `${70 + ((i * 17) % 30)}%` }}
        />
      ))}
    </div>
  );
}

/** Table skeleton — header row + N data rows */
export function SkeletonTable({ rows = 8, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="clean-card overflow-hidden">
      {/* Header */}
      <div className="flex gap-4 border-b border-border px-5 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="flex gap-4 border-b border-border px-5 py-3 last:border-b-0"
        >
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton
              key={c}
              className="h-3 flex-1"
              style={{ opacity: 1 - r * 0.08 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Chart placeholder skeleton */
export function SkeletonChart({ height = "h-48" }: { height?: string }) {
  return (
    <div className="clean-card p-5 space-y-3">
      <Skeleton className="h-4 w-36" />
      <Skeleton className={`${height} w-full`} />
    </div>
  );
}
