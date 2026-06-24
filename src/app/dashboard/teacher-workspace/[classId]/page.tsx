import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Calendar, Trash2 } from "lucide-react";
import { UploadDocumentForm } from "@/components/teacher-workspace/upload-document-form";
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
      programs:program_id (id, name, slug)
    `)
    .eq("id", classId)
    .single();

  if (classError || !cls) {
    redirect("/dashboard/teacher-workspace");
  }

  // Allow admins or the assigned teacher
  const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
  const isAdmin = userData?.role === 'admin' || userData?.role === 'manager' || userData?.role === 'director';
  
  if (cls.teacher_id !== user.id && !isAdmin) {
    redirect("/dashboard/teacher-workspace");
  }

  // Fetch documents
  const { data: documents } = await supabase
    .from("class_documents")
    .select("*")
    .eq("class_id", classId)
    .order("created_at", { ascending: false });

  const isPreschool = cls.programs?.slug?.toLowerCase().includes("preschool");

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

      <div className="grid gap-6 md:grid-cols-[1fr_400px]">
        {/* Left Column: Documents List */}
        <div className="space-y-6">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-neutral-900 mb-6">
              Uploaded Documents
            </h2>
            
            {!documents || documents.length === 0 ? (
              <div className="rounded-xl border border-dashed p-8 text-center text-neutral-500">
                <FileText className="mx-auto h-8 w-8 mb-3 text-neutral-300" />
                No documents uploaded yet.
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
                          <span className="rounded bg-neutral-100 px-1.5 py-0.5 font-medium">
                            {doc.document_type}
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
              Upload New
            </h2>
            <p className="text-sm text-neutral-500 mb-6">
              Max file size is 35MB. Only PDF allowed.
            </p>
            <UploadDocumentForm classId={cls.id} isPreschool={!!isPreschool} />
          </div>
        </div>
      </div>
    </div>
  );
}
