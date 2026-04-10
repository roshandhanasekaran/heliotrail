"use client";

import { useState } from "react";
import { AIAnalyticsSidebar } from "@/components/app/ai-analytics/ai-analytics-sidebar";
import { SummaryDetail } from "@/components/app/ai-analytics/detail-panels/summary-detail";
import { PerformanceDetail } from "@/components/app/ai-analytics/detail-panels/performance-detail";
import { DegradationDetail } from "@/components/app/ai-analytics/detail-panels/degradation-detail";
import { SoilingDetail } from "@/components/app/ai-analytics/detail-panels/soiling-detail";
import { RevenueDetail } from "@/components/app/ai-analytics/detail-panels/revenue-detail";
import { ComplianceDetail } from "@/components/app/ai-analytics/detail-panels/compliance-detail";
import { FleetHealthDetail } from "@/components/app/ai-analytics/detail-panels/fleet-health-detail";

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

  const DetailPanel = activeSection ? DETAIL_PANELS[activeSection] : null;

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <AIAnalyticsSidebar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
      />
      <main className="flex-1 overflow-y-auto bg-[#FAFAFA] p-6">
        {DetailPanel ? <DetailPanel /> : <SummaryDetail />}
      </main>
    </div>
  );
}
