import { FadeIn } from "@/components/ui/fade-in";
import Link from "next/link";
import { ArrowRight, Shield, Leaf, Globe, FileText, Recycle, Link2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <FadeIn>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          About HelioTrail
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          HelioTrail is a Digital Product Passport (DPP) platform purpose-built
          for the solar photovoltaic industry. We help manufacturers, importers,
          and compliance teams meet the EU&apos;s Ecodesign for Sustainable Products
          Regulation (ESPR) requirements — from raw material traceability to
          end-of-life recycling.
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: FileText, title: "Complete DPP", desc: "127+ data fields covering product identity, technical specs, carbon footprint, material composition, and warranty — aligned with ESPR Annex III and DIN DKE SPEC 99100." },
            { icon: Link2, title: "Full Traceability", desc: "5-tier supply chain mapping from quartz mining to module assembly, with chain of custody events and cryptographic evidence hashes." },
            { icon: Shield, title: "Compliance Ready", desc: "Built-in REACH, RoHS, and WEEE compliance tracking with certificate management and regulatory readiness scoring." },
            { icon: Recycle, title: "Circularity Data", desc: "Material recovery rates, dismantling instructions, recycler contacts, and end-of-life tracking for every module." },
            { icon: Leaf, title: "Carbon Transparency", desc: "ISO 14067 carbon footprint declarations with cradle-to-gate LCA boundary, methodology tracking, and third-party verification." },
            { icon: Globe, title: "EU Market Access", desc: "Per-country market readiness assessment covering CE marking, ALMM listing, and national certification requirements." },
          ].map((item) => (
            <div key={item.title} className="clean-card p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="mt-16 clean-card p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground">
            See it in action
          </h2>
          <p className="mt-2 text-muted-foreground">
            Explore a live demo passport or sign in to manage your own.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/scan">
              <button className="cta-primary">
                <span>Look Up Passport</span>
                <ArrowRight className="arrow-icon h-4 w-4" />
              </button>
            </Link>
            <Link href="/sign-in">
              <button className="cta-secondary">
                <span>Sign In</span>
              </button>
            </Link>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
