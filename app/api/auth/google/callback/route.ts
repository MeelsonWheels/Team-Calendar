import { NextRequest, NextResponse } from "next/server";
import { createOAuthClient } from "@/lib/google";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Missing ?code" }, { status: 400 });
  }

  const client = createOAuthClient();
  const { tokens } = await client.getToken(code);

  if (!tokens.refresh_token) {
    return NextResponse.json(
      {
        error:
          "No refresh_token returned. Revoke prior access at https://myaccount.google.com/permissions and try /api/auth/google/start again.",
      },
      { status: 400 }
    );
  }

  // Shown once, not stored anywhere. Copy this into Vercel's
  // GOOGLE_REFRESH_TOKEN environment variable, then redeploy.
  return NextResponse.json({
    message: "Copy this value into the GOOGLE_REFRESH_TOKEN env var on Vercel, then redeploy.",
    refresh_token: tokens.refresh_token,
  });
}
