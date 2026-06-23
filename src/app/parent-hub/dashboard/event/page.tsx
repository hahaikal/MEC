"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EVENTS, type GalleryItem } from "@/lib/parent-hub-data";
import { GalleryGrid } from "@/components/parent-hub/gallery-grid";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// parse "5 Jun 2026" -> Date
function parseEventDate(s: string): Date | null {
  const map: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  const [d, m, y] = s.split(" ");
  if (!d || !m || !y) return null;
  return new Date(parseInt(y), map[m] ?? 0, parseInt(d));
}

export default function EventPage() {
  const today = new Date();
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selected, setSelected] = useState<Date>(today);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, GalleryItem[]>();
    for (const e of EVENTS) {
      const d = parseEventDate(e.date);
      if (!d) continue;
      const k = d.toDateString();
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(e);
    }
    return map;
  }, []);

  const firstDay = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const selectedEvents = eventsByDate.get(selected.toDateString()) ?? [];

  const move = (delta: number) => {
    const m = view.m + delta;
    const y = view.y + Math.floor(m / 12);
    setView({ y, m: ((m % 12) + 12) % 12 });
  };

  return (
    <>
      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900">
              {MONTHS[view.m]} {view.y}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => move(-1)}
                className="grid h-9 w-9 place-items-center rounded-xl bg-[color:var(--mec-grey)] hover:bg-neutral-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => move(1)}
                className="grid h-9 w-9 place-items-center rounded-xl bg-[color:var(--mec-grey)] hover:bg-neutral-200"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-neutral-500">
            {DAYS.map((d) => (
              <div key={d} className="py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (day === null) return <div key={i} />;
              const d = new Date(view.y, view.m, day);
              const isToday = d.toDateString() === today.toDateString();
              const isSelected = d.toDateString() === selected.toDateString();
              const hasEvent = eventsByDate.has(d.toDateString());
              return (
                <button
                  key={i}
                  onClick={() => setSelected(d)}
                  className={`relative aspect-square rounded-2xl text-sm font-medium transition ${
                    isSelected
                      ? "text-white shadow-md"
                      : isToday
                      ? "ring-2 ring-[color:var(--mec-blue)] text-[color:var(--mec-blue)]"
                      : "text-neutral-700 hover:bg-[color:var(--mec-grey)]"
                  }`}
                  style={isSelected ? { background: "var(--mec-blue)" } : undefined}
                >
                  {day}
                  {hasEvent && (
                    <span
                      className="absolute bottom-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full"
                      style={{ background: isSelected ? "white" : "var(--mec-yellow)" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-md">
          <p className="text-xs uppercase tracking-widest text-neutral-500">Schedule</p>
          <h3 className="text-lg font-bold text-neutral-900">
            {selected.getDate()} {MONTHS[selected.getMonth()]} {selected.getFullYear()}
          </h3>
          <div className="mt-4 space-y-3">
            {selectedEvents.length === 0 ? (
              <p className="rounded-2xl bg-[color:var(--mec-grey)] p-4 text-sm text-neutral-500">
                No events on this date.
              </p>
            ) : (
              selectedEvents.map((e) => (
                <div key={e.id} className="flex gap-3 rounded-2xl bg-[color:var(--mec-grey)] p-3">
                  <img src={e.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
                  <div>
                    <p className="font-semibold text-neutral-900">{e.title}</p>
                    <p className="text-xs text-neutral-600">{e.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-neutral-900">All Events</h2>
        <GalleryGrid items={EVENTS} />
      </section>
    </>
  );
}
