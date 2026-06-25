"use client";

import Link from "next/link";
import { GalleryGrid } from "@/components/parent-hub/gallery-grid";
import { TeacherHero } from "@/components/parent-hub/teacher-hero";
import { usePrograms, useProgramTeachers } from "@/lib/hooks/use-programs";
import { useProgramActivities } from "@/lib/hooks/use-activities";
import { use } from "react";

const PROGRAM_DESCRIPTIONS: Record<string, string> = {
  "Calistung": "A foundational program designed to spark your child's early literacy and numeracy skills. Through fun and engaging activities, we build a strong basis in reading, writing, and counting to prepare them for their future academic journey.",
  "English Class": "A comprehensive English learning program tailored to improve grammar, vocabulary, and conversational skills. We foster a supportive environment where students gain confidence in their English proficiency.",
  "Foresight": "An advanced program aimed at developing critical thinking, problem-solving, and future-ready skills. We empower students to look ahead, plan, and excel in a rapidly changing world.",
  "MEC PRESCHOOL": "A nurturing and playful learning environment for our youngest learners. We focus on holistic development, social skills, and early cognitive growth in a safe and loving space.",
  "Smart Program": "An intensive, fast-tracked curriculum designed to challenge and stimulate bright minds. We combine innovative teaching methods with advanced materials to accelerate your child's learning potential."
};

export default function ProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params); // slug is actually programId now
  const { data: programs = [], isLoading: isProgramsLoading } = usePrograms();
  const program = programs.find((p: any) => p.id === slug);
  const { data: programTeachers = [], isLoading: isTeachersLoading } = useProgramTeachers(slug);
  const { data: activities, isLoading } = useProgramActivities(slug);

  if (isProgramsLoading) {
    return (
      <div className="space-y-4">
        <div className="h-64 animate-pulse rounded-3xl bg-white/60" />
      </div>
    );
  }

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

  const engagingDescription = PROGRAM_DESCRIPTIONS[program.name] || program.description || 'Our dedicated teaching team is here to support your learning journey.';

  return (
    <>
      {programTeachers.length === 1 ? (
        <>
          <TeacherHero teachers={programTeachers} context={`Program · ${program.name}`} />
          <p className="rounded-3xl bg-white p-6 text-neutral-700 shadow-sm text-lg leading-relaxed mt-6">
            {engagingDescription}
          </p>
        </>
      ) : (
        <>
          <section
            className="relative overflow-hidden rounded-3xl p-8 text-white shadow-xl mb-6"
            style={{ background: "var(--mec-blue)" }}
          >
            <div
              className="absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-40"
              style={{ background: "var(--mec-yellow)" }}
            />
            <div className="relative">
              <p className="text-sm uppercase tracking-widest text-white/70">Program · {program.name}</p>
              <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Our {program.name} Teachers</h1>
              <p className="mt-2 max-w-2xl text-white/85">
                {engagingDescription}
              </p>
            </div>
          </section>

          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
            {isTeachersLoading ? (
              <div className="col-span-full h-40 animate-pulse rounded-3xl bg-white/60" />
            ) : programTeachers.length === 0 ? (
              <div className="col-span-full rounded-3xl bg-white p-8 text-center text-neutral-500 shadow-sm border border-neutral-100">
                No teachers assigned to this program yet.
              </div>
            ) : (
              programTeachers.map((t: any) => (
                <article key={t.id} className="overflow-hidden rounded-3xl bg-white shadow-md">
                  <div className="aspect-square overflow-hidden">
                    <img src={t.image} alt={t.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-neutral-900">{t.name}</h3>
                    <p className="text-xs text-neutral-500">{t.role}</p>
                  </div>
                </article>
              ))
            )}
          </section>
        </>
      )}

      <section id="activities">
        <h2 className="mb-6 text-2xl font-bold text-neutral-900">Gallery & Activities</h2>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-3xl bg-white/60" />
            ))}
          </div>
        ) : (
          <GalleryGrid items={activities ?? []} />
        )}
      </section>
    </>
  );
}
