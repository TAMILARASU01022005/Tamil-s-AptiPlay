import { handlers } from "@/lib/auth";
import type { NextRequest } from "next/server";

/**
 * Dynamically resolve the public base URL from Render's proxy headers.
 * Render forwards:
 *   x-forwarded-host  → tamil-s-aptiplay.onrender.com
 *   x-forwarded-proto → https
 *
 * Without this, NextAuth picks up the internal host (localhost:10000)
 * and generates wrong callback/redirect URLs.
 */
function resolveBaseUrl(req: NextRequest): string {
  const forwardedHost = req.headers.get("x-forwarded-host");
  const forwardedProto = req.headers.get("x-forwarded-proto") ?? "https";
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost.split(",")[0].trim()}`;
  }
  return process.env.NEXTAUTH_URL ?? "http://localhost:3000";
}

export async function GET(req: NextRequest, ctx: { params: { nextauth: string[] } }) {
  const baseUrl = resolveBaseUrl(req);
  process.env.NEXTAUTH_URL = baseUrl;
  return handlers.GET(req, ctx as any);
}

export async function POST(req: NextRequest, ctx: { params: { nextauth: string[] } }) {
  const baseUrl = resolveBaseUrl(req);
  process.env.NEXTAUTH_URL = baseUrl;
  return handlers.POST(req, ctx as any);
}
