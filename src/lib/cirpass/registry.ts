import { getCirpassToken } from "./auth";
import type { Passport } from "@/types/passport";

const REGISTRY_URL =
  process.env.CIRPASS2_REGISTRY_URL ?? "http://localhost:18082";

interface RegistryMetadata {
  upi: string;
  reoId: string;
  liveURL: string;
  backupURL: string;
  commodityCode: string;
  facilitiesId: string[];
  granularityLevel: "MODEL" | "BATCH" | "ITEM";
}

interface RegistryResponse {
  registryId: string;
  createdAt: string;
  metadata: RegistryMetadata;
  modifiedAt: string;
}

/**
 * Submit passport metadata to the real CIRPASS 2 Mock EU Registry.
 * Maps HelioTrail passport fields to the registry metadata schema.
 */
export async function submitToRegistry(
  passport: Passport
): Promise<RegistryResponse> {
  const token = await getCirpassToken();

  // Use host.docker.internal so the Docker-hosted validator can reach our dev server
  const hostUrl =
    process.env.CIRPASS2_HOST_URL ?? "http://host.docker.internal:3000";

  const metadata: RegistryMetadata = {
    upi: passport.pv_passport_id,
    reoId: passport.manufacturer_operator_id ?? "EO-UNKNOWN",
    liveURL: `${hostUrl}/api/passports/${passport.id}/dpp`,
    backupURL: `https://heliotrail.com/passport/${passport.public_id}`,
    commodityCode: "8541", // HS code for photovoltaic cells/modules
    facilitiesId: [passport.facility_id ?? "FAC-UNKNOWN"],
    granularityLevel: "MODEL",
  };

  const res = await fetch(`${REGISTRY_URL}/metadata/v1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(metadata),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(
      `CIRPASS 2 registry submission failed (${res.status}): ${err}`
    );
  }

  return res.json();
}
