"use client";

import { AddStudentDialog } from "@/components/students/add-student-dialog";
import { columns } from "@/components/students/columns";
import { DataTable } from "@/components/students/data-table";
import { useStudents } from "@/lib/hooks/use-students";
import { Loader2 } from "lucide-react";

export default function StudentsPage() {
  const { data: students, isLoading, error } = useStudents();

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-red-500">
        Error loading data: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Siswa</h1>
          <p className="text-muted-foreground">
            Kelola data siswa, pendaftaran, dan status akademik.
          </p>
        </div>
        <AddStudentDialog />
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <DataTable columns={columns} data={students || []} />
      )}
    </div>
  );
}