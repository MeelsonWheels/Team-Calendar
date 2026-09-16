import { NextRequest, NextResponse } from "next/server";
import { expandSelection } from "@/lib/people";
import { getCalendarClient } from "@/lib/google";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const personSlugs: string[] = body.personSlugs ?? [];
    const teamSlugs: string[] = body.teamSlugs ?? [];
    const start: string = body.start;
    const end: string = body.end;
    const bookerName: string = (body.bookerName ?? "").trim();
    const bookerEmail: string = (body.bookerEmail ?? "").trim();
    const notes: string = (body.notes ?? "").trim();

    if (!start || !end) {
      return NextResponse.json({ error: "Missing start/end" }, { status: 400 });
    }
    if (!bookerName || !isValidEmail(bookerEmail)) {
      return NextResponse.json({ error: "A valid name and email are required" }, { status: 400 });
    }

    const people = expandSelection(personSlugs, teamSlugs);
    if (people.length === 0) {
      return NextResponse.json({ error: "Select at least one person or team" }, { status: 400 });
    }

    const calendar = getCalendarClient();

    // Re-check freebusy right before booking to avoid double-booking races.
    const freebusy = await calendar.freebusy.query({
      requestBody: { timeMin: start, timeMax: end, items: people.map((p) => ({ id: p.email })) },
    });
    const conflict = people.find((p) => (freebusy.data.calendars?.[p.email]?.busy ?? []).length > 0);
    if (conflict) {
      return NextResponse.json(
        { error: `${conflict.name} is no longer free at that time. Please pick another slot.` },
        { status: 409 }
      );
    }

    const summary =
      people.length === 1
        ? `${bookerName} <> ${people[0].name} (Sisu)`
        : `${bookerName} <> Sisu (${people.map((p) => p.name).join(", ")})`;

    const event = await calendar.events.insert({
      calendarId: "primary",
      sendUpdates: "all",
      conferenceDataVersion: 1,
      requestBody: {
        summary,
        description: notes || undefined,
        start: { dateTime: start },
        end: { dateTime: end },
        attendees: [
          { email: bookerEmail, displayName: bookerName },
          ...people.map((p) => ({ email: p.email, displayName: p.name })),
        ],
        conferenceData: {
          createRequest: {
            requestId: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      },
    });

    return NextResponse.json({
      eventId: event.data.id,
      htmlLink: event.data.htmlLink,
      meetLink: event.data.hangoutLink,
    });
  } catch (err) {
    console.error("booking error", err);
    return NextResponse.json(
      { error: "Couldn't complete the booking. Please try again in a moment." },
      { status: 502 }
    );
  }
}
