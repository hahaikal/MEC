"use client";

import { useActiveGalleryItems } from "@/lib/hooks/use-gallery";
import { useAllClassActivities } from "@/lib/hooks/use-activities";
import { GreetingBanner } from "@/components/parent-hub/greeting-banner";
import { ScheduleCalendar } from "@/components/parent-hub/schedule-calendar";
import { EventColumns } from "@/components/parent-hub/event-columns";
import { GalleryGrid } from "@/components/parent-hub/gallery-grid";
import { Calendar, Tag } from "lucide-react";
import Image from "next/image";

export default function DashboardHome() {
  const { data: allItems, isLoading } = useActiveGalleryItems("event");
  const items = allItems ?? [];
  const { data: recentActivities, isLoading: isLoadingActivities } = useAllClassActivities(6);

  return (
    <div className="space-y-8">
      <GreetingBanner totalItems={items.length} />

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-[400px] animate-pulse rounded-3xl bg-white/60" />
          <div className="h-[300px] animate-pulse rounded-3xl bg-white/60" />
        </div>
      ) : (
        <>
          <ScheduleCalendar items={items} />
          <EventColumns items={items} />
        </>
      )}

      {/* Recent Activities Section */}
      <section className="mt-12">
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold text-foreground">Recent Class Activities</h2>
          <p className="text-sm text-muted-foreground">The latest updates from all programs and classes.</p>
        </div>

        {isLoadingActivities ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[420px] animate-pulse rounded-3xl bg-white/60" />
            ))}
          </div>
        ) : recentActivities?.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <p className="text-muted-foreground">No recent activities available.</p>
          </div>
        ) : (
          <GalleryGrid items={recentActivities as any} />
        )}
      </section>
    </div>
  );
}
