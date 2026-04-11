import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import { currentUser } from "@/lib/mock/settings";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-0">
      {/* Settings header */}
      <div className="-m-4 mb-0 border-b border-border bg-muted/50 p-4 lg:-m-6 lg:mb-0 lg:p-6">
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Manage your account, organization, and workspace configuration
        </p>
      </div>

      {/* Body with sidebar + content */}
      <div className="flex gap-6 pt-6">
        <SettingsSidebar userRole={currentUser.role} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
