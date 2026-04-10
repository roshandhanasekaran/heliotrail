"use client";

import { useState } from "react";
import { Lock, Monitor, Smartphone } from "lucide-react";

interface Session {
  id: string;
  device: string;
  location: string;
  lastSeen: string;
  icon: React.ElementType;
  current: boolean;
}

const SESSIONS: Session[] = [
  {
    id: "sess_1",
    device: "MacBook Pro — Chrome",
    location: "Mumbai, IN",
    lastSeen: "Active now",
    icon: Monitor,
    current: true,
  },
  {
    id: "sess_2",
    device: "iPhone 15 — Safari",
    location: "Mumbai, IN",
    lastSeen: "2 hours ago",
    icon: Smartphone,
    current: false,
  },
];

export default function SecurityPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [revokedIds, setRevokedIds] = useState<string[]>([]);

  function handleUpdatePassword() {
    setPasswordSaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSaved(false), 2000);
  }

  function handleRevoke(id: string) {
    setRevokedIds((prev) => [...prev, id]);
  }

  const inputClass =
    "w-full border border-[#D9D9D9] bg-white px-3 py-2 text-sm text-[#0D0D0D] focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]";
  const labelClass =
    "text-xs font-semibold uppercase tracking-wider text-[#737373]";

  return (
    <div className="space-y-5">
      {/* Page heading */}
      <div>
        <h2 className="text-lg font-bold text-[#0D0D0D]">Security</h2>
        <p className="text-sm text-[#737373]">
          Manage your password and active sessions.
        </p>
      </div>

      {/* Change Password card */}
      <div className="clean-card">
        <div className="border-b border-[#D9D9D9] px-5 py-3 flex items-center gap-2">
          <Lock className="h-4 w-4 text-[#737373]" />
          <h3 className="text-sm font-semibold text-[#0D0D0D]">Change Password</h3>
        </div>

        <div className="p-5">
          <div className="max-w-lg grid gap-4">
            {/* Current Password */}
            <div className="space-y-1.5">
              <label className={labelClass}>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                className={inputClass}
              />
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className={labelClass}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter a new password"
                className={inputClass}
              />
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className={labelClass}>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                className={inputClass}
              />
            </div>

            {/* Action */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleUpdatePassword}
                className="cta-primary text-xs"
              >
                Update Password
              </button>
              {passwordSaved && (
                <span className="text-xs font-medium text-[#22C55E]">
                  Password updated
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Active Sessions card */}
      <div className="clean-card">
        <div className="border-b border-[#D9D9D9] px-5 py-3 flex items-center gap-2">
          <Monitor className="h-4 w-4 text-[#737373]" />
          <h3 className="text-sm font-semibold text-[#0D0D0D]">Active Sessions</h3>
        </div>

        <div className="divide-y divide-[#D9D9D9]">
          {SESSIONS.filter((s) => !revokedIds.includes(s.id)).map((session) => {
            const Icon = session.icon;
            return (
              <div
                key={session.id}
                className="flex items-center gap-4 px-5 py-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#F5F5F5]">
                  <Icon className="h-4 w-4 text-[#737373]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#0D0D0D]">
                    {session.device}
                  </p>
                  <p className="text-xs text-[#737373]">
                    {session.location} · {session.lastSeen}
                  </p>
                </div>
                {session.current ? (
                  <span className="shrink-0 rounded bg-[#E8FAE9] px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-[#22C55E]">
                    Current
                  </span>
                ) : (
                  <button
                    onClick={() => handleRevoke(session.id)}
                    className="shrink-0 rounded border border-[#D9D9D9] bg-white px-3 py-1 text-xs font-medium text-[#737373] transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                  >
                    Revoke
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
