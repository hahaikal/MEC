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
import { Check, ChevronsUpDown } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])
  const [openClassFilter, setOpenClassFilter] = useState(false)
  
  const { data: students, isLoading, isError } = useStudents()
  const { data: classes, isLoading: isLoadingClasses } = useClassList()

  // Filter client-side
  const filteredStudents = students?.filter(student => {
    // 1. Filter by Search Query (Name or NIS)
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.nis?.includes(searchQuery) ?? false);

    // 2. Filter by Class
    const matchesClass = selectedClasses.length === 0 ||
      (student.class_name && selectedClasses.includes(student.class_name));

    return matchesSearch && matchesClass;
  }) || []

  const toggleClass = (className: string) => {
    setSelectedClasses(current =>
      current.includes(className)
        ? current.filter(c => c !== className)
        : [...current, className]
    )
  }

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

          {/* Multi-Class Filter */}
          <div className="w-full sm:w-[250px]">
            <Popover open={openClassFilter} onOpenChange={setOpenClassFilter}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openClassFilter}
                  className="w-full justify-between"
                  disabled={isLoadingClasses}
                >
                  {selectedClasses.length === 0
                    ? "Semua Kelas"
                    : `${selectedClasses.length} Kelas Dipilih`}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[250px] p-0">
                <Command>
                  <CommandInput placeholder="Cari kelas..." />
                  <CommandList>
                    <CommandEmpty>Kelas tidak ditemukan.</CommandEmpty>
                    <CommandGroup>
                      {classes?.map((c) => (
                        <CommandItem
                          key={c.id}
                          value={c.name}
                          onSelect={() => toggleClass(c.name)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedClasses.includes(c.name) ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {c.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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
