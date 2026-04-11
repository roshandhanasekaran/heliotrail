import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonTable } from "@/components/shared/skeleton-primitives";

export default function Loading() {
  return (
    <div className="space-y-5 p-1">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-9 flex-1 max-w-sm" />
        <Skeleton className="h-9 w-24" />
      </div>
      <SkeletonTable rows={10} cols={6} />
    </div>
  );
}
