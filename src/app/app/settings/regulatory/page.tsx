"use client";

import { useState } from "react";
import { redirect } from "next/navigation";
import { Leaf, ShieldCheck, Scale, FileCheck } from "lucide-react";
import { regulatoryConfig, currentUser } from "@/lib/mock/settings";
import { canDo } from "@/lib/rbac";

const labelClass =
  "text-xs font-semibold uppercase tracking-wider text-[#737373]";
const selectClass =
  "w-full border border-[#D9D9D9] bg-white px-3 py-2 text-sm text-[#0D0D0D] focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]";
const readonlyClass =
  "w-full border border-[#D9D9D9] bg-[#F5F5F5] px-3 py-2 text-sm text-[#737373]";

export default function RegulatoryPage() {
  const canEdit = canDo(currentUser.role, "regulatory.edit");

  const [carbonMethodology, setCarbonMethodology] = useState(
    regulatoryConfig.carbonMethodology,
  );
  const [weeeScheme, setWeeeScheme] = useState(
    regulatoryConfig.weeeCollectionScheme,
  );
  const [reachStatus, setReachStatus] = useState(regulatoryConfig.reachStatus);
  const [rohsStatus, setRohsStatus] = useState(regulatoryConfig.rohsStatus);
  const [uflpaMode, setUflpaMode] = useState(
    regulatoryConfig.uflpaAttestationMode,
  );
  const [saved, setSaved] = useState(false);

  if (!canDo(currentUser.role, "regulatory.edit")) {
    redirect("/app/settings/profile");
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-5">
      {/* Page heading */}
      <div>
        <h2 className="text-lg font-bold text-[#0D0D0D]">
          Regulatory Configuration
        </h2>
        <p className="text-sm text-[#737373]">
          Configure compliance standards, methodology choices, and certification
          tracking.
        </p>
      </div>

      {/* Card 1: Carbon & Environmental */}
      <div className="clean-card">
        <div className="flex items-center gap-2 border-b border-[#D9D9D9] px-5 py-3">
          <Leaf className="h-4 w-4 text-[#737373]" />
          <h3 className="text-sm font-semibold text-[#0D0D0D]">
            Carbon &amp; Environmental
          </h3>
        </div>
        <div className="p-5">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Carbon Footprint Methodology */}
            <div className="space-y-1.5">
              <label className={labelClass}>Carbon Footprint Methodology</label>
              {canEdit ? (
                <select
                  value={carbonMethodology}
                  onChange={(e) => setCarbonMethodology(e.target.value)}
                  className={selectClass}
                >
                  <option>JRC Harmonised 2025</option>
                  <option>GHG Protocol</option>
                  <option>ISO 14067</option>
                  <option>PEF</option>
                </select>
              ) : (
                <input
                  readOnly
                  value={carbonMethodology}
                  className={readonlyClass}
                />
              )}
            </div>

            {/* WEEE Collection Scheme */}
            <div className="space-y-1.5">
              <label className={labelClass}>WEEE Collection Scheme</label>
              {canEdit ? (
                <select
                  value={weeeScheme}
                  onChange={(e) => setWeeeScheme(e.target.value)}
                  className={selectClass}
                >
                  <option>PV Cycle</option>
                  <option>SENS eRecycling</option>
                  <option>National EPR</option>
                  <option>Manufacturer Take-Back</option>
                </select>
              ) : (
                <input readOnly value={weeeScheme} className={readonlyClass} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Chemical Compliance */}
      <div className="clean-card">
        <div className="flex items-center gap-2 border-b border-[#D9D9D9] px-5 py-3">
          <ShieldCheck className="h-4 w-4 text-[#737373]" />
          <h3 className="text-sm font-semibold text-[#0D0D0D]">
            Chemical Compliance
          </h3>
        </div>
        <div className="p-5">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* REACH Status */}
            <div className="space-y-1.5">
              <label className={labelClass}>REACH Status</label>
              {canEdit ? (
                <select
                  value={reachStatus}
                  onChange={(e) => setReachStatus(e.target.value)}
                  className={selectClass}
                >
                  <option>Compliant</option>
                  <option>Non-Compliant</option>
                  <option>Exempt</option>
                  <option>Under Review</option>
                </select>
              ) : (
                <input
                  readOnly
                  value={reachStatus}
                  className={readonlyClass}
                />
              )}
            </div>

            {/* RoHS Status */}
            <div className="space-y-1.5">
              <label className={labelClass}>RoHS Status</label>
              {canEdit ? (
                <select
                  value={rohsStatus}
                  onChange={(e) => setRohsStatus(e.target.value)}
                  className={selectClass}
                >
                  <option>Compliant</option>
                  <option>Compliant with Exemption 7a</option>
                  <option>Non-Compliant</option>
                  <option>Under Review</option>
                </select>
              ) : (
                <input readOnly value={rohsStatus} className={readonlyClass} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Supply Chain Due Diligence */}
      <div className="clean-card">
        <div className="flex items-center gap-2 border-b border-[#D9D9D9] px-5 py-3">
          <Scale className="h-4 w-4 text-[#737373]" />
          <h3 className="text-sm font-semibold text-[#0D0D0D]">
            Supply Chain Due Diligence
          </h3>
        </div>
        <div className="p-5">
          <div className="max-w-sm space-y-1.5">
            <label className={labelClass}>UFLPA Attestation Mode</label>
            {canEdit ? (
              <select
                value={uflpaMode}
                onChange={(e) => setUflpaMode(e.target.value)}
                className={selectClass}
              >
                <option>Per-shipment attestation</option>
                <option>Annual blanket</option>
                <option>Not applicable</option>
              </select>
            ) : (
              <input readOnly value={uflpaMode} className={readonlyClass} />
            )}
          </div>
        </div>
      </div>

      {/* Card 4: Tracked Certification Standards */}
      <div className="clean-card">
        <div className="flex items-center gap-2 border-b border-[#D9D9D9] px-5 py-3">
          <FileCheck className="h-4 w-4 text-[#737373]" />
          <h3 className="text-sm font-semibold text-[#0D0D0D]">
            Tracked Certification Standards
          </h3>
        </div>
        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            {regulatoryConfig.certificationStandards.map((standard) => (
              <span
                key={standard}
                className="rounded bg-[#F2F2F2] px-3 py-1 text-xs font-medium text-[#0D0D0D]"
              >
                {standard}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Save */}
      {canEdit && (
        <div className="flex items-center gap-3">
          <button onClick={handleSave} className="cta-primary text-xs">
            Save Changes
          </button>
          {saved && (
            <span className="text-xs font-medium text-[#22C55E]">
              Regulatory config saved
            </span>
          )}
        </div>
      )}
    </div>
  );
}
