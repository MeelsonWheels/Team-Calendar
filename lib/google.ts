import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var ${name}`);
  return v;
}

/** OAuth2 client used for the one-time consent flow (lib/google.ts start/callback routes). */
export function createOAuthClient() {
  return new google.auth.OAuth2(
    requiredEnv("GOOGLE_CLIENT_ID"),
    requiredEnv("GOOGLE_CLIENT_SECRET"),
    requiredEnv("GOOGLE_REDIRECT_URI")
  );
}

export function getConsentUrl() {
  const client = createOAuthClient();
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });
}

/**
 * Server-side client authenticated as the booking connector account, using a
 * long-lived refresh token obtained once via /api/auth/google/start.
 */
export function getCalendarClient() {
  const client = createOAuthClient();
  client.setCredentials({ refresh_token: requiredEnv("GOOGLE_REFRESH_TOKEN") });
  return google.calendar({ version: "v3", auth: client });
}
