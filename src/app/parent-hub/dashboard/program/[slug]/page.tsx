"use client";

import Link from "next/link";
import { GalleryGrid } from "@/components/parent-hub/gallery-grid";
import { TeacherHero } from "@/components/parent-hub/teacher-hero";
import { useActiveGalleryItems } from "@/lib/hooks/use-gallery";
import { PROGRAMS } from "@/lib/parent-hub-data";
import { use } from "react";

export default function ProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const program = PROGRAMS[slug];
  const { data: galleryItems, isLoading } = useActiveGalleryItems(slug);

  if (!program) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow">
        <h2 className="text-xl font-bold">Program not found</h2>
        <Link href="/parent-hub/dashboard" className="text-[color:var(--mec-blue)] underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <>
      <TeacherHero teachers={program.teachers} context={`Program · ${program.name}`} />

      <p className="rounded-3xl bg-white p-6 text-neutral-700 shadow-sm text-lg leading-relaxed">{program.description}</p>

      <section>
        <h2 className="mb-6 text-2xl font-bold text-neutral-900">Gallery & Activities</h2>
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
