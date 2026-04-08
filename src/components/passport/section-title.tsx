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
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("mb-8", className)}
    >
      <div className="flex items-center gap-3">
        <div
          className="h-6 w-1.5 rounded-full"
          style={{ backgroundColor: accentColor ?? "var(--primary)" }}
        />
        <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
      </div>
      {description && (
        <p className="mt-2 pl-[1.125rem] text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </motion.div>
  );
}
