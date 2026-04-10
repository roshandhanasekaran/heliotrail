"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  KPI_REGISTRY,
  MAX_SECONDARY_KPIS,
} from "@/lib/kpi-registry";
import { useDashboardPreferences } from "@/hooks/use-dashboard-preferences";
import { RotateCcw } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  passport: "Passport",
  compliance: "Compliance",
  environmental: "Environmental",
  operational: "Operational",
};

const CATEGORY_ORDER = ["passport", "compliance", "environmental", "operational"];

export function KpiPicker({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { preferences, updatePreferences, resetToDefaults } =
    useDashboardPreferences();

  const enabled = new Set(preferences.enabledKpiIds);
  const atMax = enabled.size >= MAX_SECONDARY_KPIS;

  function toggle(id: string) {
    const next = new Set(enabled);
    if (next.has(id)) {
      next.delete(id);
    } else if (!atMax) {
      next.add(id);
    }
    updatePreferences({ enabledKpiIds: [...next] });
  }

  // Group KPIs by category
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    metrics: KPI_REGISTRY.filter((k) => k.category === cat),
  })).filter((g) => g.metrics.length > 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Configure KPIs</SheetTitle>
          <SheetDescription>
            Choose up to {MAX_SECONDARY_KPIS} metrics to display.
            Hero cards (Total Passports & Compliance Score) are always shown.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          <div className="space-y-5">
            {grouped.map((group) => (
              <div key={group.category}>
                <p className="mb-2 text-[0.625rem] font-semibold uppercase tracking-wider text-[#A3A3A3]">
                  {group.label}
                </p>
                <div className="space-y-1">
                  {group.metrics.map((metric) => {
                    const isOn = enabled.has(metric.id);
                    const disabled = !isOn && atMax;
                    return (
                      <label
                        key={metric.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 transition-colors ${
                          isOn
                            ? "bg-[#F0FDF4]"
                            : disabled
                              ? "cursor-not-allowed opacity-50"
                              : "hover:bg-[#FAFAFA]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isOn}
                          disabled={disabled}
                          onChange={() => toggle(metric.id)}
                          className="h-4 w-4 rounded border-[#D9D9D9] text-[#22C55E] accent-[#22C55E]"
                        />
                        <metric.icon
                          className="h-4 w-4 shrink-0"
                          style={{ color: metric.accentColor }}
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#0D0D0D]">
                            {metric.label}
                          </p>
                          <p className="text-xs text-[#737373]">
                            {metric.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <SheetFooter>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#A3A3A3]">
              {enabled.size}/{MAX_SECONDARY_KPIS} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => resetToDefaults()}
              className="gap-1.5 text-xs"
            >
              <RotateCcw className="h-3 w-3" />
              Reset defaults
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
