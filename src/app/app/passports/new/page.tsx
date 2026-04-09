"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Send,
  Tag,
  Cpu,
  Layers,
  Route,
  ShieldCheck,
  Recycle,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const WIZARD_STEPS = [
  { id: "identity", label: "Identity", icon: Tag },
  { id: "specs", label: "Specifications", icon: Cpu },
  { id: "composition", label: "Composition", icon: Layers },
  { id: "traceability", label: "Traceability", icon: Route },
  { id: "compliance", label: "Compliance", icon: ShieldCheck },
  { id: "circularity", label: "Circularity", icon: Recycle },
  { id: "dynamic", label: "Dynamic Data", icon: Activity },
  { id: "review", label: "Review", icon: CheckCircle2 },
] as const;

export default function CreatePassportPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const step = WIZARD_STEPS[currentStep];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/app/passports"
          className="inline-flex items-center gap-1 text-xs text-[#737373] hover:text-[#0D0D0D]"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Passports
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-[#0D0D0D]">
          Create Passport
        </h1>
      </div>

      <div className="flex gap-6">
        {/* Left stepper */}
        <nav className="hidden w-48 shrink-0 lg:block">
          <div className="sticky top-20 space-y-0.5">
            {WIZARD_STEPS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrentStep(i)}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors",
                  i === currentStep
                    ? "border-l-2 border-[#22C55E] bg-[#E8FAE9] font-medium text-[#0D0D0D]"
                    : i < currentStep
                      ? "border-l-2 border-[#22C55E]/30 text-[#22C55E]"
                      : "border-l-2 border-transparent text-[#737373] hover:bg-[#F2F2F2]"
                )}
              >
                <s.icon className="h-3.5 w-3.5 shrink-0" />
                {s.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Main form area */}
        <div className="min-w-0 flex-1">
          <div className="clean-card p-6">
            {/* Step indicator (mobile) */}
            <div className="mb-4 flex items-center gap-2 text-xs text-[#737373] lg:hidden">
              <step.icon className="h-3.5 w-3.5" />
              Step {currentStep + 1} of {WIZARD_STEPS.length}: {step.label}
            </div>

            <h2 className="text-lg font-bold text-[#0D0D0D]">{step.label}</h2>

            {/* Step content */}
            <div className="mt-6">
              {step.id === "identity" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Model ID" placeholder="e.g. WRM-700-TOPCON-BiN-03" required />
                  <FormField label="Serial Number" placeholder="Serial or batch ID" />
                  <FormField label="Batch ID" placeholder="Production batch" />
                  <FormField label="GTIN" placeholder="Global Trade Item Number" />
                  <FormField label="Manufacturer" placeholder="Manufacturer name" required />
                  <FormField label="Facility" placeholder="Manufacturing facility" />
                  <FormField label="Manufacturing Date" placeholder="YYYY-MM-DD" type="date" />
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373]">
                      Technology *
                    </label>
                    <select className="mt-1 block w-full border border-[#D9D9D9] bg-white px-3 py-2 text-sm text-[#0D0D0D] focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]">
                      <option value="">Select technology</option>
                      <option value="crystalline_silicon_topcon">TOPCon</option>
                      <option value="crystalline_silicon_perc">PERC</option>
                      <option value="crystalline_silicon_hjt">HJT</option>
                      <option value="thin_film_cdte">CdTe</option>
                      <option value="thin_film_cigs">CIGS</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              )}

              {step.id === "specs" && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <FormField label="Rated Power (W)" placeholder="e.g. 700" type="number" />
                  <FormField label="Efficiency (%)" placeholder="e.g. 22.53" type="number" />
                  <FormField label="Voc (V)" placeholder="Open circuit voltage" type="number" />
                  <FormField label="Isc (A)" placeholder="Short circuit current" type="number" />
                  <FormField label="Vmp (V)" placeholder="Voltage at max power" type="number" />
                  <FormField label="Imp (A)" placeholder="Current at max power" type="number" />
                  <FormField label="Max System Voltage (V)" placeholder="e.g. 1500" type="number" />
                  <FormField label="Length (mm)" placeholder="Module length" type="number" />
                  <FormField label="Width (mm)" placeholder="Module width" type="number" />
                  <FormField label="Depth (mm)" placeholder="Module depth" type="number" />
                  <FormField label="Weight (kg)" placeholder="Module weight" type="number" />
                  <FormField label="Cell Count" placeholder="e.g. 144" type="number" />
                  <FormField label="Cell Type" placeholder="e.g. M10 N-Type Mono" />
                  <FormField label="Frame Type" placeholder="e.g. Anodized aluminium" />
                  <FormField label="Glass Type" placeholder="e.g. 2mm Low Iron ARC" />
                </div>
              )}

              {step.id !== "identity" && step.id !== "specs" && step.id !== "review" && (
                <div className="dashed-card flex flex-col items-center py-12 text-center">
                  <step.icon className="h-8 w-8 text-[#D9D9D9]" />
                  <p className="mt-3 text-sm font-medium text-[#737373]">
                    {step.label} form
                  </p>
                  <p className="mt-1 text-xs text-[#A3A3A3]">
                    Add {step.label.toLowerCase()} data for this passport.
                  </p>
                </div>
              )}

              {step.id === "review" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 bg-[#E8FAE9] px-4 py-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
                    <span className="text-[#0D0D0D]">
                      Review your passport data before submitting
                    </span>
                  </div>
                  <p className="text-sm text-[#737373]">
                    Check all sections for completeness. Missing fields will be
                    flagged during review.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer actions */}
          <div className="mt-4 flex items-center justify-between">
            <button className="cta-secondary text-xs">
              <span className="flex items-center gap-1">
                <Save className="h-3 w-3" /> Save Draft
              </span>
            </button>
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="cta-secondary text-xs"
                >
                  <span className="flex items-center gap-1">
                    <ArrowLeft className="h-3 w-3" /> Back
                  </span>
                </button>
              )}
              {currentStep < WIZARD_STEPS.length - 1 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="cta-primary text-xs"
                >
                  Next <ArrowRight className="h-3 w-3 arrow-icon" />
                </button>
              ) : (
                <button className="cta-primary text-xs">
                  <Send className="h-3 w-3" /> Submit for Approval
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-[#737373]">
        {label}
        {required && " *"}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-1 block w-full border border-[#D9D9D9] bg-white px-3 py-2 text-sm text-[#0D0D0D] placeholder:text-[#A3A3A3] focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
      />
    </div>
  );
}
