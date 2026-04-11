import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "@/components/shared/skeleton-primitives";

export default function Loading() {
  return (
    <div className="flex gap-6 p-1">
      <div className="hidden w-48 shrink-0 space-y-2 lg:block">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
      <div className="flex-1 space-y-5">
        <Skeleton className="h-7 w-48" />
        <SkeletonCard lines={8} />
      </div>
    </div>
  );
}
