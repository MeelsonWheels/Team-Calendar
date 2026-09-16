"use client";

import { useEffect, useMemo, useState } from "react";
import { DateTime } from "luxon";
import { INDIVIDUALS, TEAMS, getPerson } from "@/lib/people";
import Avatar from "./Avatar";

interface Slot {
  start: string;
  end: string;
}

interface SelectedPersonInfo {
  slug: string;
  name: string;
  title: string;
  timezone: string;
}

const DURATIONS = [15, 30, 60];

export default function BookingWidget({
  initialPersonSlugs = [],
  initialTeamSlugs = [],
  lockSelection = false,
  heading,
  subheading,
}: {
  initialPersonSlugs?: string[];
  initialTeamSlugs?: string[];
  lockSelection?: boolean;
  heading: string;
  subheading?: string;
}) {
  const [personSlugs, setPersonSlugs] = useState<string[]>(initialPersonSlugs);
  const [teamSlugs, setTeamSlugs] = useState<string[]>(initialTeamSlugs);
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [people, setPeople] = useState<SelectedPersonInfo[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<{ meetLink?: string; htmlLink?: string; demo?: boolean } | null>(null);
  const [demo, setDemo] = useState(false);

  const localTz = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);
  const hasSelection = personSlugs.length > 0 || teamSlugs.length > 0;

  useEffect(() => {
    if (!hasSelection) {
      setSlots([]);
      setPeople([]);
      return;
    }
    setLoading(true);
    setError(null);
    setSelectedSlot(null);
    fetch("/api/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personSlugs, teamSlugs, durationMinutes: duration, days: 14 }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to load availability");
        setSlots(data.slots);
        setPeople(data.people);
        setDemo(Boolean(data.demo));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [personSlugs.join(","), teamSlugs.join(","), duration, hasSelection]);

  function togglePerson(slug: string) {
    setPersonSlugs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }

  function toggleTeam(slug: string) {
    setTeamSlugs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }

  const slotsByDay = useMemo(() => {
    const groups = new Map<string, Slot[]>();
    for (const slot of slots) {
      const day = DateTime.fromISO(slot.start).setZone(localTz).toFormat("cccc, LLL d");
      if (!groups.has(day)) groups.set(day, []);
      groups.get(day)!.push(slot);
    }
    return [...groups.entries()];
  }, [slots, localTz]);

  async function submitBooking() {
    if (!selectedSlot) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personSlugs,
          teamSlugs,
          start: selectedSlot.start,
          end: selectedSlot.end,
          bookerName: name,
          bookerEmail: email,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Booking failed");
      setConfirmed(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmed) {
    return (
      <div className="max-w-lg mx-auto p-8 text-center">
        {confirmed.demo && (
          <p className="text-xs uppercase tracking-wide mb-4 py-1 px-2 inline-block rounded"
             style={{ background: "var(--brand-gradient)", color: "#fff" }}>
            Demo — no real invite was sent
          </p>
        )}
        <h1 className="text-2xl font-semibold mb-2">You&apos;re booked</h1>
        <p className="text-neutral-500 mb-6">
          {selectedSlot &&
            DateTime.fromISO(selectedSlot.start).setZone(localTz).toFormat("cccc, LLL d 'at' h:mm a")}{" "}
          ({localTz})
        </p>
        <p className="text-sm text-neutral-500 mb-4">
          {confirmed.demo ? "In production, a calendar invite would be sent to " : "A calendar invite has been sent to "}
          {email}.
        </p>
        {confirmed.meetLink && (
          <a href={confirmed.meetLink} className="text-blue-600 underline block mb-2" target="_blank">
            Join with Google Meet
          </a>
        )}
        {confirmed.htmlLink && (
          <a href={confirmed.htmlLink} className="text-blue-600 underline block" target="_blank">
            View in Google Calendar
          </a>
        )}
      </div>
    );
  }

  if (selectedSlot) {
    return (
      <div className="max-w-lg mx-auto p-8">
        <button className="text-sm text-neutral-500 mb-4" onClick={() => setSelectedSlot(null)}>
          &larr; Back to times
        </button>
        <h1 className="text-xl font-semibold mb-1">{heading}</h1>
        <p className="text-neutral-500 mb-6">
          {DateTime.fromISO(selectedSlot.start).setZone(localTz).toFormat("cccc, LLL d 'at' h:mm a")} ({localTz}) ·{" "}
          {duration} min
        </p>
        <div className="space-y-3">
          <input
            className="w-full border rounded-md px-3 py-2"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full border rounded-md px-3 py-2"
            placeholder="Your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <textarea
            className="w-full border rounded-md px-3 py-2"
            placeholder="Anything you'd like to share (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            className="w-full text-white rounded-md py-2 disabled:opacity-50"
            style={{ background: "var(--brand-gradient)" }}
            disabled={!name || !email || submitting}
            onClick={submitBooking}
          >
            {submitting ? "Booking..." : "Confirm booking"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      {demo && (
        <p
          className="text-xs uppercase tracking-wide mb-4 py-1.5 px-3 inline-block rounded-full"
          style={{ background: "var(--brand-gradient)", color: "#fff" }}
        >
          Demo data — Google Calendar isn&apos;t connected yet
        </p>
      )}
      <h1 className="text-2xl font-semibold mb-1">{heading}</h1>
      {subheading && <p className="text-neutral-500 mb-6">{subheading}</p>}

      {!lockSelection && (
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="font-medium mb-2 text-sm text-neutral-500 uppercase tracking-wide">People</h2>
            <div className="space-y-2">
              {INDIVIDUALS.map((p) => (
                <label key={p.slug} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={personSlugs.includes(p.slug)} onChange={() => togglePerson(p.slug)} />
                  <Avatar person={p} size={24} />
                  {p.name} <span className="text-neutral-400">· {p.title}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-medium mb-2 text-sm text-neutral-500 uppercase tracking-wide">Teams</h2>
            <div className="space-y-1">
              {TEAMS.map((t) => (
                <label key={t.slug} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={teamSlugs.includes(t.slug)} onChange={() => toggleTeam(t.slug)} />
                  {t.name}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {hasSelection && (
        <div className="flex items-center gap-4 mb-6 text-sm flex-wrap">
          <span className="text-neutral-500 flex items-center gap-2 flex-wrap">
            With:
            {people.length === 0 && "..."}
            {people.map((p) => {
              const full = getPerson(p.slug);
              return full ? (
                <span key={p.slug} className="flex items-center gap-1">
                  <Avatar person={full} size={20} />
                  {p.name}
                </span>
              ) : (
                p.name
              );
            })}
          </span>
          <select
            className="border rounded-md px-2 py-1"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          >
            {DURATIONS.map((d) => (
              <option key={d} value={d}>
                {d} min
              </option>
            ))}
          </select>
          <span className="text-neutral-400">Times shown in {localTz}</span>
        </div>
      )}

      {!hasSelection && <p className="text-neutral-500">Select at least one person or team to see open times.</p>}
      {loading && <p className="text-neutral-500">Finding times that work for everyone...</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {!loading && hasSelection && slots.length === 0 && !error && (
        <p className="text-neutral-500">No shared availability in the next two weeks.</p>
      )}

      <div className="space-y-6">
        {slotsByDay.map(([day, daySlots]) => (
          <div key={day}>
            <h3 className="text-sm font-medium mb-2">{day}</h3>
            <div className="flex flex-wrap gap-2">
              {daySlots.map((slot) => (
                <button
                  key={slot.start}
                  className="slot-btn border rounded-md px-3 py-1.5 text-sm transition"
                  style={{ borderColor: "var(--brand-border)" }}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {DateTime.fromISO(slot.start).setZone(localTz).toFormat("h:mm a")}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
