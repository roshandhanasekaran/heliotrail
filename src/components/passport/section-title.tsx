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
  accentColor,
  className,
}: SectionTitleProps) {
  const color = accentColor ?? "var(--primary)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("mb-8", className)}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div
            className="h-7 w-1.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          <div
            className="absolute inset-0 rounded-full blur-sm opacity-50"
            style={{ backgroundColor: color }}
          />
        </div>
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
      </div>
      {description && (
        <p className="mt-2 pl-[1.125rem] text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </motion.div>
  );
}
