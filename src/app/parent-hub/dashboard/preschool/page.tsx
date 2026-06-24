"use client";

import { GalleryGrid } from "@/components/parent-hub/gallery-grid";
import { useActiveGalleryItems } from "@/lib/hooks/use-gallery";
import { PRESCHOOL_SCHEDULE, PRESCHOOL_TEACHERS, PRESCHOOL_MAGAZINES } from "@/lib/parent-hub-data";

export default function PreschoolPage() {
  const { data: galleryItems, isLoading } = useActiveGalleryItems("preschool");

  return (
    <>
      <section
        className="relative overflow-hidden rounded-3xl p-8 text-white shadow-xl"
        style={{ background: "var(--mec-blue)" }}
      >
        <div
          className="absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-40"
          style={{ background: "var(--mec-yellow)" }}
        />
        <div className="relative">
          <p className="text-sm uppercase tracking-widest text-white/70">MEC Preschool</p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Our Preschool Teachers</h1>
          <p className="mt-2 max-w-2xl text-white/85">
            A loving and dedicated teaching team for early childhood education.
          </p>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PRESCHOOL_TEACHERS.map((t) => (
          <article key={t.id} className="overflow-hidden rounded-3xl bg-white shadow-md">
            <div className="aspect-square overflow-hidden">
              <img src={t.image} alt={t.name} className="h-full w-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-neutral-900">{t.name}</h3>
              <p className="text-xs text-neutral-500">{t.role}</p>
            </div>
          </article>
        ))}
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-neutral-900">Weekly Schedule</h2>
        <div className="overflow-x-auto rounded-3xl bg-white shadow-md border border-neutral-100">
          <table className="w-full text-left text-sm text-neutral-600">
            <thead className="bg-[color:var(--mec-grey)] text-neutral-900">
              <tr>
                <th className="px-6 py-4 font-bold border-b border-neutral-200">Time</th>
                <th className="px-6 py-4 font-bold border-b border-neutral-200">Monday</th>
                <th className="px-6 py-4 font-bold border-b border-neutral-200">Tuesday</th>
                <th className="px-6 py-4 font-bold border-b border-neutral-200">Wednesday</th>
                <th className="px-6 py-4 font-bold border-b border-neutral-200">Thursday</th>
                <th className="px-6 py-4 font-bold border-b border-neutral-200">Friday</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {PRESCHOOL_SCHEDULE.map((row, i) => (
                <tr key={i} className="hover:bg-neutral-50 transition">
                  <td className="px-6 py-4 font-semibold text-neutral-900 whitespace-nowrap">
                    {row.time}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[color:var(--mec-blue)] font-medium text-xs">
                      {row.Monday}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 font-medium text-xs">
                      {row.Tuesday}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[color:var(--mec-blue)] font-medium text-xs">
                      {row.Wednesday}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 font-medium text-xs">
                      {row.Thursday}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[color:var(--mec-blue)] font-medium text-xs">
                      {row.Friday}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-neutral-900">Activities Gallery</h2>
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

      <section>
        <h2 className="mb-4 text-2xl font-bold text-neutral-900">Monthly Magazine</h2>
        <p className="mb-6 text-neutral-600 max-w-2xl">
          Download and read our monthly preschool magazine to keep up with what your children are learning and creating.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRESCHOOL_MAGAZINES.map((mag) => (
            <article
              key={mag.id}
              className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-[3/4] overflow-hidden bg-neutral-100 p-4">
                <img
                  src={mag.coverImage}
                  alt={mag.title}
                  className="h-full w-full object-cover rounded-xl shadow-sm transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <span className="text-xs font-semibold text-[color:var(--mec-blue)] mb-1 uppercase tracking-wider">
                  {mag.date}
                </span>
                <h3 className="text-lg font-bold text-neutral-900">{mag.title}</h3>
                <p className="text-sm text-neutral-500 mb-4">{mag.issue}</p>
                <div className="mt-auto">
                  <a
                    href={mag.pdfUrl}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
                    style={{ background: "var(--mec-blue)" }}
                  >
                    Read PDF
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
