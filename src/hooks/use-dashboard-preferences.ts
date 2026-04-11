"use client";

import { useSyncExternalStore, useCallback } from "react";
import { DEFAULT_ENABLED_IDS } from "@/lib/kpi-registry";

const STORAGE_KEY = "heliotrail:dashboard-preferences";

interface ExplorerPreferences {
  xMetric: string;
  yMetric: string;
  chartType: "scatter" | "bar" | "line";
  colorBy: "technology" | "status" | "none";
}

interface DashboardPreferences {
  enabledKpiIds: string[];
  explorer?: ExplorerPreferences;
}

const DEFAULT_PREFERENCES: DashboardPreferences = {
  enabledKpiIds: DEFAULT_ENABLED_IDS,
};

// ── External store for SSR-safe localStorage ─────────────────────────────────

const listeners = new Set<() => void>();

function getSnapshot(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function getServerSnapshot(): string {
  return "";
}

function subscribe(cb: () => void) {
  listeners.add(cb);

  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) cb();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function emit() {
  for (const cb of listeners) cb();
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useDashboardPreferences() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const preferences: DashboardPreferences = raw
    ? (JSON.parse(raw) as DashboardPreferences)
    : DEFAULT_PREFERENCES;

  const updatePreferences = useCallback(
    (next: Partial<DashboardPreferences>) => {
      const merged = { ...preferences, ...next };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch {
        // storage full / unavailable
      }
      emit();
    },
    [preferences],
  );

  const resetToDefaults = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // noop
    }
    emit();
  }, []);

  return { preferences, updatePreferences, resetToDefaults };
}
