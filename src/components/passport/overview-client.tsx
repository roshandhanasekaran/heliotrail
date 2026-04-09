"use client";

import { GlassCard } from "@/components/passport/glass-card";
import { SectionTitle } from "@/components/passport/section-title";
import { FactoryIcon, ShieldCheckIcon, FingerprintIcon } from "lucide-react";

interface DataItem {
  label: string;
  value: string;
}

interface OverviewClientProps {
  manufacturerData: DataItem[];
  warrantyData: DataItem[];
}

export function OverviewClient({
  manufacturerData,
  warrantyData,
}: OverviewClientProps) {
  return (
    <section>
      <SectionTitle
        title="Product Details"
        description="Manufacturer information and warranty coverage"
        icon={FingerprintIcon}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Manufacturer Card */}
        <GlassCard>
          <div className="p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center bg-[#F2F2F2]">
                <FactoryIcon className="h-4 w-4 text-[#0D0D0D]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#0D0D0D]">Manufacturer</h3>
                <p className="text-[11px] text-[#737373]">Origin & production details</p>
              </div>
            </div>

            <div className="passport-table">
              <div className="passport-table-header">
                <span>Field</span>
                <span>Value</span>
              </div>
              {manufacturerData.map((item) => (
                <div
                  key={item.label}
                  className="passport-table-row"
                >
                  <span className="table-label">{item.label}</span>
                  <span className="table-value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Warranty Card */}
        <GlassCard>
          <div className="p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center bg-[#F2F2F2]">
                <ShieldCheckIcon className="h-4 w-4 text-[#0D0D0D]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#0D0D0D]">
                  Warranty &amp; Identification
                </h3>
                <p className="text-[11px] text-[#737373]">Coverage & serial details</p>
              </div>
            </div>

            <div className="passport-table">
              <div className="passport-table-header">
                <span>Field</span>
                <span>Value</span>
              </div>
              {warrantyData.map((item) => (
                <div
                  key={item.label}
                  className="passport-table-row"
                >
                  <span className="table-label">{item.label}</span>
                  <span className="table-value mono">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
