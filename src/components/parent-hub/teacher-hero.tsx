"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { Teacher } from "@/lib/parent-hub-data";

export function TeacherHero({
  teachers,
  context,
}: {
  teachers: Teacher[];
  context?: string;
}) {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "center" }, [
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  ]);

  if (!teachers || teachers.length === 0) return null;

  return (
    <section className="relative overflow-hidden rounded-3xl" style={{ background: "var(--mec-blue)" }}>
      {/* Decorative Blobs */}
      <div
        className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full opacity-40 pointer-events-none"
        style={{ background: "var(--mec-yellow)" }}
      />

      <div className="p-6 sm:p-10">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex backface-hidden touch-pan-y">
            {teachers.map((teacher) => (
              <div key={teacher.id} className="min-w-0 flex-[0_0_100%]">
              <div className="relative grid items-center gap-8 md:grid-cols-[260px_1fr]">
                <div className="mx-auto h-60 w-60 overflow-hidden rounded-3xl border-4 border-white/40 shadow-2xl md:mx-0">
                  <img src={teacher.image} alt={teacher.name} className="h-full w-full object-cover" />
                </div>
                <div className="text-white">
                  {context && (
                    <p className="mb-2 text-sm uppercase tracking-widest text-white/70">
                      {context}
                    </p>
                  )}
                  <h1 className="text-3xl font-bold sm:text-4xl">{teacher.name}</h1>
                  <p className="mt-1 text-white/85">{teacher.role}</p>
                  
                  {teacher.specialties && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {teacher.specialties.map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md"
                          style={{ border: "1px solid rgba(255,255,255,0.25)" }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {teacher.bio && (
                    <div className="mt-5 rounded-2xl bg-white/10 p-4 text-sm text-white/90 backdrop-blur-md">
                      {teacher.bio}
                    </div>
                  )}
                  
                  <button
                    className="mt-5 rounded-2xl px-5 py-2.5 text-sm font-semibold text-neutral-900 shadow-lg transition hover:brightness-95"
                    style={{ background: "var(--mec-yellow)" }}
                  >
                    Explore Classes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
