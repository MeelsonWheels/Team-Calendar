import { NextResponse } from "next/server";
import { getConsentUrl } from "@/lib/google";

// One-time setup route. Visit /api/auth/google/start, sign in with the
// Google account that should send/own the booking invites, and copy the
// refresh token shown at the callback into GOOGLE_REFRESH_TOKEN.
export async function GET() {
  return NextResponse.redirect(getConsentUrl());
}
