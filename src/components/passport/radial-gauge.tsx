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
    <div ref={ref} className={cn("flex flex-col items-center group", className)}>
      <div
        className="relative rounded-full p-3 transition-all duration-500 group-hover:shadow-lg"
        style={{
          width: size + 24,
          height: size + 24,
          background: `radial-gradient(circle at 50% 50%, ${color}08 0%, transparent 70%)`,
        }}
      >
        {/* Outer glow ring on hover */}
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            boxShadow: `0 0 30px ${color}15, inset 0 0 20px ${color}08`,
          }}
        />
        <div className="relative" style={{ width: size, height: size }}>
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="w-full h-full -rotate-90"
          >
            <defs>
              <linearGradient id={`${id}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={color} />
                <stop offset="100%" stopColor={color} stopOpacity="0.4" />
              </linearGradient>
              <filter id={`${id}-glow`}>
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-border/40"
            />

            {/* Animated arc with glow */}
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={`url(#${id}-grad)`}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circumference}
              filter={`url(#${id}-glow)`}
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
      </div>
      <p className="mt-1 text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
