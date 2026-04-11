"use client";

import { useState } from "react";
import { toast } from "sonner";
import { User } from "lucide-react";
import { currentUser } from "@/lib/mock/settings";
import { ROLE_LABELS } from "@/lib/rbac";
import { LABEL_CLASS, INPUT_CLASS, READONLY_CLASS } from "@/lib/styles";

export default function ProfilePage() {
  const [name, setName] = useState(currentUser.name);
  const [title, setTitle] = useState(currentUser.title);
  function handleSave() {
    toast.success("Profile updated", { description: "Demo mode — changes are not persisted to the database." });
  }

  return (
    <div className="space-y-5">
      {/* Page heading */}
      <div>
        <h2 className="text-lg font-bold text-foreground">Profile</h2>
        <p className="text-sm text-muted-foreground">
          Manage your personal information and display preferences.
        </p>
      </div>

      {/* Avatar + identity card */}
      <div className="clean-card">
        <div className="border-b border-border px-5 py-3 flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Personal Information</h3>
        </div>

        <div className="p-5 space-y-5">
          {/* Avatar section */}
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 shrink-0 rounded-md bg-primary flex items-center justify-center">
              <span className="text-xl font-bold text-white">
                {currentUser.avatarInitial}
              </span>
            </div>
            <div>
              <p className="font-semibold text-foreground">{name}</p>
              <p className="text-sm text-muted-foreground">
                {ROLE_LABELS[currentUser.role]}
              </p>
            </div>
          </div>

          {/* Form fields */}
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className={LABEL_CLASS}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={INPUT_CLASS}
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className={LABEL_CLASS}>Email</label>
              <input
                type="email"
                value={currentUser.email}
                readOnly
                className={READONLY_CLASS}
              />
            </div>

            {/* Job Title */}
            <div className="space-y-1.5">
              <label className={LABEL_CLASS}>Job Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={INPUT_CLASS}
              />
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <label className={LABEL_CLASS}>Role</label>
              <input
                type="text"
                value={ROLE_LABELS[currentUser.role]}
                readOnly
                className={READONLY_CLASS}
              />
            </div>
          </div>

          {/* Save button */}
          <div className="flex items-center gap-3 pt-1">
            <button onClick={handleSave} className="cta-primary text-xs">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
