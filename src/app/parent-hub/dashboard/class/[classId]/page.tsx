"use client";

import Link from "next/link";
import { GalleryGrid } from "@/components/parent-hub/gallery-grid";
import { TeacherHero } from "@/components/parent-hub/teacher-hero";
import { useActiveGalleryItems } from "@/lib/hooks/use-gallery";
import { useClass } from "@/lib/hooks/use-classes";
import { use } from "react";

export default function ClassPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = use(params);
  const { data: cls, isLoading: isClassLoading } = useClass(classId);
  const { data: galleryItems, isLoading: isGalleryLoading } = useActiveGalleryItems(classId);

  if (isClassLoading) {
    return (
      <div className="space-y-4">
        <div className="h-64 animate-pulse rounded-3xl bg-white/60" />
        <div className="h-40 animate-pulse rounded-3xl bg-white/60" />
      </div>
    );
  }

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

  const teacher = cls.users ? {
    id: cls.users.id,
    name: cls.users.full_name || 'Unknown Teacher',
    role: cls.users.role || 'Teacher',
    image: cls.users.profile_picture_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    bio: cls.users.bio || ''
  } : {
    id: 'unassigned',
    name: 'Teacher To Be Assigned',
    role: 'Teacher',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    bio: 'No teacher has been assigned to this class yet.'
  };

  return (
    <>
      <TeacherHero teachers={[teacher]} context={cls.name} />
      <section id="activities">
        <h2 className="mb-6 text-2xl font-bold text-neutral-900">
          {cls.name} Activities Gallery
        </h2>
        {isGalleryLoading ? (
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
