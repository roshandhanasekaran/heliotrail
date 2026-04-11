import { createClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/landing/hero-section";
import { TrustBar } from "@/components/landing/trust-bar";
import { CapabilitySection } from "@/components/landing/capability-section";
import { CTAFooter } from "@/components/landing/cta-footer";

export default async function LandingPage() {
  let demos: { public_id: string; model_id: string; rated_power_stc_w: number | null; module_technology: string | null }[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("passports")
      .select("public_id, model_id, rated_power_stc_w, module_technology")
      .eq("status", "published")
      .order("rated_power_stc_w", { ascending: false })
      .limit(3);
    demos = data ?? [];
  } catch {
    // No auth session (public visitor) — fall back to defaults
  }
  const heroPassportId = demos[0]?.public_id ?? "topcon-550-bf-2026-001";

  return (
    <>
      <HeroSection demoPassportId={heroPassportId} />
      <TrustBar />
      <CapabilitySection />
      <CTAFooter passports={demos} />
    </>
  );
}
