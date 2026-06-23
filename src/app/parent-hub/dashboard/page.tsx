import { GalleryGrid } from "@/components/parent-hub/gallery-grid";
import { DASHBOARD_ACTIVITIES, EVENTS, type GalleryItem } from "@/lib/parent-hub-data";

export default function DashboardHome() {
  const ongoing = DASHBOARD_ACTIVITIES.filter((a) => a.status === "ongoing");
  const upcoming = DASHBOARD_ACTIVITIES.filter((a) => a.status === "upcoming");
  const past = DASHBOARD_ACTIVITIES.filter((a) => a.status === "past");

  return (
    <>
      <section
        className="relative overflow-hidden rounded-3xl p-8 text-white shadow-xl"
        style={{ background: "var(--mec-blue)" }}
      >
        <div
          className="absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-40"
          style={{ background: "var(--mec-yellow)" }}
        />
        <div className="relative">
          <p className="text-sm uppercase tracking-widest text-white/70">Welcome back</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Hello, Parents 👋</h1>
          <p className="mt-2 max-w-2xl text-white/85">
            Monitor all programs, classes, and the latest events from My English Course &
            Academy in one place.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Stat label="Total Events" value={EVENTS.length} />
            <Stat label="Ongoing" value={ongoing.length} />
            <Stat label="Upcoming" value={upcoming.length} />
          </div>
        </div>
      </section>

      <Section title="🟡 Ongoing" items={ongoing} empty="No ongoing activities." />
      <Section title="🔵 Upcoming" items={upcoming} empty="No upcoming activities." />
      <Section title="⚪ Completed" items={past} empty="No past activities." />
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-md">
      <div className="text-xs text-white/75">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}

function Section({
  title,
  items,
  empty,
}: {
  title: string;
  items: GalleryItem[];
  empty: string;
}) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-neutral-900">{title}</h2>
      {items.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-sm text-neutral-500 shadow-sm">{empty}</p>
      ) : (
        <GalleryGrid items={items} />
      )}
    </section>
  );
}
