'use client'

import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTable } from '@/components/students/data-table'
import { columns } from '@/components/students/columns'
import { StudentStats } from '@/components/students/student-stats'
import { AddStudentDialog } from '@/components/students/add-student-dialog'
import { useStudents } from '@/lib/hooks/use-students'
import { useClassList } from '@/lib/hooks/use-students-by-class'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClass, setSelectedClass] = useState<string>('all') // Default to 'all'
  
  const { data: students, isLoading, isError } = useStudents()
  const { data: classes, isLoading: isLoadingClasses } = useClassList()

  // Filter client-side
  const filteredStudents = students?.filter(student => {
    // 1. Filter by Search Query (Name or NIS)
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.nis?.includes(searchQuery) ?? false);

    // 2. Filter by Class
    const matchesClass = selectedClass === 'all' || student.class_name === selectedClass;

    return matchesSearch && matchesClass;
  }) || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manajemen Siswa</h1>
          <p className="text-muted-foreground">
            Kelola data siswa, status akademik, dan riwayat pembayaran.
          </p>
        </div>
        <AddStudentDialog />
      </div>

      {/* Stats Cards */}
      <StudentStats students={students || []} />

      {/* Data Table Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 w-full sm:w-auto md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau NIS..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Class Filter Dropdown */}
          <div className="w-full sm:w-[200px]">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kelas</SelectItem>
                {isLoadingClasses ? (
                  <div className="p-2 text-center text-sm text-muted-foreground">Loading...</div>
                ) : (
                  classes?.map((className) => (
                    <SelectItem key={className} value={className}>
                      {className}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border bg-card w-full max-w-[calc(100vw-2rem)] md:max-w-[calc(100vw-20rem)] overflow-hidden">
          {isLoading ? (
             <div className="p-8 space-y-4">
               <div className="flex items-center justify-between">
                 <Skeleton className="h-8 w-[200px]" />
                 <Skeleton className="h-8 w-[100px]" />
               </div>
               <Skeleton className="h-[300px] w-full" />
             </div>
          ) : isError ? (
            <div className="p-8 text-center text-red-500">
              Gagal memuat data siswa. Silakan coba lagi.
            </div>
          ) : (
            <DataTable columns={columns} data={filteredStudents} />
          )}
        </div>
      </div>
    </div>
  )
}
