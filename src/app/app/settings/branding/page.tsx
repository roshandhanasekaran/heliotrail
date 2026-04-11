"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Palette, Upload, Eye } from "lucide-react";
import { currentUser } from "@/lib/mock/settings";
import { canDo } from "@/lib/rbac";
import { LABEL_CLASS, INPUT_CLASS, READONLY_CLASS } from "@/lib/styles";
import { DEFAULT_BRAND } from "@/lib/export/types";

export default function BrandingPage() {
  const canEdit = canDo(currentUser.role, "org.edit");

  const [primaryColor, setPrimaryColor] = useState(DEFAULT_BRAND.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(DEFAULT_BRAND.secondaryColor);
  const [accentColor, setAccentColor] = useState(DEFAULT_BRAND.accentColor);
  const [fontFamily, setFontFamily] = useState(DEFAULT_BRAND.fontFamily);
  const [headerText, setHeaderText] = useState(DEFAULT_BRAND.reportHeaderText);
  const [footerText, setFooterText] = useState(DEFAULT_BRAND.reportFooterText);
  const [showQrCode, setShowQrCode] = useState(DEFAULT_BRAND.showQrCode);

  const inputClass = canEdit ? INPUT_CLASS : READONLY_CLASS;

  function handleSave() {
    toast.success("Branding updated", {
      description: "Demo mode — changes are not persisted to the database.",
    });
  }

  return (
    <div className="space-y-5">
      {/* Page heading */}
      <div>
        <h2 className="text-lg font-bold text-foreground">Branding</h2>
        <p className="text-sm text-muted-foreground">
          {canEdit
            ? "Customize exported reports with your company branding."
            : "View your organization's report branding settings."}
        </p>
      </div>

      {/* Logo Upload */}
      <div className="clean-card">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3">
          <Upload className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">
            Company Logo
          </h3>
        </div>
        <div className="p-5">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Light logo */}
            <div className="space-y-2">
              <label className={LABEL_CLASS}>Logo (Light Background)</label>
              <div className="flex h-28 items-center justify-center rounded border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary/50">
                <div className="text-center">
                  <Upload className="mx-auto h-5 w-5 text-muted-foreground/50" />
                  <p className="mt-1 text-[0.625rem] text-muted-foreground">
                    Drag & drop or click to upload
                  </p>
                  <p className="text-[0.5rem] text-muted-foreground/50">
                    PNG, SVG · Max 2MB · 400x100px recommended
                  </p>
                </div>
              </div>
            </div>
            {/* Dark logo */}
            <div className="space-y-2">
              <label className={LABEL_CLASS}>Logo (Dark Background)</label>
              <div className="flex h-28 items-center justify-center rounded border-2 border-dashed border-border bg-foreground/5 transition-colors hover:border-primary/50">
                <div className="text-center">
                  <Upload className="mx-auto h-5 w-5 text-muted-foreground/50" />
                  <p className="mt-1 text-[0.625rem] text-muted-foreground">
                    Optional dark mode variant
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Colors */}
      <div className="clean-card">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3">
          <Palette className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">
            Brand Colors
          </h3>
        </div>
        <div className="p-5">
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className={LABEL_CLASS}>Primary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  disabled={!canEdit}
                  className="h-9 w-9 cursor-pointer border border-border bg-transparent p-0.5"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  readOnly={!canEdit}
                  className={`${inputClass} font-mono uppercase`}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className={LABEL_CLASS}>Secondary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  disabled={!canEdit}
                  className="h-9 w-9 cursor-pointer border border-border bg-transparent p-0.5"
                />
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  readOnly={!canEdit}
                  className={`${inputClass} font-mono uppercase`}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className={LABEL_CLASS}>Accent Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  disabled={!canEdit}
                  className="h-9 w-9 cursor-pointer border border-border bg-transparent p-0.5"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  readOnly={!canEdit}
                  className={`${inputClass} font-mono uppercase`}
                />
              </div>
            </div>
          </div>

          {/* Preview swatch */}
          <div className="mt-4">
            <label className={LABEL_CLASS}>Preview</label>
            <div className="mt-1.5 flex items-center gap-0.5 overflow-hidden rounded">
              <div className="h-6 flex-1" style={{ backgroundColor: primaryColor }} />
              <div className="h-6 flex-1" style={{ backgroundColor: secondaryColor }} />
              <div className="h-6 flex-1" style={{ backgroundColor: accentColor }} />
            </div>
          </div>
        </div>
      </div>

      {/* Report Settings */}
      <div className="clean-card">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">
            Report Customization
          </h3>
        </div>
        <div className="p-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className={LABEL_CLASS}>Font Family</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                disabled={!canEdit}
                className={inputClass}
              >
                <option value="DM Sans">DM Sans</option>
                <option value="Inter">Inter</option>
                <option value="system-ui">System Default</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={LABEL_CLASS}>QR Code in Reports</label>
              <label className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  checked={showQrCode}
                  onChange={(e) => setShowQrCode(e.target.checked)}
                  disabled={!canEdit}
                  className="h-4 w-4 rounded border-border accent-primary"
                />
                <span className="text-sm text-foreground">
                  Include QR code linking to public passport
                </span>
              </label>
            </div>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className={LABEL_CLASS}>Report Header Text</label>
              <input
                type="text"
                value={headerText}
                onChange={(e) => setHeaderText(e.target.value)}
                readOnly={!canEdit}
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className={LABEL_CLASS}>Report Footer Text</label>
              <input
                type="text"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                readOnly={!canEdit}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save */}
      {canEdit && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="cta-primary text-sm"
          >
            Save Branding
          </button>
        </div>
      )}
    </div>
  );
}
