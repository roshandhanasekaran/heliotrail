"use client";

import { useState } from "react";
import { redirect } from "next/navigation";
import { Leaf, ShieldCheck, Scale, FileCheck } from "lucide-react";
import { regulatoryConfig, currentUser } from "@/lib/mock/settings";
import { canDo } from "@/lib/rbac";
import { LABEL_CLASS, INPUT_CLASS, READONLY_CLASS } from "@/lib/styles";

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

  const selectClass = INPUT_CLASS;

  return (
    <div className="space-y-5">
      {/* Page heading */}
      <div>
        <h2 className="text-lg font-bold text-foreground">
          Regulatory Configuration
        </h2>
        <p className="text-sm text-muted-foreground">
          Configure compliance standards, methodology choices, and certification
          tracking.
        </p>
      </div>

      {/* Card 1: Carbon & Environmental */}
      <div className="clean-card">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3">
          <Leaf className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">
            Carbon &amp; Environmental
          </h3>
        </div>
        <div className="p-5">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Carbon Footprint Methodology */}
            <div className="space-y-1.5">
              <label className={LABEL_CLASS}>Carbon Footprint Methodology</label>
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
                  className={READONLY_CLASS}
                />
              )}
            </div>

            {/* WEEE Collection Scheme */}
            <div className="space-y-1.5">
              <label className={LABEL_CLASS}>WEEE Collection Scheme</label>
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
                <input readOnly value={weeeScheme} className={READONLY_CLASS} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Chemical Compliance */}
      <div className="clean-card">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3">
          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">
            Chemical Compliance
          </h3>
        </div>
        <div className="p-5">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* REACH Status */}
            <div className="space-y-1.5">
              <label className={LABEL_CLASS}>REACH Status</label>
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
                  className={READONLY_CLASS}
                />
              )}
            </div>

            {/* RoHS Status */}
            <div className="space-y-1.5">
              <label className={LABEL_CLASS}>RoHS Status</label>
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
                <input readOnly value={rohsStatus} className={READONLY_CLASS} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Supply Chain Due Diligence */}
      <div className="clean-card">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3">
          <Scale className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">
            Supply Chain Due Diligence
          </h3>
        </div>
        <div className="p-5">
          <div className="max-w-sm space-y-1.5">
            <label className={LABEL_CLASS}>UFLPA Attestation Mode</label>
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
              <input readOnly value={uflpaMode} className={READONLY_CLASS} />
            )}
          </div>
        </div>
      </div>

      {/* Card 4: Tracked Certification Standards */}
      <div className="clean-card">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3">
          <FileCheck className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">
            Tracked Certification Standards
          </h3>
        </div>
        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            {regulatoryConfig.certificationStandards.map((standard) => (
              <span
                key={standard}
                className="rounded bg-muted px-3 py-1 text-xs font-medium text-foreground"
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
            <span className="text-xs font-medium text-primary">
              Regulatory config saved
            </span>
          )}
        </div>
      )}
    </div>
  );
}
