import { NextRequest, NextResponse } from "next/server";

const RENDERER_BE_URL =
  process.env.CIRPASS2_RENDERER_BE_URL ?? "http://localhost:8085";

/**
 * Catch-all proxy: forwards requests from the CIRPASS 2 frontend (port 4200)
 * to the renderer backend (port 8085).
 */
async function proxyRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const targetPath = path.join("/");
  const url = new URL(request.url);
  const targetUrl = `${RENDERER_BE_URL}/${targetPath}${url.search}`;

  const headers = new Headers();
  // Forward auth and content headers
  for (const [key, value] of request.headers.entries()) {
    if (
      key.startsWith("authorization") ||
      key.startsWith("content-") ||
      key === "accept" ||
      key === "x-requested-with"
    ) {
      headers.set(key, value);
    }
  }

  const init: RequestInit = {
    method: request.method,
    headers,
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
    // @ts-expect-error — Node fetch supports duplex streaming
    init.duplex = "half";
  }

  const upstream = await fetch(targetUrl, init);

  const responseHeaders = new Headers();
  for (const [key, value] of upstream.headers.entries()) {
    if (key !== "transfer-encoding") {
      responseHeaders.set(key, value);
    }
  }
  // Allow CORS from the CIRPASS 2 frontend
  responseHeaders.set("access-control-allow-origin", "*");
  responseHeaders.set(
    "access-control-allow-methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  responseHeaders.set(
    "access-control-allow-headers",
    "Authorization, Content-Type, Accept"
  );

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
      "access-control-allow-headers": "Authorization, Content-Type, Accept",
    },
  });
}
