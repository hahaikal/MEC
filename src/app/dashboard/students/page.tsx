"use client";

import { useQuery } from "@tanstack/react-query";
import { AddStudentDialog } from "@/components/students/add-student-dialog";
import { DataTable } from "@/components/students/data-table";
import { columns, Student } from "@/components/students/columns";
import { Skeleton } from "@/components/ui/skeleton";
import { getStudents } from "@/actions/students"; // Gunakan Server Action

export default function StudentsPage() {
  
  const { data: response, isLoading, isError } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      // Menggunakan Server Action yang baru dibuat
      const res = await getStudents(1, 100); 
      if (!res.success) throw new Error(res.message);
      return res.data; 
    },
  });

  const students = response?.students || [];

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Siswa</h2>
          <p className="text-muted-foreground">
            Kelola data induk siswa dan status pembayaran.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <AddStudentDialog />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
             <Skeleton className="h-10 w-[250px]" />
             <Skeleton className="h-10 w-[100px]" />
          </div>
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-destructive/50 p-8 text-center text-destructive">
          <p>Terjadi kesalahan saat memuat data siswa. Silakan coba muat ulang.</p>
        </div>
      ) : (
        <DataTable columns={columns} data={students} />
      )}
    </div>
  );
}