import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { assemblePassportDPP } from "@/lib/dpp/assemble-passport";
import { hashPassportPayloadDeep } from "@/lib/dpp/hash-passport";
import { submitToRegistry } from "@/lib/cirpass/registry";
import type { Passport } from "@/types/passport";

const CIRPASS2_API_URL =
  process.env.CIRPASS2_API_URL ?? "http://localhost:3000/api/mock-cirpass2";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: passportId } = await params;
  const supabase = await createClient();

  // 1. Validate passport exists and is published
  const { data: passport, error: fetchError } = await supabase
    .from("passports")
    .select("*")
    .eq("id", passportId)
    .single();

  if (fetchError || !passport) {
    return NextResponse.json(
      { error: "Passport not found" },
      { status: 404 }
    );
  }

  const p = passport as Passport;
  if (p.status !== "published") {
    return NextResponse.json(
      { error: "Only published passports can be submitted to CIRPASS 2" },
      { status: 400 }
    );
  }

  try {
    // 2. Assemble DPP payload
    const dppPayload = await assemblePassportDPP(passportId);

    // 3. Compute integrity hash
    const payloadHash = hashPassportPayloadDeep(dppPayload);

    // 4. Insert anchor record
    const { data: anchor, error: anchorError } = await supabase
      .from("passport_anchors")
      .insert({
        passport_id: passportId,
        passport_version: p.passport_version,
        payload_hash: payloadHash,
        hash_algorithm: "sha256",
        anchor_type: "local",
      })
      .select()
      .single();

    if (anchorError || !anchor) {
      return NextResponse.json(
        { error: "Failed to create anchor record", details: anchorError?.message },
        { status: 500 }
      );
    }

    // 5. Submit to real CIRPASS 2 registry, fall back to mock
    let registryId: string | null = null;
    let submissionStatus: "accepted" | "rejected" = "accepted";
    let responsePayload: Record<string, unknown> = {};
    let errorMessage: string | null = null;

    try {
      const registryResult = await submitToRegistry(p);
      registryId = registryResult.registryId;
      responsePayload = registryResult as unknown as Record<string, unknown>;
    } catch {
      // Real registry unavailable — fall back to mock endpoint
      try {
        const cirpassResponse = await fetch(CIRPASS2_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dppPayload),
        });
        const cirpassResult = await cirpassResponse.json();
        registryId = cirpassResult.receiptId ?? null;
        submissionStatus =
          cirpassResult.status === "accepted" ? "accepted" : "rejected";
        responsePayload = cirpassResult;
        if (submissionStatus === "rejected") {
          errorMessage = (cirpassResult.errors ?? []).join("; ");
        }
      } catch (mockErr) {
        submissionStatus = "rejected";
        errorMessage =
          mockErr instanceof Error ? mockErr.message : "Mock endpoint failed";
      }
    }

    // 6. Insert submission record
    const { data: submission, error: submissionError } = await supabase
      .from("passport_submissions")
      .insert({
        passport_id: passportId,
        anchor_id: anchor.id,
        target_registry: "cirpass2",
        submission_status: submissionStatus,
        response_id: registryId,
        response_payload: responsePayload,
        error_message: errorMessage,
      })
      .select()
      .single();

    if (submissionError) {
      return NextResponse.json(
        {
          error: "Failed to record submission",
          details: submissionError.message,
        },
        { status: 500 }
      );
    }

    // 7. Update passport verification_status on success
    if (submissionStatus === "accepted") {
      await supabase
        .from("passports")
        .update({ verification_status: "verified" })
        .eq("id", passportId);
    }

    // 8. Return result
    return NextResponse.json({
      success: submissionStatus === "accepted",
      anchor: {
        id: anchor.id,
        payloadHash: anchor.payload_hash,
        anchoredAt: anchor.anchored_at,
        passportVersion: anchor.passport_version,
      },
      submission: {
        id: submission.id,
        status: submission.submission_status,
        receiptId: submission.response_id,
        submittedAt: submission.submitted_at,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Submission failed", details: message },
      { status: 500 }
    );
  }
}
