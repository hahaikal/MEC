"use client";

import { GalleryGrid } from "@/components/parent-hub/gallery-grid";
import { useActiveGalleryItems } from "@/lib/hooks/use-gallery";
import { PRESCHOOL_SCHEDULE } from "@/lib/parent-hub-data";
import { usePreschoolTeachers } from "@/lib/hooks/use-teachers";
import { usePreschoolMagazines } from "@/lib/hooks/use-documents";
import { format } from "date-fns";
import { FileText, Download } from "lucide-react";

export default function PreschoolPage() {
  const { data: galleryItems, isLoading } = useActiveGalleryItems("preschool");
  const { data: documents, isLoading: isDocumentsLoading } = usePreschoolMagazines();
  const { data: preschoolTeachers, isLoading: isTeachersLoading } = usePreschoolTeachers();

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
        {isTeachersLoading ? (
          <div className="col-span-full h-40 animate-pulse rounded-3xl bg-white/60" />
        ) : !preschoolTeachers || preschoolTeachers.length === 0 ? (
          <div className="col-span-full rounded-3xl bg-white p-8 text-center text-neutral-500 shadow-sm border border-neutral-100">
            No teachers assigned to preschool classes yet.
          </div>
        ) : (
          preschoolTeachers.map((t: any) => (
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
          {isDocumentsLoading ? (
            <div className="h-40 animate-pulse rounded-3xl bg-white/60 col-span-3" />
          ) : !documents || documents.length === 0 ? (
            <div className="col-span-3 rounded-3xl bg-white p-8 text-center text-neutral-500 shadow-sm border border-neutral-100">
              No magazines uploaded yet for preschool classes.
            </div>
          ) : (
            documents.map((mag) => (
              <a
                key={mag.id}
                href={mag.document_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[color:var(--mec-blue)]">
                    <FileText className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900 group-hover:text-[color:var(--mec-blue)] transition-colors">
                      {mag.title}
                    </h3>
                    <p className="mt-1 flex flex-col text-xs font-medium text-neutral-500">
                      <span>{format(new Date(mag.created_at), "MMMM d, yyyy")} • {mag.file_size_mb} MB</span>
                      {mag.classes?.name && <span className="mt-1 text-[color:var(--mec-blue)]">{mag.classes.name}</span>}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center text-sm font-semibold text-[color:var(--mec-blue)]">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </div>
              </a>
            ))
          )}
        </div>
      </section>
    </>
  );
}
