import { Calendar, Clock, PlayCircle, CheckCircle2 } from "lucide-react";
import type { GalleryItem } from "@/types/gallery";

type EventStatus = "ongoing" | "upcoming" | "completed";

const statusMeta: Record<
  EventStatus,
  { label: string; chip: string; accent: string; icon: typeof Calendar; dot: string }
> = {
  ongoing: {
    label: "Ongoing",
    chip: "bg-mec-yellow text-mec-ink",
    accent: "from-mec-yellow/60 to-mec-yellow/0",
    icon: PlayCircle,
    dot: "bg-mec-yellow",
  },
  upcoming: {
    label: "Upcoming",
    chip: "bg-mec-blue text-white",
    accent: "from-mec-blue/30 to-mec-blue/0",
    icon: Calendar,
    dot: "bg-mec-blue",
  },
  completed: {
    label: "Completed",
    chip: "bg-muted text-muted-foreground",
    accent: "from-muted to-transparent",
    icon: CheckCircle2,
    dot: "bg-muted-foreground/50",
  },
};

function formatDate(iso: string | null) {
  if (!iso) return "TBA";
  const dt = new Date(iso);
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatTime(iso: string | null) {
  if (!iso) return "All Day";
  const dt = new Date(iso);
  return dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function getEventStatus(item: GalleryItem): EventStatus {
  if (!item.event_date) return "ongoing";
  const d = new Date(item.event_date).setHours(0,0,0,0);
  const today = new Date().setHours(0,0,0,0);
  if (d > today) return "upcoming";
  if (d < today) return "completed";
  return "ongoing";
}

function EventCard({ item }: { item: GalleryItem }) {
  const status = getEventStatus(item);
  const meta = statusMeta[status];
  return (
    <article className="group relative overflow-hidden rounded-2xl bg-card p-4 shadow-float transition hover:-translate-y-0.5 hover:shadow-pop">
      <div className={`pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-gradient-to-br ${meta.accent} opacity-70`} />
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 shrink-0 rounded-2xl bg-mec-blue-soft overflow-hidden">
          {item.image_url ? (
            <img src={item.image_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-2xl">🗓️</div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${meta.chip}`}>
              <meta.icon className="h-3 w-3" />
              {meta.label}
            </span>
            <span className="text-[11px] font-semibold text-muted-foreground">{item.category}</span>
          </div>
          <h4 className="mt-1.5 truncate font-display text-base font-bold text-foreground">
            {item.title}
          </h4>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
          <div className="mt-2.5 flex items-center gap-3 text-[11px] font-semibold text-foreground/70">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {formatDate(item.event_date)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" /> {formatTime(item.event_date)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function Column({ status, items }: { status: EventStatus; items: GalleryItem[] }) {
  const meta = statusMeta[status];
  let columnItems = items.filter(it => getEventStatus(it) === status);

  if (status === 'upcoming') {
    columnItems.sort((a, b) => new Date(a.event_date || 0).getTime() - new Date(b.event_date || 0).getTime());
  } else if (status === 'completed') {
    columnItems.sort((a, b) => new Date(b.event_date || 0).getTime() - new Date(a.event_date || 0).getTime());
  }

  columnItems = columnItems.slice(0, 5);
  
  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-3xl bg-white/60 p-4 shadow-float backdrop-blur">
      <header className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
          <h3 className="font-display text-lg font-bold text-foreground">{meta.label}</h3>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
            {columnItems.length}
          </span>
        </div>
      </header>
      <div className="flex flex-col gap-3">
        {columnItems.length === 0 ? (
          <p className="rounded-2xl bg-muted/40 p-4 text-center text-xs text-muted-foreground">
            No {meta.label.toLowerCase()} events.
          </p>
        ) : (
          columnItems.map((it) => <EventCard key={it.id} item={it} />)
        )}
      </div>
    </div>
  );
}

export function EventColumns({ items }: { items: GalleryItem[] }) {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Event Status</h2>
          <p className="text-sm text-muted-foreground">A quick look at what's happening this month.</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Column status="ongoing" items={items} />
        <Column status="upcoming" items={items} />
        <Column status="completed" items={items} />
      </div>
    </section>
  );
}
