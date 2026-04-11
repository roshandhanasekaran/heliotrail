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
  className?: string;
  showTicks?: boolean;
}

export function RadialGauge({
  value,
  max = 100,
  label,
  unit = "%",
  size = 160,
  color = "var(--foreground)",
  className,
  showTicks = true,
}: RadialGaugeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const strokeWidth = 7;
  const radius = (size - 24) / 2;
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

  const tickCount = 24;

  return (
    <div ref={ref} className={cn("flex flex-col items-center", className)}>
      <div
        className="relative"
        style={{
          width: size,
          height: size,
        }}
      >
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full -rotate-90"
        >
          {/* Tick marks */}
          {showTicks && Array.from({ length: tickCount }).map((_, i) => {
            const angle = (i / tickCount) * 360;
            const rads = (angle * Math.PI) / 180;
            const isMajor = i % 6 === 0;
            const tickLen = isMajor ? 8 : 4;
            const outerR = radius + 2;
            const x1 = Math.round((size / 2 + (outerR - tickLen) * Math.cos(rads)) * 100) / 100;
            const y1 = Math.round((size / 2 + (outerR - tickLen) * Math.sin(rads)) * 100) / 100;
            const x2 = Math.round((size / 2 + outerR * Math.cos(rads)) * 100) / 100;
            const y2 = Math.round((size / 2 + outerR * Math.sin(rads)) * 100) / 100;

            return (
              <line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="var(--border)"
                strokeWidth={isMajor ? 1.5 : 0.8}
                strokeLinecap="round"
              />
            );
          })}

          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--muted)"
            strokeWidth={strokeWidth}
          />

          {/* Main animated arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
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

          {/* End dot */}
          {inView && percentage > 0.02 && (
            <motion.circle
              cx={Math.round((size / 2 + radius * Math.cos(2 * Math.PI * percentage - Math.PI / 2)) * 100) / 100}
              cy={Math.round((size / 2 + radius * Math.sin(2 * Math.PI * percentage - Math.PI / 2)) * 100) / 100}
              r={4}
              fill={color}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.6, duration: 0.3 }}
            />
          )}
        </svg>

        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-2xl font-bold tabular-nums tracking-tight text-foreground"
          >
            {display}
          </span>
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider -mt-0.5">
            {unit}
          </span>
        </div>
      </div>

      <p className="mt-2 text-xs font-medium text-muted-foreground tracking-wide">{label}</p>
    </div>
  );
}
