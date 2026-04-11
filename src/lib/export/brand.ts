import { createClient } from "@/lib/supabase/server";
import { DEFAULT_BRAND, type BrandConfig } from "./types";

export async function loadBrandConfig(): Promise<BrandConfig> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("organization_brand_settings")
      .select("*")
      .limit(1)
      .single();

    if (!data) return DEFAULT_BRAND;

    return {
      logoUrl: data.logo_url ?? DEFAULT_BRAND.logoUrl,
      logoDarkUrl: data.logo_dark_url ?? DEFAULT_BRAND.logoDarkUrl,
      primaryColor: data.primary_color ?? DEFAULT_BRAND.primaryColor,
      secondaryColor: data.secondary_color ?? DEFAULT_BRAND.secondaryColor,
      accentColor: data.accent_color ?? DEFAULT_BRAND.accentColor,
      fontFamily: data.font_family ?? DEFAULT_BRAND.fontFamily,
      reportHeaderText: data.report_header_text ?? DEFAULT_BRAND.reportHeaderText,
      reportFooterText: data.report_footer_text ?? DEFAULT_BRAND.reportFooterText,
      showQrCode: data.show_qr_code ?? DEFAULT_BRAND.showQrCode,
    };
  } catch {
    // Table may not exist yet — use defaults
    return DEFAULT_BRAND;
  }
}
