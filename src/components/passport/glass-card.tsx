"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  tilt?: boolean;
  accentColor?: string;
}

export function GlassCard({
  children,
  className,
  tilt = false,
  accentColor,
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!tilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
  };

  const handleMouseLeave = () => {
    if (!tilt || !ref.current) return;
    ref.current.style.transform =
      "perspective(800px) rotateY(0deg) rotateX(0deg)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden border bg-card",
        "shadow-[0_2px_4px_rgba(0,0,0,0.4)]",
        "transition-transform duration-150 ease-out",
        className
      )}
      style={
        accentColor
          ? {
              borderColor: `${accentColor}30`,
              borderLeftWidth: "3px",
              borderLeftColor: accentColor,
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
