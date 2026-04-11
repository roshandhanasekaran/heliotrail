"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";
import { currentUser, organization } from "@/lib/mock/settings";
import { canDo } from "@/lib/rbac";
import { LABEL_CLASS, INPUT_CLASS, READONLY_CLASS } from "@/lib/styles";

export default function OrganizationPage() {
  const canEdit = canDo(currentUser.role, "org.edit");

  const [orgName, setOrgName] = useState(organization.name);
  const [domain, setDomain] = useState(organization.domain);
  const [defaultFacility, setDefaultFacility] = useState(
    organization.defaultFacility
  );
  const [operatorId, setOperatorId] = useState(organization.operatorId);
  const [street, setStreet] = useState(organization.address.street);
  const [city, setCity] = useState(organization.address.city);
  const [postalCode, setPostalCode] = useState(organization.address.postalCode);
  const [country, setCountry] = useState(organization.address.country);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const inputClass = canEdit ? INPUT_CLASS : READONLY_CLASS;

  return (
    <div className="space-y-5">
      {/* Page heading */}
      <div>
        <h2 className="text-lg font-bold text-foreground">Organization</h2>
        <p className="text-sm text-muted-foreground">
          {canEdit
            ? "Manage your organization identity and EU economic operator details."
            : "View your organization identity and EU economic operator details."}
        </p>
      </div>

      {/* Organization Identity card */}
      <div className="clean-card">
        <div className="border-b border-border px-5 py-3 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">
            Organization Identity
          </h3>
        </div>

        <div className="p-5">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Org Name */}
            <div className="space-y-1.5">
              <label className={LABEL_CLASS}>Organization Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                readOnly={!canEdit}
                className={inputClass}
              />
            </div>

            {/* Domain */}
            <div className="space-y-1.5">
              <label className={LABEL_CLASS}>Domain</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                readOnly={!canEdit}
                className={inputClass}
              />
            </div>

            {/* Default Facility */}
            <div className="space-y-1.5">
              <label className={LABEL_CLASS}>Default Facility</label>
              <input
                type="text"
                value={defaultFacility}
                onChange={(e) => setDefaultFacility(e.target.value)}
                readOnly={!canEdit}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      {/* EU Economic Operator card */}
      <div className="clean-card">
        <div className="border-b border-border px-5 py-3 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">
            EU Economic Operator
          </h3>
          <span className="ml-1 rounded px-1.5 py-0.5 text-[0.5625rem] font-bold uppercase tracking-wide bg-[#003399] text-white">
            ESPR Art. 8
          </span>
        </div>

        <div className="p-5">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Economic Operator ID — full width */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className={LABEL_CLASS}>Economic Operator ID</label>
              <input
                type="text"
                value={operatorId}
                onChange={(e) => setOperatorId(e.target.value)}
                readOnly={!canEdit}
                className={inputClass}
              />
            </div>

            {/* Street Address — full width */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className={LABEL_CLASS}>Street Address</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                readOnly={!canEdit}
                className={inputClass}
              />
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <label className={LABEL_CLASS}>City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                readOnly={!canEdit}
                className={inputClass}
              />
            </div>

            {/* Postal Code */}
            <div className="space-y-1.5">
              <label className={LABEL_CLASS}>Postal Code</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                readOnly={!canEdit}
                className={inputClass}
              />
            </div>

            {/* Country — full width */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className={LABEL_CLASS}>Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                readOnly={!canEdit}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save button — only shown when canEdit */}
      {canEdit && (
        <div className="flex items-center gap-3">
          <button onClick={handleSave} className="cta-primary text-xs">
            Save Changes
          </button>
          {saved && (
            <span className="text-xs font-medium text-primary">
              Changes saved
            </span>
          )}
        </div>
      )}
    </div>
  );
}
