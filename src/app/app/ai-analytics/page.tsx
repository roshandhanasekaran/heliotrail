"use client";

import { useState } from "react";
import { AIAnalyticsSidebar } from "@/components/app/ai-analytics/ai-analytics-sidebar";
import { AnalyticsControlBar } from "@/components/app/ai-analytics/analytics-control-bar";
import { SummaryDetail } from "@/components/app/ai-analytics/detail-panels/summary-detail";
import { PerformanceDetail } from "@/components/app/ai-analytics/detail-panels/performance-detail";
import { DegradationDetail } from "@/components/app/ai-analytics/detail-panels/degradation-detail";
import { SoilingDetail } from "@/components/app/ai-analytics/detail-panels/soiling-detail";
import { RevenueDetail } from "@/components/app/ai-analytics/detail-panels/revenue-detail";
import { ComplianceDetail } from "@/components/app/ai-analytics/detail-panels/compliance-detail";
import { FleetHealthDetail } from "@/components/app/ai-analytics/detail-panels/fleet-health-detail";
import { ModuleFlyout } from "@/components/app/ai-analytics/module-flyout";
import type { Persona, TimeRange } from "@/lib/ai-analytics-types";

const DETAIL_PANELS: Record<string, React.ComponentType> = {
  "fleet-health": FleetHealthDetail,
  performance: PerformanceDetail,
  degradation: DegradationDetail,
  soiling: SoilingDetail,
  revenue: RevenueDetail,
  compliance: ComplianceDetail,
};

export default function AIAnalyticsPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [persona, setPersona] = useState<Persona>("manufacturer");
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [flyoutModuleId, setFlyoutModuleId] = useState<string | null>(null);

  const DetailPanel = activeSection ? DETAIL_PANELS[activeSection] : null;

  const handleModuleClick = (moduleId: string) => {
    setFlyoutModuleId(moduleId);
  };

  // Cast to ComponentType<any> so we can pass props that panels will use in later tasks
  const Panel = (DetailPanel ?? SummaryDetail) as React.ComponentType<any>;

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <AIAnalyticsSidebar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AnalyticsControlBar
          persona={persona}
          onPersonaChange={setPersona}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />
        <main className="flex-1 overflow-y-auto bg-[#FAFAFA] p-6">
          <Panel
            persona={persona}
            timeRange={timeRange}
            onModuleClick={handleModuleClick}
          />
        </main>
      </div>
      <ModuleFlyout
        moduleId={flyoutModuleId}
        onClose={() => setFlyoutModuleId(null)}
      />
    </div>
  );
}
