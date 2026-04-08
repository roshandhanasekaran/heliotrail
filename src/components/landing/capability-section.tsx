import { Card, CardContent } from "@/components/ui/card";
import {
  FileTextIcon,
  ShieldCheckIcon,
  RecycleIcon,
  BarChart3Icon,
  ScanLineIcon,
  UsersIcon,
} from "lucide-react";

const capabilities = [
  {
    icon: FileTextIcon,
    title: "Complete Product Identity",
    description:
      "Every module gets a unique digital passport with manufacturer data, specifications, and full traceability from factory to field.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Compliance & Certifications",
    description:
      "Track IEC standards, CE declarations, and safety certifications with automatic expiry monitoring and status verification.",
  },
  {
    icon: RecycleIcon,
    title: "Circularity Intelligence",
    description:
      "Material composition, recyclability rates, dismantling guides, and critical raw material tracking for end-of-life planning.",
  },
  {
    icon: BarChart3Icon,
    title: "Carbon Footprint Tracking",
    description:
      "Cradle-to-gate carbon footprint per ISO 14067 with full methodology transparency and environmental product declarations.",
  },
  {
    icon: ScanLineIcon,
    title: "QR-Based Access",
    description:
      "Every passport has a unique public ID and QR code. Scan at the installation site to instantly access the module's full digital record.",
  },
  {
    icon: UsersIcon,
    title: "Role-Based Visibility",
    description:
      "Public data for consumers, restricted data for recyclers, and full access for manufacturers — all enforced at the database level.",
  },
];

export function CapabilitySection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          Platform Capabilities
        </p>
        <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Everything a PV passport needs
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          From manufacturing data to end-of-life recycling, HelioTrail captures
          the full lifecycle of every solar module.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((cap) => (
          <Card key={cap.title} className="transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <cap.icon className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-semibold">
                {cap.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {cap.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
