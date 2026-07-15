"use client";

import Link from "next/link";
import { GalleryGrid } from "@/components/parent-hub/gallery-grid";
import { TeacherHero } from "@/components/parent-hub/teacher-hero";
import { useClassActivities } from "@/lib/hooks/use-activities";
import { useClassDocuments } from "@/lib/hooks/use-documents";
import { useClass } from "@/lib/hooks/use-classes";
import { use } from "react";
import { FileText, Download } from "lucide-react";
import { format } from "date-fns";

export default function ClassPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = use(params);
  const { data: cls, isLoading: isClassLoading } = useClass(classId);
  const { data: activities, isLoading: isActivitiesLoading } = useClassActivities(classId);
  
  // Only query documents if we know it's a preschool
  const isPreschool = cls?.programs?.name?.toLowerCase().includes("preschool") || cls?.programs?.name?.toLowerCase().includes("kindergarten");
  const { data: documents, isLoading: isDocumentsLoading } = useClassDocuments(classId, 'MAGAZINE');

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

  const teachers = cls.teachers && cls.teachers.length > 0 ? cls.teachers.map((t: any) => ({
    id: t.id,
    name: t.full_name || 'Unknown Teacher',
    role: t.roles?.[0] || 'Teacher',
    image: t.profile_picture_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    bio: t.bio || ''
  })) : [{
    id: 'unassigned',
    name: 'Teacher To Be Assigned',
    role: 'Teacher',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    bio: 'No teacher has been assigned to this class yet.'
  }];

  const mappedActivities = activities?.map(act => ({
    id: act.id,
    title: act.title,
    description: act.description,
    image_url: act.image_url,
    created_at: act.created_at,
    category: "activity",
    is_active: true,
    order_index: 0
  })) || [];

  return (
    <>
      <TeacherHero teachers={teachers} context={cls.name} />

      {isPreschool && (
        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-neutral-900">
            {cls.name} Magazines
          </h2>
          {isDocumentsLoading ? (
            <div className="h-24 animate-pulse rounded-3xl bg-white/60" />
          ) : !documents || documents.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-center text-neutral-500 shadow-sm border border-neutral-100">
              No magazines uploaded yet for this class.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {documents.map((doc) => (
                <a 
                  key={doc.id}
                  href={doc.document_url} 
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
                        {doc.title}
                      </h3>
                      <p className="mt-1 flex items-center text-xs font-medium text-neutral-500">
                        {format(new Date(doc.created_at), "MMMM d, yyyy")} • {doc.file_size_mb} MB
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center text-sm font-semibold text-[color:var(--mec-blue)]">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>
      )}

      <section id="activities" className="mt-12">
        <h2 className="mb-6 text-2xl font-bold text-neutral-900">
          {cls.name} Activities Feed
        </h2>
        {isActivitiesLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-3xl bg-white/60" />
            ))}
          </div>
        ) : (
          <GalleryGrid items={mappedActivities} />
        )}
      </section>
    </>
  );
}
