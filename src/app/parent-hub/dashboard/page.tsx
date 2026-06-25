"use client";

import { GalleryGrid } from "@/components/parent-hub/gallery-grid";
import { useActiveGalleryItems } from "@/lib/hooks/use-gallery";

export default function DashboardHome() {
  const { data: allItems, isLoading } = useActiveGalleryItems();

  const items = allItems ?? [];
  const totalEvents = items.length;

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
            <Stat label="Total Items" value={totalEvents} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-neutral-900">Latest Activities</h2>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-3xl bg-white/60" />
            ))}
          </div>
        ) : (
          <GalleryGrid items={items} />
        )}
      </section>
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
