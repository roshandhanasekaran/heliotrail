import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PassportHero } from "@/components/passport/passport-hero";
import { PassportSectionNav } from "@/components/passport/passport-section-nav";
import type { Passport } from "@/types/passport";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ publicId: string }>;
  children: React.ReactNode;
}

async function getPassport(publicId: string): Promise<Passport | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("passports")
    .select("*")
    .eq("public_id", publicId)
    .single();
  return data as Passport | null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { publicId } = await params;
  const passport = await getPassport(publicId);
  if (!passport) return { title: "Passport Not Found" };
  return {
    title: `${passport.model_id} — ${passport.manufacturer_name}`,
    description: `Digital Product Passport for ${passport.model_id} (${passport.rated_power_stc_w}W ${passport.module_technology}) by ${passport.manufacturer_name}`,
  };
}

export default async function PassportLayout({ params, children }: Props) {
  const { publicId } = await params;
  const passport = await getPassport(publicId);
  if (!passport) notFound();

  return (
    <div>
      <PassportHero passport={passport} />
      <PassportSectionNav publicId={publicId} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
