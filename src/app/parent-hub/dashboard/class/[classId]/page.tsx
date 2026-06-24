"use client";

import Link from "next/link";
import { GalleryGrid } from "@/components/parent-hub/gallery-grid";
import { TeacherHero } from "@/components/parent-hub/teacher-hero";
import { useActiveGalleryItems } from "@/lib/hooks/use-gallery";
import { CLASSES } from "@/lib/parent-hub-data";
import { use } from "react";

export default function ClassPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = use(params);
  const cls = CLASSES.find((c) => c.id === classId);
  const { data: galleryItems, isLoading } = useActiveGalleryItems(classId);

  if (!cls) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow">
        <h2 className="text-xl font-bold">Class not found</h2>
        <Link href="/parent-hub/dashboard" className="text-[color:var(--mec-blue)] underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <>
      <TeacherHero teachers={[cls.teacher]} context={cls.name} />
      <section>
        <h2 className="mb-6 text-2xl font-bold text-neutral-900">
          {cls.name} Activities Gallery
        </h2>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-3xl bg-white/60" />
            ))}
          </div>
        ) : (
          <GalleryGrid items={galleryItems ?? []} />
        )}
      </section>
    </>
  );
}
