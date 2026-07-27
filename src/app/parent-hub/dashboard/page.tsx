"use client";

import { useState, useEffect } from "react";
import { useActiveGalleryItems } from "@/lib/hooks/use-gallery";
import { useAllClassActivities } from "@/lib/hooks/use-activities";
import { GreetingBanner } from "@/components/parent-hub/greeting-banner";
import { ScheduleCalendar } from "@/components/parent-hub/schedule-calendar";
import { EventColumns } from "@/components/parent-hub/event-columns";
import { GalleryGrid } from "@/components/parent-hub/gallery-grid";
import { Calendar, Tag, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export default function DashboardHome() {
  const { data: allItems, isLoading } = useActiveGalleryItems("event");
  const items = allItems ?? [];
  const { data: recentActivities, isLoading: isLoadingActivities } = useAllClassActivities(6);
  const { t } = useLanguage();
  const router = useRouter();

  const [showArrearsWarning, setShowArrearsWarning] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("parent-hub-session");
    if (!raw) return;

    try {
      const session = JSON.parse(raw);
      if (session.type === 'student' && session.studentId) {
        const hasWarned = sessionStorage.getItem('arrears-warned');
        if (hasWarned !== 'true') {
          const checkArrears = async () => {
            const supabase = createClient();
            const { data } = await supabase
              .from('payments')
              .select('id')
              .eq('student_id', session.studentId)
              .eq('payment_status', 'Pending')
              .limit(1);

            if (data && data.length > 0) {
              setShowArrearsWarning(true);
              sessionStorage.setItem('arrears-warned', 'true');
            }
          };
          checkArrears();
        }
      }
    } catch {}
  }, []);

  return (
    <div className="space-y-8">
      {/* Arrears Warning Dialog */}
      <Dialog open={showArrearsWarning} onOpenChange={setShowArrearsWarning}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#E11D2A]">
              <AlertTriangle className="h-6 w-6" />
              {t("dashboard.arrearsWarningTitle")}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-neutral-600 leading-relaxed text-sm md:text-base">
              {t("dashboard.arrearsWarningDesc")}
            </p>
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <button
              onClick={() => setShowArrearsWarning(false)}
              className="px-4 py-2 text-sm font-semibold text-neutral-500 hover:text-neutral-700 transition"
            >
              {t("dashboard.close")}
            </button>
            <button
              onClick={() => {
                setShowArrearsWarning(false);
                router.push('/parent-hub/dashboard/profile');
              }}
              className="px-4 py-2 rounded-xl bg-mec-blue text-white text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
            >
              {t("dashboard.viewInvoices")}
            </button>
          </div>
        </DialogContent>
      </Dialog>

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
          <h2 className="font-display text-2xl font-bold text-[#111111]">{t("dashboard.recentActivities")}</h2>
          <p className="text-sm text-neutral-600">{t("dashboard.recentActivitiesDesc")}</p>
        </div>

        {isLoadingActivities ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[420px] animate-pulse rounded-3xl bg-white/60" />
            ))}
          </div>
        ) : recentActivities?.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <p className="text-neutral-500">{t("dashboard.noRecentActivities")}</p>
          </div>
        ) : (
          <GalleryGrid items={recentActivities as any} />
        )}
      </section>
    </div>
  );
}
