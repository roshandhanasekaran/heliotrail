"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { currentUser } from "@/lib/mock/settings";
import { ROLE_LABELS } from "@/lib/rbac";

export default function ProfilePage() {
  const [name, setName] = useState(currentUser.name);
  const [title, setTitle] = useState(currentUser.title);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const inputClass =
    "w-full border border-[#D9D9D9] bg-white px-3 py-2 text-sm text-[#0D0D0D] focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]";
  const readonlyClass =
    "w-full border border-[#D9D9D9] bg-[#F5F5F5] px-3 py-2 text-sm text-[#737373]";
  const labelClass = "text-xs font-semibold uppercase tracking-wider text-[#737373]";

  return (
    <div className="space-y-5">
      {/* Page heading */}
      <div>
        <h2 className="text-lg font-bold text-[#0D0D0D]">Profile</h2>
        <p className="text-sm text-[#737373]">
          Manage your personal information and display preferences.
        </p>
      </div>

      {/* Avatar + identity card */}
      <div className="clean-card">
        <div className="border-b border-[#D9D9D9] px-5 py-3 flex items-center gap-2">
          <User className="h-4 w-4 text-[#737373]" />
          <h3 className="text-sm font-semibold text-[#0D0D0D]">Personal Information</h3>
        </div>

        <div className="p-5 space-y-5">
          {/* Avatar section */}
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 shrink-0 rounded-md bg-[#22C55E] flex items-center justify-center">
              <span className="text-xl font-bold text-white">
                {currentUser.avatarInitial}
              </span>
            </div>
            <div>
              <p className="font-semibold text-[#0D0D0D]">{name}</p>
              <p className="text-sm text-[#737373]">
                {ROLE_LABELS[currentUser.role]}
              </p>
            </div>
          </div>

          {/* Form fields */}
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className={labelClass}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={currentUser.email}
                readOnly
                className={readonlyClass}
              />
            </div>

            {/* Job Title */}
            <div className="space-y-1.5">
              <label className={labelClass}>Job Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <label className={labelClass}>Role</label>
              <input
                type="text"
                value={ROLE_LABELS[currentUser.role]}
                readOnly
                className={readonlyClass}
              />
            </div>
          </div>

          {/* Save button */}
          <div className="flex items-center gap-3 pt-1">
            <button onClick={handleSave} className="cta-primary text-xs">
              Save Changes
            </button>
            {saved && (
              <span className="text-xs font-medium text-[#22C55E]">
                Changes saved
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
