import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatWatts(w: number | null): string {
  if (w == null) return "—";
  return w >= 1000 ? `${(w / 1000).toFixed(1)} kW` : `${w} W`;
}

export function formatPercent(v: number | null): string {
  if (v == null) return "—";
  return `${v}%`;
}

export function formatNumber(v: number | null, unit?: string): string {
  if (v == null) return "—";
  return unit ? `${v} ${unit}` : `${v}`;
}

export function formatDate(d: string | null): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatFileSize(bytes: number | null): string {
  if (bytes == null) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
