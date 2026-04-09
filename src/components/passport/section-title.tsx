import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SectionTitleProps {
  title: string;
  description?: string;
  accentColor?: string;
  icon?: LucideIcon;
  className?: string;
}

export function SectionTitle({
  title,
  description,
  icon: Icon,
  className,
}: SectionTitleProps) {
  return (
    <div className={cn("mb-8", className)}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center bg-[#F2F2F2]">
            <Icon className="h-4 w-4 text-[#0D0D0D]" />
          </div>
        )}
        <h2 className="text-xl font-bold uppercase tracking-wide text-[#0D0D0D] sm:text-2xl">
          {title}
        </h2>
      </div>

      {description && (
        <p className="mt-2 text-sm text-[#737373]">
          {description}
        </p>
      )}

      <div className="mt-4 h-px w-full bg-[#D9D9D9]" />
    </div>
  );
}
