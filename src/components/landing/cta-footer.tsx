"use client";

import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import { ArrowRightIcon } from "lucide-react";

interface DemoPassport {
  public_id: string;
  model_id: string;
  rated_power_stc_w: number | null;
  module_technology: string | null;
}

const TECH_LABELS: Record<string, string> = {
  crystalline_silicon_topcon: "TOPCon",
  crystalline_silicon_perc: "PERC",
  crystalline_silicon_hjt: "HJT",
  thin_film_cdte: "CdTe",
  thin_film_cigs: "CIGS",
  other: "Other",
};

export function CTAFooter({ passports = [] }: { passports?: DemoPassport[] }) {
  // Fallback to hardcoded if no passports provided
  const demos: { href: string; label: string; primary: boolean }[] =
    passports.length >= 1
      ? passports.map((p, i) => ({
          href: `/passport/${p.public_id}`,
          label: `View ${TECH_LABELS[p.module_technology ?? ""] ?? ""} ${p.rated_power_stc_w ?? ""}W Passport`,
          primary: i === 0,
        }))
      : [
          { href: "/passport/topcon-550-bf-2026-001", label: "View TOPCon 550W Passport", primary: true },
          { href: "/passport/perc-450-mono-2026-002", label: "View PERC 450W Passport", primary: false },
          { href: "/passport/hjt-420-2026-003", label: "View HJT 420W Passport", primary: false },
        ];

  return (
    <section className="border-t border-border bg-muted">
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ready to see it in action?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Explore fully populated demo passports with real specifications,
            certifications, material data, and circularity information.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            {demos.map((demo) => (
              <Link key={demo.href} href={demo.href}>
                <button className={demo.primary ? "cta-primary" : "cta-secondary"}>
                  <span>{demo.label}</span>
                  {demo.primary && <ArrowRightIcon className="arrow-icon h-4 w-4" />}
                </button>
              </Link>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
