import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRightIcon, ScanLineIcon } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1920&q=80"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left: Copy */}
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              EU ESPR-Aligned Platform
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Digital Product Passports{" "}
              <span className="text-primary">for Solar Energy</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              HelioTrail gives every photovoltaic module a trusted digital
              identity. Track materials, certifications, carbon footprint, and
              end-of-life circularity — all in one place.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/passport/topcon-550-bf-2026-001"
                className={buttonVariants({ size: "lg" })}
              >
                View Demo Passport
                <ArrowRightIcon className="ml-1.5 h-4 w-4" />
              </Link>
              <Link
                href="/scan"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                <ScanLineIcon className="mr-1.5 h-4 w-4" />
                Scan a Passport
              </Link>
            </div>
          </div>

          {/* Right: Floating passport card preview */}
          <div className="hidden lg:flex lg:justify-end">
            <div className="relative w-full max-w-sm">
              <div className="rounded-xl border border-border bg-card/90 p-6 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  Published &middot; Verified
                </div>
                <h3 className="mt-3 font-heading text-xl font-bold">
                  HT-550N-72-BF
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  550W TOPCon Bifacial Module
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    { label: "Efficiency", value: "21.8%" },
                    { label: "Carbon", value: "385 kg CO₂e" },
                    { label: "Recyclability", value: "92%" },
                    { label: "Lifetime", value: "35 years" },
                  ].map((kpi) => (
                    <div
                      key={kpi.label}
                      className="rounded-lg bg-muted/50 px-3 py-2"
                    >
                      <p className="text-xs text-muted-foreground">
                        {kpi.label}
                      </p>
                      <p className="text-sm font-semibold">{kpi.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {["IEC 61215", "IEC 61730", "IEC 62804", "UL 61730"].map(
                    (cert) => (
                      <span
                        key={cert}
                        className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                      >
                        {cert}
                      </span>
                    )
                  )}
                </div>
              </div>
              {/* Decorative stacked cards behind */}
              <div className="absolute -bottom-3 -right-3 -z-10 h-full w-full rounded-xl border border-border bg-card/50" />
              <div className="absolute -bottom-6 -right-6 -z-20 h-full w-full rounded-xl border border-border bg-card/30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
