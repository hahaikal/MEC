import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Calendar, Trash2, Image as ImageIcon } from "lucide-react";
import { UploadDocumentForm } from "@/components/teacher-workspace/upload-document-form";
import { UploadActivityForm } from "@/components/teacher-workspace/upload-activity-form";
import { format } from "date-fns";

export default async function ClassWorkspacePage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch class details and verify ownership
  const { data: cls, error: classError } = await supabase
    .from("classes")
    .select(`
      *,
      programs:program_id (id, name),
      class_teachers (teacher_id)
    `)
    .eq("id", classId)
    .single();

  if (classError || !cls) {
    redirect("/dashboard/teacher-workspace");
  }

  // Allow admins or the assigned teacher
  const { data: userData } = await supabase.from('users').select('roles').eq('id', user.id).single();
  const isAdmin = userData?.roles?.some((r: string) => ['Admin', 'Manager', 'Director', 'Staff'].includes(r));
  
  const isAssignedTeacher = cls.class_teachers?.some((ct: any) => ct.teacher_id === user.id);

  if (!isAssignedTeacher && !isAdmin) {
    redirect("/dashboard/teacher-workspace");
  }

  // Fetch documents and activities
  const [{ data: documents }, { data: activities }] = await Promise.all([
    supabase
      .from("class_documents")
      .select("*")
      .eq("class_id", classId)
      .order("created_at", { ascending: false }),
    supabase
      .from("class_activities")
      .select("*")
      .eq("class_id", classId)
      .order("created_at", { ascending: false })
  ]);

  const isPreschool = cls.name?.toLowerCase().includes("preschool") || cls.name?.toLowerCase().includes("pre-school");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/teacher-workspace"
          className="rounded-full p-2 hover:bg-neutral-100 transition"
        >
          <ArrowLeft className="h-5 w-5 text-neutral-600" />
        </Link>
        <div>
          <div className="text-sm font-medium text-[color:var(--mec-blue)]">
            {cls.programs?.name}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            {cls.name} Workspace
          </h1>
        </div>
      </div>

      {/* Activities Section */}
      <div className="mb-12">
        <div className="grid gap-6 md:grid-cols-[1fr_400px]">
          {/* Left Column: Activities List */}
          <div className="space-y-6">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-neutral-900 mb-6">
                Recent Activities
              </h2>
              
              {!activities || activities.length === 0 ? (
                <div className="rounded-xl border border-dashed p-8 text-center text-neutral-500">
                  <ImageIcon className="mx-auto h-8 w-8 mb-3 text-neutral-300" />
                  No activities posted yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.map((act) => (
                    <div key={act.id} className="flex gap-4 rounded-xl border p-4 hover:bg-neutral-50 transition">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border">
                        <img src={act.image_url} alt={act.title} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900">
                          {act.title}
                        </h3>
                        {act.description && (
                          <p className="mt-1 text-sm text-neutral-600 line-clamp-2">
                            {act.description}
                          </p>
                        )}
                        <div className="mt-2 flex items-center gap-3 text-xs text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(act.created_at), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Upload Form */}
          <div>
            <div className="sticky top-6 rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-neutral-900 mb-2">
                Post Activity
              </h2>
              <p className="text-sm text-neutral-500 mb-6">
                Share moments from your class with parents.
              </p>
              <UploadActivityForm classId={cls.id} />
            </div>
          </div>
        </div>
      </div>

      {/* PDF Magazines Section (Preschool Only) */}
      {isPreschool && (
        <div>
          <div className="grid gap-6 md:grid-cols-[1fr_400px]">
            {/* Left Column: Documents List */}
            <div className="space-y-6">
              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-neutral-900 mb-6">
                  Uploaded PDF Magazines
                </h2>
                
                {!documents || documents.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-8 text-center text-neutral-500">
                    <FileText className="mx-auto h-8 w-8 mb-3 text-neutral-300" />
                    No magazines uploaded yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-start justify-between rounded-xl border p-4 hover:bg-neutral-50 transition">
                        <div className="flex gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-[color:var(--mec-blue)]">
                            <FileText className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-neutral-900">
                              {doc.title}
                            </h3>
                            <div className="mt-1 flex items-center gap-3 text-xs text-neutral-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(doc.created_at), "MMM d, yyyy")}
                              </span>
                              <span>{doc.file_size_mb} MB</span>
                            </div>
                          </div>
                        </div>
                        <a
                          href={doc.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-[color:var(--mec-blue)] hover:underline"
                        >
                          View
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Upload Form */}
            <div>
              <div className="sticky top-6 rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-neutral-900 mb-2">
                  Upload PDF Magazine
                </h2>
                <p className="text-sm text-neutral-500 mb-6">
                  Max file size is 35MB. Only PDF allowed.
                </p>
                <UploadDocumentForm classId={cls.id} isPreschool={true} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
