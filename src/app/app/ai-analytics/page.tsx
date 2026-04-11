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
import type { Persona, TimeRange, FleetOption } from "@/lib/ai-analytics-types";

const FLEET_OPTIONS: FleetOption[] = [
  { id: "munich-rooftop", name: "Munich Rooftop Array", city: "Munich", country: "Germany", climate: "temperate", moduleCount: 15 },
  { id: "chennai-solar-park", name: "Chennai Solar Park", city: "Chennai", country: "India", climate: "tropical", moduleCount: 20 },
  { id: "lisbon-green-logistics", name: "Lisbon Green Logistics", city: "Lisbon", country: "Portugal", climate: "mediterranean", moduleCount: 14 },
  { id: "dubai-innovation-campus", name: "Dubai Innovation Campus", city: "Dubai", country: "UAE", climate: "arid", moduleCount: 16 },
  { id: "amsterdam-circular-hub", name: "Amsterdam Circular Hub", city: "Amsterdam", country: "Netherlands", climate: "temperate", moduleCount: 10 },
  { id: "sao-paulo-industrial", name: "Sao Paulo Industrial", city: "Sao Paulo", country: "Brazil", climate: "subtropical", moduleCount: 14 },
  { id: "surat-technology-park", name: "Surat Technology Park", city: "Surat", country: "India", climate: "tropical", moduleCount: 8 },
];

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
  const [fleetId, setFleetId] = useState<string | null>(null);
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
        fleetId={fleetId}
        fleetOptions={FLEET_OPTIONS}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AnalyticsControlBar
          persona={persona}
          onPersonaChange={setPersona}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          fleetId={fleetId}
          onFleetChange={setFleetId}
          fleetOptions={FLEET_OPTIONS}
        />
        <main className="flex-1 overflow-y-auto bg-muted/50 p-6">
          <Panel
            persona={persona}
            timeRange={timeRange}
            fleetId={fleetId}
            fleetOptions={FLEET_OPTIONS}
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
