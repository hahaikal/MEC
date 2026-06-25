"use client";

import { useActiveGalleryItems } from "@/lib/hooks/use-gallery";
import { useAllClassActivities } from "@/lib/hooks/use-activities";
import { GreetingBanner } from "@/components/parent-hub/greeting-banner";
import { ScheduleCalendar } from "@/components/parent-hub/schedule-calendar";
import { EventColumns } from "@/components/parent-hub/event-columns";
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
              <div key={i} className="h-64 animate-pulse rounded-3xl bg-white/60" />
            ))}
          </div>
        ) : recentActivities?.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <p className="text-muted-foreground">No recent activities available.</p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1">
            {recentActivities?.map((act: any) => (
              <article
                key={act.id}
                className="group flex flex-col md:flex-row overflow-hidden rounded-3xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] md:aspect-auto md:w-2/5 shrink-0 overflow-hidden bg-neutral-100">
                  <Image
                    src={act.image_url}
                    alt={act.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-mec-blue backdrop-blur">
                    {act.classes?.programs?.name || "Program"}
                  </div>
                </div>
                <div className="flex flex-col justify-center space-y-3 p-6 md:p-8 flex-1">
                  <div className="flex items-center justify-between text-sm font-medium text-neutral-500">
                    <span className="flex items-center gap-1.5">
                      <Tag className="h-4 w-4 text-mec-blue" />
                      {act.classes?.name}
                    </span>
                    <span>
                      {new Date(act.created_at).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-neutral-900 line-clamp-2">
                    {act.title}
                  </h3>
                  {act.description && (
                    <p className="text-base text-neutral-600 line-clamp-2 max-w-2xl">
                      {act.description}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
