import Link from "next/link";
import { notFound } from "next/navigation";
import { GalleryGrid } from "@/components/parent-hub/gallery-grid";
import { TeacherHero } from "@/components/parent-hub/teacher-hero";
import { CLASSES } from "@/lib/parent-hub-data";

export default async function ClassPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;
  const cls = CLASSES.find((c) => c.id === classId);

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
        <GalleryGrid items={cls.gallery} />
      </section>
    </>
  );
}
