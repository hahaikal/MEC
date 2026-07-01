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
import { usePrograms } from '@/lib/hooks/use-programs'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from '@/lib/utils'

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([])
  const [openClassFilter, setOpenClassFilter] = useState(false)
  const [openProgramFilter, setOpenProgramFilter] = useState(false)
  const [statusFilter, setStatusFilter] = useState('ACTIVE') // 'ACTIVE', 'INACTIVE', or 'ALL'
  
  const { data: students, isLoading, isError } = useStudents()
  const { data: classes, isLoading: isLoadingClasses } = useClassList()
  const { data: programs, isLoading: isLoadingPrograms } = usePrograms()

  // Filter client-side
  const filteredStudents = students?.filter(student => {
    // 1. Filter by Search Query (Name or NIS)
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.nis?.includes(searchQuery) ?? false);

    // 2. Filter by Class
    const matchesClass = selectedClasses.length === 0 ||
      (student.class_name && selectedClasses.includes(student.class_name));

    // 3. Filter by Program
    const matchesProgram = selectedPrograms.length === 0 ||
      (student.programs && student.programs.some((p: string) => selectedPrograms.includes(p)));

    // 4. Filter by Status
    const matchesStatus = statusFilter === 'ALL' || student.status === statusFilter;

    return matchesSearch && matchesClass && matchesProgram && matchesStatus;
  }) || []

  const toggleClass = (className: string) => {
    setSelectedClasses(current =>
      current.includes(className)
        ? current.filter(c => c !== className)
        : [...current, className]
    )
  }

  const toggleProgram = (programName: string) => {
    setSelectedPrograms(current =>
      current.includes(programName)
        ? current.filter(p => p !== programName)
        : [...current, programName]
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
            <DataTable 
              columns={columns} 
              data={filteredStudents} 
              searchElement={
                <div className="relative w-full sm:w-[300px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari nama atau NIS..."
                    className="pl-8 h-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              }
              filterElements={
                <>
                  {/* Multi-Class Filter */}
                  <div className="w-full sm:w-[300px]">
                    <Popover open={openClassFilter} onOpenChange={setOpenClassFilter}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openClassFilter}
                          className="w-full justify-between h-9"
                          disabled={isLoadingClasses}
                        >
                          {selectedClasses.length === 0
                            ? "Semua Kelas"
                            : `${selectedClasses.length} Kelas Dipilih`}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput placeholder="Cari kelas..." />
                          <CommandList>
                            <CommandEmpty>Kelas tidak ditemukan.</CommandEmpty>
                            <CommandGroup>
                              {classes && [...classes].sort((a, b) => a.name.localeCompare(b.name)).map((c) => (
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

                  {/* Multi-Program Filter */}
                  <div className="w-full sm:w-[200px]">
                    <Popover open={openProgramFilter} onOpenChange={setOpenProgramFilter}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openProgramFilter}
                          className="w-full justify-between h-9"
                          disabled={isLoadingPrograms}
                        >
                          {selectedPrograms.length === 0
                            ? "Semua Program"
                            : `${selectedPrograms.length} Program Dipilih`}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Cari program..." />
                          <CommandList>
                            <CommandEmpty>Program tidak ditemukan.</CommandEmpty>
                            <CommandGroup>
                              {programs && [...programs].sort((a, b) => a.name.localeCompare(b.name)).map((p) => (
                                <CommandItem
                                  key={p.id}
                                  value={p.name}
                                  onSelect={() => toggleProgram(p.name)}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedPrograms.includes(p.name) ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {p.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Status Filter */}
                  <div className="w-full sm:w-[150px]">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Status Siswa" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Aktif</SelectItem>
                        <SelectItem value="INACTIVE">Nonaktif</SelectItem>
                        <SelectItem value="ALL">Semua Status</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Clear Filters Button */}
                  {(selectedClasses.length > 0 || selectedPrograms.length > 0 || statusFilter !== 'ACTIVE' || searchQuery !== '') && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-9 text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        setSelectedClasses([])
                        setSelectedPrograms([])
                        setStatusFilter('ACTIVE')
                        setSearchQuery('')
                      }}
                    >
                      Reset Filter
                    </Button>
                  )}
                </>
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}
