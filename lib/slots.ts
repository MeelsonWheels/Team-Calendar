import { DateTime, Interval } from "luxon";
import type { Person } from "./people";

export interface BusyBlock {
  start: string; // ISO
  end: string; // ISO
}

export interface Slot {
  start: string; // ISO (UTC)
  end: string; // ISO (UTC)
}

/**
 * Working-hours intervals for one person, on one calendar day (identified by
 * the reference date in UTC), converted to UTC. Returns [] if the person is
 * off that day in their own timezone.
 */
function workingIntervalsForDay(person: Person, utcDay: DateTime): Interval[] {
  const localDay = utcDay.setZone(person.timezone);
  const hours = person.workingHours[localDay.weekday % 7];
  if (!hours) return [];

  const [startH, startM] = hours.start.split(":").map(Number);
  const [endH, endM] = hours.end.split(":").map(Number);

  const start = localDay.set({ hour: startH, minute: startM, second: 0, millisecond: 0 });
  const end = localDay.set({ hour: endH, minute: endM, second: 0, millisecond: 0 });
  if (end <= start) return [];
  return [Interval.fromDateTimes(start.toUTC(), end.toUTC())];
}

function intersectAll(intervalLists: Interval[][]): Interval[] {
  if (intervalLists.length === 0) return [];
  let acc = intervalLists[0];
  for (let i = 1; i < intervalLists.length; i++) {
    const next: Interval[] = [];
    for (const a of acc) {
      for (const b of intervalLists[i]) {
        const overlap = a.intersection(b);
        if (overlap) next.push(overlap);
      }
    }
    acc = next;
  }
  return acc;
}

function subtractBusy(available: Interval[], busy: BusyBlock[]): Interval[] {
  let result = available;
  for (const block of busy) {
    const busyInterval = Interval.fromDateTimes(
      DateTime.fromISO(block.start),
      DateTime.fromISO(block.end)
    );
    const next: Interval[] = [];
    for (const slot of result) {
      next.push(...slot.difference(busyInterval));
    }
    result = next;
  }
  return result;
}

/**
 * All working-hours windows (in UTC) for one person across the full date
 * range, computed once per local calendar day so adjacent days can never
 * overlap or be double-counted.
 */
function personWindowsForRange(person: Person, startFrom: DateTime, days: number): Interval[] {
  const localStart = startFrom.setZone(person.timezone).startOf("day");
  const windows: Interval[] = [];
  // -1 to +days covers every local day that could overlap the UTC range,
  // regardless of the person's offset from UTC.
  for (let d = -1; d <= days; d++) {
    windows.push(...workingIntervalsForDay(person, localStart.plus({ days: d }).toUTC()));
  }
  return windows;
}

/**
 * Compute open slots for a group of people over the next `days` days,
 * combining each person's working hours and busy blocks so only times
 * that work for everyone are returned.
 */
export function computeAvailableSlots(params: {
  people: Person[];
  busyByPerson: Record<string, BusyBlock[]>;
  durationMinutes: number;
  days: number;
  startFrom?: DateTime;
  bufferMinutes?: number;
}): Slot[] {
  const { people, busyByPerson, durationMinutes, days } = params;
  const startFrom = params.startFrom ?? DateTime.utc();
  const buffer = params.bufferMinutes ?? 0;
  const horizon = startFrom.plus({ days });
  const slots: Slot[] = [];

  const perPersonWindows = people.map((person) => {
    const windows = personWindowsForRange(person, startFrom, days);
    const busy = busyByPerson[person.slug] ?? [];
    return subtractBusy(windows, busy);
  });

  const commonWindows = intersectAll(perPersonWindows);

  for (const window of commonWindows) {
    if (!window.start || !window.end) continue;
    const windowEnd = window.end;
    let cursor = window.start;
    while (cursor.plus({ minutes: durationMinutes }) <= windowEnd) {
      const slotStart = cursor;
      const slotEnd = cursor.plus({ minutes: durationMinutes });
      if (slotStart > startFrom.plus({ minutes: buffer }) && slotEnd <= horizon) {
        slots.push({ start: slotStart.toISO()!, end: slotEnd.toISO()! });
      }
      cursor = cursor.plus({ minutes: 15 }); // 15-min grid
    }
  }

  return slots.sort((a, b) => a.start.localeCompare(b.start));
}
