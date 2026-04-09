import { createHash } from "crypto";

/**
 * Compute a deterministic SHA-256 hash of a DPP JSON payload.
 * Keys are sorted to produce a canonical representation.
 */
export function hashPassportPayload(dppJson: object): string {
  const canonical = JSON.stringify(dppJson, Object.keys(dppJson).sort());
  return createHash("sha256").update(canonical).digest("hex");
}

/**
 * Deep-sort all keys in a nested object for canonical JSON.
 */
function sortObjectKeys(obj: unknown): unknown {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(sortObjectKeys);
  const sorted: Record<string, unknown> = {};
  for (const key of Object.keys(obj as Record<string, unknown>).sort()) {
    sorted[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
  }
  return sorted;
}

/**
 * Compute SHA-256 hash with fully deep-sorted canonical JSON.
 * Strips `generatedAt` to ensure the same passport always produces the same hash.
 */
export function hashPassportPayloadDeep(dppJson: object): string {
  const { generatedAt: _, ...stable } = dppJson as Record<string, unknown>;
  const canonical = JSON.stringify(sortObjectKeys(stable));
  return createHash("sha256").update(canonical).digest("hex");
}
