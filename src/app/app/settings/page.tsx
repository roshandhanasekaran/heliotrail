import { Settings, User, Building2, Users, Key, Bell } from "lucide-react";

const sections = [
  {
    id: "profile",
    icon: User,
    title: "Profile",
    description: "Manage your personal information",
    fields: [
      { label: "Full Name", value: "Demo User", type: "text" },
      { label: "Email", value: "demo@heliotrail.com", type: "email" },
      { label: "Role", value: "Admin", type: "readonly" },
    ],
  },
  {
    id: "organization",
    icon: Building2,
    title: "Organization",
    description: "Configure your tenant settings",
    fields: [
      { label: "Organization Name", value: "Waaree Energies Ltd.", type: "text" },
      { label: "Domain", value: "waaree.com", type: "text" },
      { label: "Default Facility", value: "Surat Mega Factory", type: "text" },
    ],
  },
  {
    id: "team",
    icon: Users,
    title: "Users & Roles",
    description: "Manage team access and permissions",
    count: "3 users",
  },
  {
    id: "api",
    icon: Key,
    title: "API Keys",
    description: "Manage API keys for integrations",
    count: "1 active key",
  },
  {
    id: "notifications",
    icon: Bell,
    title: "Notifications",
    description: "Configure email and in-app notification preferences",
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account, organization, and workspace configuration
        </p>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="clean-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center bg-muted">
                  <section.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    {section.title}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {section.description}
                  </p>
                </div>
              </div>
              {"count" in section && section.count && (
                <span className="bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                  {section.count}
                </span>
              )}
            </div>

            {"fields" in section && section.fields && (
              <div className="p-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {section.fields.map((field) => (
                    <div key={field.label}>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {field.label}
                      </label>
                      <input
                        type={field.type === "readonly" ? "text" : field.type}
                        defaultValue={field.value}
                        readOnly={field.type === "readonly"}
                        className="mt-1 block w-full border border-border bg-background px-3 py-2 text-sm text-foreground read-only:bg-muted read-only:text-muted-foreground focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <button className="cta-primary text-xs">Save Changes</button>
                </div>
              </div>
            )}

            {!("fields" in section) && (
              <div className="p-4">
                <button className="cta-secondary text-xs">
                  <span>Manage {section.title}</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
