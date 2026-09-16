import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "luxon";
import { expandSelection } from "@/lib/people";
import { getCalendarClient } from "@/lib/google";
import { computeAvailableSlots, type BusyBlock } from "@/lib/slots";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const personSlugs: string[] = body.personSlugs ?? [];
    const teamSlugs: string[] = body.teamSlugs ?? [];
    const durationMinutes: number = body.durationMinutes ?? 30;
    const days: number = Math.min(body.days ?? 14, 30);

    const people = expandSelection(personSlugs, teamSlugs);
    if (people.length === 0) {
      return NextResponse.json({ error: "Select at least one person or team" }, { status: 400 });
    }

    const timeMin = DateTime.utc();
    const timeMax = timeMin.plus({ days });

    const calendar = getCalendarClient();
    const freebusy = await calendar.freebusy.query({
      requestBody: {
        timeMin: timeMin.toISO()!,
        timeMax: timeMax.toISO()!,
        items: people.map((p) => ({ id: p.email })),
      },
    });

    const busyByPerson: Record<string, BusyBlock[]> = {};
    for (const person of people) {
      const calBusy = freebusy.data.calendars?.[person.email]?.busy ?? [];
      busyByPerson[person.slug] = calBusy
        .filter((b) => b.start && b.end)
        .map((b) => ({ start: b.start!, end: b.end! }));
    }

    const slots = computeAvailableSlots({
      people,
      busyByPerson,
      durationMinutes,
      days,
      startFrom: timeMin,
      bufferMinutes: 60,
    });

    return NextResponse.json({
      people: people.map((p) => ({ slug: p.slug, name: p.name, title: p.title, timezone: p.timezone })),
      slots,
    });
  } catch (err) {
    console.error("availability error", err);
    return NextResponse.json(
      { error: "Couldn't load availability. The calendar connection may need to be reconnected." },
      { status: 502 }
    );
  }
}
