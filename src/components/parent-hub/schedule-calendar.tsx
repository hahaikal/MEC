import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from "lucide-react";
import type { GalleryItem } from "@/types/gallery";
import Image from "next/image";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type EventStatus = "ongoing" | "upcoming" | "completed";

function getEventStatus(item: GalleryItem): EventStatus {
  if (!item.event_date) return "ongoing";
  const d = new Date(item.event_date).setHours(0,0,0,0);
  const today = new Date().setHours(0,0,0,0);
  if (d > today) return "upcoming";
  if (d < today) return "completed";
  return "ongoing";
}

function statusDot(status: string) {
  if (status === "ongoing") return "bg-mec-yellow";
  if (status === "upcoming") return "bg-mec-blue";
  return "bg-muted-foreground/40";
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatTime(iso: string | null) {
  if (!iso) return "All Day";
  const dt = new Date(iso);
  return dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function ScheduleCalendar({ items }: { items: GalleryItem[] }) {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<Date>(today);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const eventsByDateMap = useMemo(() => {
    const map = new Map<string, GalleryItem[]>();
    for (const e of items) {
      if (!e.event_date) continue;
      const d = new Date(e.event_date);
      const k = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime().toString();
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(e);
    }
    return map;
  }, [items]);

  const getEventsForDate = (date: Date) => {
    const k = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime().toString();
    return eventsByDateMap.get(k) || [];
  };

  const grid = useMemo(() => {
    const first = new Date(year, month, 1);
    const startOffset = (first.getDay() + 6) % 7; // Monday-first
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: Array<{ date: Date; inMonth: boolean }> = [];
    for (let i = 0; i < startOffset; i++) {
      const dt = new Date(year, month, -startOffset + i + 1);
      cells.push({ date: dt, inMonth: false });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push({ date: new Date(year, month, day), inMonth: true });
    }
    while (cells.length % 7 !== 0) {
      const last = cells[cells.length - 1].date;
      const nxt = new Date(last);
      nxt.setDate(nxt.getDate() + 1);
      cells.push({ date: nxt, inMonth: false });
    }
    return cells;
  }, [year, month]);

  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const selectedEvents = getEventsForDate(selected);
  const monthEvents = items.filter((e) => {
    if (!e.event_date) return false;
    const d = new Date(e.event_date);
    return d.getFullYear() === year && d.getMonth() === month;
  }).length;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-card p-6 shadow-float">
      {/* Decorative accents */}
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-mec-blue/5" />
      <div className="pointer-events-none absolute -left-12 top-10 h-32 w-32 rounded-full bg-mec-yellow/10" />

      <header className="relative mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Monthly Schedule</h2>
          <p className="text-sm text-muted-foreground">
            {monthEvents} event{monthEvents === 1 ? "" : "s"} in {monthLabel}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            className="grid h-9 w-9 place-items-center rounded-full bg-mec-blue-soft text-mec-blue transition hover:bg-mec-blue hover:text-white"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="rounded-full bg-mec-blue px-4 py-1.5 font-display text-sm font-bold text-white">
            {monthLabel}
          </div>
          <button
            type="button"
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            className="grid h-9 w-9 place-items-center rounded-full bg-mec-blue-soft text-mec-blue transition hover:bg-mec-blue hover:text-white"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="relative grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            {DAY_LABELS.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {grid.map(({ date, inMonth }, idx) => {
              const events = getEventsForDate(date);
              const isSelected = sameDay(date, selected);
              const isToday = sameDay(date, today);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelected(date)}
                  className={[
                    "group relative flex aspect-square flex-col items-center justify-start rounded-2xl border p-1.5 text-sm transition",
                    isSelected
                      ? "border-mec-blue bg-mec-blue text-white shadow-pop"
                      : "border-transparent bg-muted/40 hover:border-mec-blue/30 hover:bg-mec-blue-soft",
                    !inMonth && !isSelected && "opacity-40",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "font-display text-base font-bold",
                      isToday && !isSelected ? "text-mec-blue" : "",
                    ].join(" ")}
                  >
                    {date.getDate()}
                  </span>
                  {events.length > 0 && (
                    <div className="mt-auto flex items-center justify-center gap-0.5 pb-0.5">
                      {events.slice(0, 3).map((e) => (
                        <span
                          key={e.id}
                          className={[
                            "h-1.5 w-1.5 rounded-full",
                            isSelected ? "bg-white" : statusDot(getEventStatus(e)),
                          ].join(" ")}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-mec-yellow" /> Ongoing
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-mec-blue" /> Upcoming
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/40" /> Completed
            </span>
          </div>
        </div>

        {/* Day detail panel */}
        <aside className="relative flex flex-col gap-3 rounded-2xl bg-mec-blue-soft/40 p-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-mec-blue" />
            <h3 className="font-display text-base font-bold">
              {selected.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </h3>
          </div>
          {selectedEvents.length === 0 ? (
            <div className="grid flex-1 place-items-center rounded-2xl bg-white/60 p-6 text-center text-sm text-muted-foreground">
              <div>
                <div className="mb-2 text-3xl">☀️</div>
                No events scheduled.
                <br />
                Enjoy a free day!
              </div>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {selectedEvents.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-float"
                >
                  <div className="relative h-10 w-10 shrink-0 rounded-xl bg-mec-yellow-soft overflow-hidden">
                    {e.image_url ? (
                      <Image src={e.image_url} alt="" fill sizes="40px" className="object-cover" />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-xl">🗓️</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm font-bold">{e.title}</p>
                    <p className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                      <Clock className="h-3 w-3" /> {formatTime(e.event_date)} · {e.category}
                    </p>
                  </div>
                  <span className={`h-2.5 w-2.5 rounded-full ${statusDot(getEventStatus(e))}`} />
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </section>
  );
}
