import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonTable } from "@/components/shared/skeleton-primitives";

export default function Loading() {
  return (
    <div className="space-y-5 p-1">
      <div className="space-y-1">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>
      <SkeletonTable rows={6} cols={5} />
    </div>
  );
}
