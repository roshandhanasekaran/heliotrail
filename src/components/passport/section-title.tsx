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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("mb-8", className)}
    >
      <div className="flex items-center gap-3">
        <div
          className="h-6 w-1"
          style={{ backgroundColor: accentColor }}
        />
        <h2 className="text-xl font-bold uppercase tracking-[0.1em] sm:text-2xl">
          {title}
        </h2>
      </div>
      {description && (
        <p className="mt-1.5 pl-[1rem] text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </motion.div>
  );
}
