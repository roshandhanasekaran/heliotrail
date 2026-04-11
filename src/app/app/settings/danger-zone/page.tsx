"use client";

import { useState } from "react";
import { redirect } from "next/navigation";
import { AlertTriangle, ArrowRightLeft, Trash2 } from "lucide-react";
import { organization, currentUser } from "@/lib/mock/settings";
import { canDo } from "@/lib/rbac";
import { LABEL_CLASS } from "@/lib/styles";

export default function DangerZonePage() {
  const [transferEmail, setTransferEmail] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const redInputClass =
    "w-full border border-red-200 bg-card px-3 py-2 text-sm text-foreground focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500";
  const redButtonClass =
    "rounded bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40";

  if (!canDo(currentUser.role, "org.delete")) {
    redirect("/app/settings/profile");
  }

  return (
    <div className="space-y-5">
      {/* Page heading */}
      <div>
        <h2 className="text-lg font-bold text-foreground">Danger Zone</h2>
        <p className="text-sm text-muted-foreground">
          Irreversible and destructive actions. Proceed with caution.
        </p>
      </div>

      {/* Warning banner */}
      <div className="flex items-start gap-3 rounded border border-red-200 bg-red-50 px-4 py-3">
        <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
        <p className="text-sm text-red-700">
          Actions on this page are permanent and cannot be undone. Please read
          each description carefully before proceeding.
        </p>
      </div>

      {/* Transfer Ownership card */}
      <div className="clean-card border-red-200">
        <div className="border-b border-red-200 bg-red-50 px-5 py-3 flex items-center gap-2">
          <ArrowRightLeft className="h-4 w-4 text-red-600" />
          <h3 className="text-sm font-semibold text-red-700">
            Transfer Ownership
          </h3>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-muted-foreground">
            Transfer ownership of{" "}
            <span className="font-semibold text-foreground">
              {organization.name}
            </span>{" "}
            to another team member. You will be demoted to Admin. This action
            cannot be undone by you.
          </p>

          <div className="max-w-sm space-y-3">
            <div className="space-y-1.5">
              <label className={LABEL_CLASS}>New Owner Email</label>
              <input
                type="email"
                value={transferEmail}
                onChange={(e) => setTransferEmail(e.target.value)}
                placeholder="colleague@waaree.com"
                className={redInputClass}
              />
            </div>
            <button
              disabled={transferEmail.trim() === ""}
              className={redButtonClass}
            >
              Transfer Ownership
            </button>
          </div>
        </div>
      </div>

      {/* Delete Organization card */}
      <div className="clean-card border-red-200">
        <div className="border-b border-red-200 bg-red-50 px-5 py-3 flex items-center gap-2">
          <Trash2 className="h-4 w-4 text-red-600" />
          <h3 className="text-sm font-semibold text-red-700">
            Delete Organisation
          </h3>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-muted-foreground">
            Permanently delete{" "}
            <span className="font-semibold text-foreground">
              {organization.name}
            </span>{" "}
            and all associated data — passports, team members, API keys, audit
            logs, and evidence files. This action is{" "}
            <span className="font-semibold text-red-700">irreversible</span> and
            all data will be lost immediately.
          </p>

          <div className="max-w-sm space-y-3">
            <div className="space-y-1.5">
              <label className={LABEL_CLASS}>
                Type{" "}
                <span className="font-bold text-foreground">
                  {organization.name}
                </span>{" "}
                to confirm
              </label>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder={organization.name}
                className={redInputClass}
              />
            </div>
            <button
              disabled={deleteConfirm !== organization.name}
              className={redButtonClass}
            >
              Delete Organisation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
