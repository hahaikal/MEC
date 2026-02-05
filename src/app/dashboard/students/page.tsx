"use client";

import { useState, useMemo } from "react";
import { AddStudentDialog } from "@/components/students/add-student-dialog";
import { StudentPaymentCard } from "@/components/students/student-payment-card";
import { useStudents } from "@/lib/hooks/use-students";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StudentsPage() {
  const { data: students, isLoading, error } = useStudents();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Filter siswa berdasarkan search dan status
  const filteredStudents = useMemo(() => {
    let result = students || [];

    // Filter berdasarkan search query
    if (searchQuery) {
      result = result.filter(
        (student) =>
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.nis.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.parent_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter berdasarkan status
    if (statusFilter !== "ALL") {
      result = result.filter((student) => student.status === statusFilter);
    }

    return result;
  }, [students, searchQuery, statusFilter]);

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-red-500">
        Error loading data: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Siswa</h1>
          <p className="text-muted-foreground">
            Kelola data siswa, pendaftaran, dan status akademik.
          </p>
        </div>
        <AddStudentDialog />
      </div>

      {/* Search dan Filter */}
      <div className="flex gap-4 items-end">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama, NIS, atau orang tua..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua Status</SelectItem>
            <SelectItem value="ACTIVE">Aktif</SelectItem>
            <SelectItem value="GRADUATED">Lulus</SelectItem>
            <SelectItem value="DROPOUT">Keluar (DO)</SelectItem>
            <SelectItem value="ON_LEAVE">Cuti</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Tidak ada data siswa ditemukan</p>
            <p className="text-sm text-muted-foreground mt-1">
              {searchQuery || statusFilter !== "ALL"
                ? "Coba ubah filter pencarian"
                : "Mulai dengan menambahkan siswa baru"}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Info */}
          <div className="text-sm text-muted-foreground">
            Menampilkan <span className="font-semibold">{filteredStudents.length}</span> dari{" "}
            <span className="font-semibold">{students?.length || 0}</span> siswa
          </div>

          {/* Grid Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((student) => (
              <StudentPaymentCard key={student.id} student={student} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
