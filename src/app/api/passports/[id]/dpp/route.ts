import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { assemblePassportDPP } from "@/lib/dpp/assemble-passport";
import { assemblePassportCirpass2 } from "@/lib/dpp/assemble-passport-cirpass2";

/**
 * Serves the DPP JSON payload for a passport.
 *
 * Query params:
 *   ?format=cirpass2  — flat CIRPASS-2 schema (pv-passport-v1.json)
 *   (default)         — nested ESPR-aligned DPP structure
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: passportId } = await params;
  const supabase = await createClient();

  // Accept either UUID (id) or public_id
  const { data: passport } = await supabase
    .from("passports")
    .select("id")
    .or(`id.eq.${passportId},public_id.eq.${passportId}`)
    .single();

  if (!passport) {
    return NextResponse.json({ error: "Passport not found" }, { status: 404 });
  }

  const url = new URL(request.url);
  const format = url.searchParams.get("format");

  if (format === "cirpass2") {
    const dpp = await assemblePassportCirpass2(passport.id);
    return NextResponse.json(dpp);
  }

  const dpp = await assemblePassportDPP(passport.id);
  return NextResponse.json(dpp);
}
