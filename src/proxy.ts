import { updateSession } from "@/lib/supabase/proxy";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Only run proxy on routes that need auth:
     * - /app/* (authenticated portal)
     * - /sign-in, /sign-up (redirect if already logged in)
     * - /auth/* (callback handler)
     */
    "/app/:path*",
    "/sign-in",
    "/sign-up",
    "/auth/:path*",
  ],
};
