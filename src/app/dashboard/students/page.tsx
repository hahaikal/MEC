import { Suspense } from "react";
import { Metadata } from "next";
import { getStudents } from "@/actions/students";
import { AddStudentDialog } from "@/components/students/add-student-dialog";
import { StudentStats } from "@/components/students/student-stats";
import { StudentsClientWrapper } from "@/components/students/students-client-wrapper";

export const metadata: Metadata = {
  title: "Data Siswa & Keuangan",
  description: "Kelola data siswa dan status pembayaran SPP",
};

export default async function StudentsPage() {
  const students = await getStudents();

  return (
    <div className="flex flex-col space-y-6 p-8 h-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manajemen Siswa</h2>
          <p className="text-muted-foreground">
            Monitoring pembayaran SPP dan data siswa.
          </p>
        </div>
        <AddStudentDialog />
      </div>

      {/* Stats Section - Memberikan insight cepat */}
      <Suspense fallback={<div className="h-32 bg-muted/20 animate-pulse rounded-lg" />}>
        <StudentStats students={students} />
      </Suspense>

      {/* Main Content (Filters + Table Matrix) */}
      <div className="flex-1 overflow-hidden rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-4 md:p-6 h-full flex flex-col">
          {/* Wrapper client untuk logic filtering */}
          <StudentsClientWrapper initialData={students} />
        </div>
      </div>
    </div>
  );
}