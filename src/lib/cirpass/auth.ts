const KEYCLOAK_URL =
  process.env.CIRPASS2_KEYCLOAK_URL ?? "http://localhost:18090";
const CLIENT_ID =
  process.env.CIRPASS2_KEYCLOAK_CLIENT_ID ?? "cirpass-e2e";
const CLIENT_SECRET =
  process.env.CIRPASS2_KEYCLOAK_CLIENT_SECRET ?? "cirpass-secret";
const EO_USERNAME = process.env.CIRPASS2_EO_USERNAME ?? "cirpass-eo";
const EO_PASSWORD = process.env.CIRPASS2_EO_PASSWORD ?? "cirpass-eo";

const TOKEN_ENDPOINT = `${KEYCLOAK_URL}/realms/cirpass/protocol/openid-connect/token`;

let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * Get a Bearer token from Keycloak for server-side CIRPASS 2 API calls.
 * Uses password grant with the Economic Operator user.
 * Caches the token until 30s before expiry.
 */
export async function getCirpassToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const body = new URLSearchParams({
    grant_type: "password",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    username: EO_USERNAME,
    password: EO_PASSWORD,
  });

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Keycloak token request failed (${res.status}): ${err}`);
  }

  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 30) * 1000,
  };

  return cachedToken.token;
}
