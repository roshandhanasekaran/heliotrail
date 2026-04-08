"use client";

import { motion, useSpring, useTransform, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface RadialGaugeProps {
  value: number;
  max?: number;
  label: string;
  unit?: string;
  size?: number;
  color?: string;
  glowColor?: string;
  className?: string;
}

export function RadialGauge({
  value,
  max = 100,
  label,
  unit = "%",
  size = 160,
  color = "#6366f1",
  className,
}: RadialGaugeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(value / max, 1);

  const spring = useSpring(0, { duration: 1800 });
  const displayValue = useTransform(spring, (v) => Math.round(v));
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (inView) spring.set(value);
  }, [inView, spring, value]);

  useEffect(() => {
    return displayValue.on("change", (v) => setDisplay(String(v)));
  }, [displayValue]);

  const id = `gauge-${label.replace(/\s/g, "-")}`;

  return (
    <div ref={ref} className={cn("flex flex-col items-center", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full -rotate-90"
        >
          <defs>
            <linearGradient id={`${id}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={color} stopOpacity="0.5" />
            </linearGradient>
          </defs>

          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/60"
          />

          {/* Animated arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${id}-grad)`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={
              inView
                ? { strokeDashoffset: circumference * (1 - percentage) }
                : {}
            }
            transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
          />
        </svg>

        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl font-bold tabular-nums"
            style={{ color }}
          >
            {display}
          </span>
          <span className="text-xs text-muted-foreground -mt-0.5">{unit}</span>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
