"use client";

import { TuitionMatrixTable } from "@/components/students/tuition-matrix-table";
import { AddStudentDialog } from "@/components/students/add-student-dialog";

export default function StudentsPage() {
  return (
    <div className="space-y-8 p-8 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Students</h1>
          <p className="text-slate-600 mt-1">Manage student tuition payments and enrollment</p>
        </div>
        <AddStudentDialog />
      </div>

      <div className="flex-1 min-h-0 border rounded-lg bg-white shadow-sm overflow-hidden">
        <TuitionMatrixTable />
      </div>
    </div>
  );
}