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
  const [selectedPaymentMonth, setSelectedPaymentMonth] = useState<string>('all')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all') // 'all', 'paid', 'unpaid'
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  
  const { data: students, isLoading, isError } = useStudents()
  const { data: classes, isLoading: isLoadingClasses } = useClassList()
  const { data: programs, isLoading: isLoadingPrograms } = usePrograms()

  // Filter available classes based on selected programs
  const selectedProgramIds = programs?.filter(p => selectedPrograms.includes(p.name)).map(p => p.id) || []
  const availableClasses = classes?.filter(c => 
    selectedProgramIds.length === 0 || selectedProgramIds.includes(c.program_id)
  ) || []

  // Filter client-side
  const filteredStudents = students?.filter(student => {
    // 1. Filter by Search Query (Name or NIS)
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.nis?.includes(searchQuery) ?? false);

    // 2. Filter by Class
    const matchesClass = selectedClasses.length === 0 ||
      (student.enrollments && student.enrollments.some((e: any) => selectedClasses.includes(e.class_name)));

    // 3. Filter by Program
    const matchesProgram = selectedPrograms.length === 0 ||
      (student.programs && student.programs.some((p: string) => selectedPrograms.includes(p)));

    // 4. Filter by Status
    const matchesStatus = statusFilter === 'ALL' || student.status === statusFilter;

    // 5. Filter by Payment Status
    let matchesPayment = true;
    if (selectedPaymentMonth !== 'all' && paymentStatusFilter !== 'all') {
      const monthIdx = parseInt(selectedPaymentMonth);
      const months = ['januari', 'februari', 'maret', 'april', 'mei', 'juni', 'juli', 'agustus', 'september', 'oktober', 'november', 'desember'];
      const monthKey = `${months[monthIdx]}_sort` as keyof typeof student;
      const statusValue = student[monthKey] as number;
      
      if (paymentStatusFilter === 'paid') {
        matchesPayment = statusValue === 1;
      } else if (paymentStatusFilter === 'unpaid') {
        matchesPayment = statusValue === 0 || statusValue === -1;
      }
    }

    return matchesSearch && matchesClass && matchesProgram && matchesStatus && matchesPayment;
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
              year={selectedYear}
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
              yearFilterElement={
                <div className="w-full sm:w-[120px]">
                  <Select value={selectedYear.toString()} onValueChange={(val) => setSelectedYear(parseInt(val))}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Tahun" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 1 + i).map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                              {availableClasses && [...availableClasses].sort((a, b) => a.name.localeCompare(b.name)).map((c) => (
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
                  
                  {/* Payment Filters Container */}
                  <div className="flex w-full sm:w-auto gap-2">
                    <Select value={selectedPaymentMonth} onValueChange={setSelectedPaymentMonth}>
                      <SelectTrigger className="h-9 w-[130px]">
                        <SelectValue placeholder="Bulan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Bulan Apapun</SelectItem>
                        {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'].map((m, i) => (
                          <SelectItem key={i} value={i.toString()}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                      <SelectTrigger className="h-9 w-[130px]">
                        <SelectValue placeholder="Status Bayar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="paid">Lunas</SelectItem>
                        <SelectItem value="unpaid">Menunggak</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Clear Filters Button */}
                  {(selectedClasses.length > 0 || selectedPrograms.length > 0 || statusFilter !== 'ACTIVE' || searchQuery !== '' || selectedPaymentMonth !== 'all' || paymentStatusFilter !== 'all') && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-9 text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        setSelectedClasses([])
                        setSelectedPrograms([])
                        setStatusFilter('ACTIVE')
                        setSearchQuery('')
                        setSelectedPaymentMonth('all')
                        setPaymentStatusFilter('all')
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
