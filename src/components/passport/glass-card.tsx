import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "dashed";
}

export function GlassCard({
  children,
  className,
  variant = "default",
}: GlassCardProps) {
  return (
    <div
      className={cn(
        variant === "dashed" ? "dashed-card" : "clean-card",
        className
      )}
    >
      {children}
    </div>
  );
}
