import {
  ShieldCheckIcon,
  RecycleIcon,
  GlobeIcon,
  ZapIcon,
} from "lucide-react";

const items = [
  { icon: ShieldCheckIcon, label: "EU ESPR Aligned" },
  { icon: RecycleIcon, label: "Circularity Tracked" },
  { icon: GlobeIcon, label: "Open & Interoperable" },
  { icon: ZapIcon, label: "Real-Time Verified" },
];

export function TrustBar() {
  return (
    <section className="border-y border-border bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-8 px-4 py-6 sm:px-6 lg:gap-16 lg:px-8">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <item.icon className="h-4 w-4 text-primary" />
            <span className="font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
