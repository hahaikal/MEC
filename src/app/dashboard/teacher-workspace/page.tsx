import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Users, User } from "lucide-react";

export default async function TeacherWorkspacePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: userData } = await supabase.from('users').select('roles').eq('id', user.id).single();
  const isAdmin = userData?.roles?.some((r: string) => ['Admin', 'Manager', 'Director', 'Staff'].includes(r));

  // Fetch classes taught by this teacher (or all classes if admin)
  let query = supabase
    .from("classes")
    .select(`
      *,
      class_teachers!inner (teacher_id),
      programs:program_id (name),
      class_enrollments(count)
    `)
    .eq("is_active", true);

  if (!isAdmin) {
    query = query.eq("class_teachers.teacher_id", user.id);
  }

  const { data: classes, error } = await query;

  if (error) {
    console.error("Error fetching teacher classes:", error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Teacher Workspace
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your classes, lesson plans, and magazines.
        </p>
      </div>

      {!classes || classes.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-neutral-300" />
          <h3 className="mt-4 text-lg font-semibold">No Classes Assigned</h3>
          <p className="mt-2 text-sm text-neutral-500">
            You have not been assigned to any classes yet. Please contact the administrator.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <Link
              key={cls.id}
              href={`/dashboard/teacher-workspace/${cls.id}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="h-2 bg-[color:var(--mec-blue)]" />
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-4 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[color:var(--mec-blue)] w-fit">
                  {cls.programs?.name || "Program"}
                </div>
                <h3 className="text-xl font-bold text-neutral-900 group-hover:text-[color:var(--mec-blue)] transition-colors">
                  {cls.name}
                </h3>
                <div className="mt-4 flex flex-col space-y-2 text-sm text-neutral-500">
                  <p className="text-sm font-medium">Class Teacher</p>
                  <p className="text-sm text-muted-foreground">
                    Multiple Teachers
                  </p>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    <span>{cls.class_enrollments?.[0]?.count || 0} students</span>
                  </div>
                </div>
              </div>
              <div className="border-t bg-neutral-50 px-6 py-4">
                <span className="text-sm font-medium text-[color:var(--mec-blue)]">
                  Manage Content &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
