"use client";

import { useMemo, useState } from "react";
import { DateTime } from "luxon";

const WEEKDAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export default function Calendar({
  timezone,
  availableDates,
  selectedDate,
  onSelect,
}: {
  timezone: string;
  /** Set of "yyyy-LL-dd" date keys (in `timezone`) that have at least one open slot. */
  availableDates: Set<string>;
  selectedDate: string | null;
  onSelect: (dateKey: string) => void;
}) {
  const today = useMemo(() => DateTime.now().setZone(timezone).startOf("day"), [timezone]);
  const [viewMonth, setViewMonth] = useState(() => today.startOf("month"));

  const minMonth = today.startOf("month");
  const maxAvailable = useMemo(() => {
    const keys = [...availableDates];
    if (keys.length === 0) return today;
    return keys.reduce((max, key) => {
      const d = DateTime.fromFormat(key, "yyyy-LL-dd", { zone: timezone });
      return d > max ? d : max;
    }, today);
  }, [availableDates, timezone, today]);
  const maxMonth = maxAvailable.startOf("month");

  const canGoPrev = viewMonth > minMonth;
  const canGoNext = viewMonth < maxMonth;

  const cells = useMemo(() => {
    const firstOfMonth = viewMonth;
    const leading = firstOfMonth.weekday - 1; // Monday-start grid
    const daysInMonth = firstOfMonth.daysInMonth ?? 30;
    const totalCells = Math.ceil((leading + daysInMonth) / 7) * 7;

    return Array.from({ length: totalCells }, (_, i) => {
      const dayNum = i - leading + 1;
      if (dayNum < 1 || dayNum > daysInMonth) return null;
      return firstOfMonth.set({ day: dayNum });
    });
  }, [viewMonth]);

  return (
    <div className="w-full max-w-[280px]">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          aria-label="Previous month"
          disabled={!canGoPrev}
          onClick={() => setViewMonth((m) => m.minus({ months: 1 }))}
          className="w-7 h-7 rounded-full border flex items-center justify-center disabled:opacity-30"
          style={{ borderColor: "var(--brand-border)" }}
        >
          &lsaquo;
        </button>
        <span className="text-sm font-medium">{viewMonth.toFormat("LLLL yyyy")}</span>
        <button
          type="button"
          aria-label="Next month"
          disabled={!canGoNext}
          onClick={() => setViewMonth((m) => m.plus({ months: 1 }))}
          className="w-7 h-7 rounded-full border flex items-center justify-center disabled:opacity-30"
          style={{ borderColor: "var(--brand-border)" }}
        >
          &rsaquo;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-neutral-400 mb-1">
        {WEEKDAY_LABELS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <div key={i} />;
          const key = date.toFormat("yyyy-LL-dd");
          const isAvailable = availableDates.has(key);
          const isSelected = selectedDate === key;
          const isPast = date < today;

          return (
            <button
              key={key}
              type="button"
              disabled={!isAvailable || isPast}
              onClick={() => onSelect(key)}
              className="aspect-square rounded-full text-sm transition disabled:opacity-25 disabled:cursor-default"
              style={
                isSelected
                  ? { background: "var(--brand-gradient)", color: "#fff" }
                  : isAvailable
                    ? { border: "1px solid var(--brand-border)" }
                    : undefined
              }
            >
              {date.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
