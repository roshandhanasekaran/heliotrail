import { HeroSection } from "@/components/landing/hero-section";
import { TrustBar } from "@/components/landing/trust-bar";
import { CapabilitySection } from "@/components/landing/capability-section";
import { CTAFooter } from "@/components/landing/cta-footer";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <CapabilitySection />
      <CTAFooter />
    </>
  );
}
