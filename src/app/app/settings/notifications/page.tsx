"use client";

import { useState } from "react";
import { Bell, Mail, MonitorSmartphone } from "lucide-react";
import {
  notificationPreferences,
  type NotificationCategory,
} from "@/lib/mock/settings";
import { LABEL_CLASS } from "@/lib/styles";

function Toggle({
  on,
  onToggle,
  ariaLabel,
}: {
  on: boolean;
  onToggle: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={on}
      aria-label={ariaLabel}
      className={`flex h-5 w-9 items-center rounded-full transition-colors ${
        on ? "bg-primary" : "bg-border"
      }`}
    >
      <span
        className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-[18px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState<NotificationCategory[]>(
    notificationPreferences.map((p) => ({ ...p }))
  );
  const [saved, setSaved] = useState(false);

  function toggle(key: string, channel: "email" | "inApp") {
    setPrefs((prev) =>
      prev.map((p) =>
        p.key === key ? { ...p, [channel]: !p[channel] } : p
      )
    );
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-5">
      {/* Page heading */}
      <div>
        <h2 className="text-lg font-bold text-foreground">Notifications</h2>
        <p className="text-sm text-muted-foreground">
          Choose how you want to be notified for each event category.
        </p>
      </div>

      {/* Preferences card */}
      <div className="clean-card">
        <div className="border-b border-border px-5 py-3 flex items-center gap-2">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">
            Notification Preferences
          </h3>
        </div>

        {/* Column header */}
        <div className="flex items-center bg-muted/50 border-b border-border px-5 py-2">
          <span className={`flex-1 ${LABEL_CLASS}`}>Category</span>
          <div className="flex w-32 items-center justify-center gap-8">
            <div className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              <span className={LABEL_CLASS}>Email</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MonitorSmartphone className="h-3.5 w-3.5 text-muted-foreground" />
              <span className={LABEL_CLASS}>App</span>
            </div>
          </div>
        </div>

        {/* Preference rows */}
        <div className="divide-y divide-border">
          {prefs.map((pref) => (
            <div
              key={pref.key}
              className="flex items-center px-5 py-3.5"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {pref.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {pref.description}
                </p>
              </div>
              <div className="flex w-32 items-center justify-center gap-8 shrink-0">
                <Toggle
                  on={pref.email}
                  onToggle={() => toggle(pref.key, "email")}
                  ariaLabel={`${pref.label} email notifications`}
                />
                <Toggle
                  on={pref.inApp}
                  onToggle={() => toggle(pref.key, "inApp")}
                  ariaLabel={`${pref.label} in-app notifications`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Save footer */}
        <div className="border-t border-border px-5 py-3 flex items-center gap-3">
          <button onClick={handleSave} className="cta-primary text-xs">
            Save Preferences
          </button>
          {saved && (
            <span className="text-xs font-medium text-primary">
              Preferences saved
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
