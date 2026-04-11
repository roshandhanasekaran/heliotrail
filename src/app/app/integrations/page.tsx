"use client";

import { useState } from "react";
import { Plug, Database, Factory, BarChart3, Shield, Wifi } from "lucide-react";

const integrations = [
  {
    name: "ERP System",
    description: "Connect SAP, Oracle, or other ERP for automated passport data import",
    icon: Database,
    status: "available",
  },
  {
    name: "MES / PLM",
    description: "Sync manufacturing execution and product lifecycle data",
    icon: Factory,
    status: "available",
  },
  {
    name: "LCA / EPD Tools",
    description: "Import lifecycle assessment and environmental product declarations",
    icon: BarChart3,
    status: "available",
  },
  {
    name: "Certification Systems",
    description: "Automated certificate verification and renewal tracking",
    icon: Shield,
    status: "coming_soon",
  },
  {
    name: "SCADA / IoT",
    description: "Connect monitoring systems for real-time performance data",
    icon: Wifi,
    status: "coming_soon",
  },
];

export default function IntegrationsPage() {
  const [toastName, setToastName] = useState<string | null>(null);

  function handleConfigure(name: string) {
    setToastName(name);
    setTimeout(() => setToastName(null), 3000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Integrations</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Connect external systems to automate passport data flows
        </p>
      </div>

      {toastName && (
        <div className="flex items-center gap-2 bg-[var(--passport-green-muted)] px-4 py-2 text-sm font-medium text-foreground">
          <Plug className="h-4 w-4 text-primary" />
          <span>
            {toastName} integration setup requested. Our team will reach out within 24 hours.
          </span>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => (
          <div key={integration.name} className="clean-card p-4">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center bg-muted">
                <integration.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              {integration.status === "coming_soon" && (
                <span className="bg-muted px-2 py-0.5 text-[0.6875rem] font-semibold text-muted-foreground">
                  Coming Soon
                </span>
              )}
            </div>
            <h3 className="mt-3 text-sm font-bold text-foreground">
              {integration.name}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {integration.description}
            </p>
            {integration.status === "available" && (
              <button
                className="cta-secondary mt-3 w-full justify-center text-xs"
                onClick={() => handleConfigure(integration.name)}
              >
                <span>Configure</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
