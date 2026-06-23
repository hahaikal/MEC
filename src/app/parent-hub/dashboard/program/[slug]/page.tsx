import Link from "next/link";
import { notFound } from "next/navigation";
import { GalleryGrid } from "@/components/parent-hub/gallery-grid";
import { TeacherHero } from "@/components/parent-hub/teacher-hero";
import { PROGRAMS } from "@/lib/parent-hub-data";

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = PROGRAMS[slug];

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
        <GalleryGrid items={program.gallery} />
      </section>
    </>
  );
}
