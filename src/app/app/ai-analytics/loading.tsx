import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard, SkeletonChart } from "@/components/shared/skeleton-primitives";

export default function Loading() {
  return (
    <div className="flex gap-6 p-1">
      <div className="hidden w-56 shrink-0 space-y-3 lg:block">
        <Skeleton className="h-5 w-32" />
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-full" />
        ))}
      </div>
      <div className="flex-1 space-y-5">
        <div className="flex gap-3">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-40" />
        </div>
        <SkeletonChart height="h-64" />
        <div className="grid gap-4 sm:grid-cols-2">
          <SkeletonCard lines={4} />
          <SkeletonCard lines={4} />
        </div>
      </div>
    </div>
  );
}
