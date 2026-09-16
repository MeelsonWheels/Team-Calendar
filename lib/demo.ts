import { DateTime } from "luxon";
import type { Person } from "./people";
import type { BusyBlock } from "./slots";

/**
 * Deterministic fake busy blocks per person, used only when no real Google
 * credentials are configured yet, so the booking UI can be previewed.
 */
export function mockBusyByPerson(people: Person[], days: number): Record<string, BusyBlock[]> {
  const result: Record<string, BusyBlock[]> = {};
  const now = DateTime.utc();

  people.forEach((person, personIndex) => {
    const blocks: BusyBlock[] = [];
    for (let d = 0; d < days; d++) {
      const day = now.plus({ days: d }).setZone(person.timezone).startOf("day");
      // Stagger a couple of fake meetings per day, offset per person so
      // combined-availability views still show some overlap.
      const meetingStart = day.set({ hour: 10 + (personIndex % 3) * 2, minute: 0 });
      blocks.push({
        start: meetingStart.toUTC().toISO()!,
        end: meetingStart.plus({ minutes: 45 }).toUTC().toISO()!,
      });
    }
    result[person.slug] = blocks;
  });

  return result;
}
