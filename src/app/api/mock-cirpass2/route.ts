import { NextResponse } from "next/server";
import type { DPPPayload } from "@/types/dpp";

/**
 * Mock CIRPASS 2 portal endpoint.
 * Simulates the acceptance flow: validates required fields,
 * returns a receipt ID or rejection with errors.
 */
export async function POST(request: Request) {
  let body: DPPPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        status: "rejected",
        errors: ["Invalid JSON body"],
      },
      { status: 400 }
    );
  }

  const errors: string[] = [];

  if (!body.identity?.pvPassportId) {
    errors.push("Missing identity.pvPassportId");
  }
  if (!body.manufacturer?.name) {
    errors.push("Missing manufacturer.name");
  }
  if (!body.technicalData) {
    errors.push("Missing technicalData");
  }
  if (!body.schemaVersion) {
    errors.push("Missing schemaVersion");
  }

  if (errors.length > 0) {
    return NextResponse.json(
      {
        status: "rejected",
        errors,
      },
      { status: 422 }
    );
  }

  // Simulate successful acceptance
  const receiptId = `CIRPASS2-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return NextResponse.json({
    status: "accepted",
    receiptId,
    registeredAt: new Date().toISOString(),
    passportId: body.identity.pvPassportId,
    schemaVersion: body.schemaVersion,
  });
}
