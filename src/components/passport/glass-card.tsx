"use client";

import { useRef, useState } from "react";
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (tilt) {
      const rx = (x / rect.width - 0.5) * 3;
      const ry = -(y / rect.height - 0.5) * 3;
      ref.current.style.transform = `perspective(800px) rotateY(${rx}deg) rotateX(${ry}deg)`;
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (tilt && ref.current) {
      ref.current.style.transform =
        "perspective(800px) rotateY(0deg) rotateX(0deg)";
    }
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-card border border-border/50",
        "shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]",
        "hover:shadow-[0_4px_16px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.05)]",
        "transition-all duration-300 ease-out",
        className
      )}
    >
      {/* Gradient border glow on hover */}
      {accentColor && (
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl transition-all duration-300"
          style={{
            backgroundColor: accentColor,
            boxShadow: isHovered
              ? `0 2px 12px ${accentColor}40, 0 0 20px ${accentColor}15`
              : "none",
          }}
        />
      )}

      {/* Spotlight cursor follow effect */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px z-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, ${accentColor ?? "var(--primary)"}08, transparent 60%)`,
          }}
        />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
