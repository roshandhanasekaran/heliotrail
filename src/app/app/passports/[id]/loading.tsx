import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonKpi, SkeletonCard } from "@/components/shared/skeleton-primitives";

export default function Loading() {
  return (
    <div className="space-y-5 p-1">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-7 w-64" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SkeletonKpi />
        <SkeletonKpi />
        <SkeletonKpi />
        <SkeletonKpi />
      </div>
      <SkeletonCard lines={6} />
      <SkeletonCard lines={4} />
    </div>
  );
}
