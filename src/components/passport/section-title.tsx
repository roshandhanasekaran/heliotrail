"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  description?: string;
  accentColor?: string;
  className?: string;
}

export function SectionTitle({
  title,
  description,
  accentColor = "#4caf50",
  className,
}: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("mb-8", className)}
    >
      <div className="flex items-center gap-3">
        <div
          className="h-8 w-1 rounded-full"
          style={{
            background: `linear-gradient(to bottom, ${accentColor}, ${accentColor}40)`,
            boxShadow: `0 0 12px ${accentColor}30`,
          }}
        />
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>
      </div>
      {description && (
        <p className="mt-2 pl-[1.75rem] text-sm text-muted-foreground/80">
          {description}
        </p>
      )}
    </motion.div>
  );
}
