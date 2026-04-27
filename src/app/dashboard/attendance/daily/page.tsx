'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useClassList, useStudentsByClass } from '@/lib/hooks/use-students-by-class'
import { useDailyAttendance, useUpsertDailyAttendance } from '@/lib/hooks/use-daily-attendance'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function DailyAttendancePage() {
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))

  const { data: classes, isLoading: isLoadingClasses } = useClassList()
  const { data: students, isLoading: isLoadingStudents } = useStudentsByClass(selectedClass || null)
  const { data: attendanceLogs, isLoading: isLoadingAttendance } = useDailyAttendance(selectedClass || null, selectedDate)
  const upsertMutation = useUpsertDailyAttendance()

  const isLoadingData = isLoadingStudents || isLoadingAttendance
  const isFilterComplete = !!(selectedClass && selectedDate)

  const handleStatusChange = (studentId: string, status: string) => {
    upsertMutation.mutate(
      {
        class_id: selectedClass,
        date: selectedDate,
        student_id: studentId,
        status: status
      },
      {
        onError: () => toast.error("Gagal menyimpan data kehadiran.")
      }
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Input Kehadiran Harian</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Kelas & Tanggal</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="w-full md:w-1/3">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingClasses ? (
                      <div className="p-2 text-center text-sm text-muted-foreground">Loading...</div>
                    ) : (
                      classes?.map((c: any) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-1/3">
                 <Input
                   type="date"
                   value={selectedDate}
                   onChange={(e) => setSelectedDate(e.target.value)}
                   max={format(new Date(), 'yyyy-MM-dd')}
                 />
              </div>
            </div>

            <div className="mt-4">
                {!isFilterComplete ? (
                  <div className="text-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
                    Silakan pilih kelas dan tanggal untuk menginput kehadiran.
                  </div>
                ) : isLoadingData ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : !students || students.length === 0 ? (
                  <div className="text-center p-8 text-muted-foreground">
                    Tidak ada siswa aktif di kelas ini.
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nama Siswa</TableHead>
                              <TableHead className="text-center">Status Kehadiran</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {students.map((student: any) => {
                              const log = attendanceLogs?.find(l => l.student_id === student.id)
                              const currentStatus = log?.status

                              return (
                                <TableRow key={student.id}>
                                  <TableCell className="font-medium">{student.name}</TableCell>
                                  <TableCell>
                                    <div className="flex justify-center gap-2">
                                      <Button
                                        size="sm"
                                        variant={currentStatus === 'PRESENT' ? 'default' : 'outline'}
                                        className={cn(currentStatus === 'PRESENT' && "bg-green-600 hover:bg-green-700")}
                                        onClick={() => handleStatusChange(student.id, 'PRESENT')}
                                      >Hadir</Button>
                                      <Button
                                        size="sm"
                                        variant={currentStatus === 'SICK' ? 'default' : 'outline'}
                                        className={cn(currentStatus === 'SICK' && "bg-yellow-600 hover:bg-yellow-700 text-white")}
                                        onClick={() => handleStatusChange(student.id, 'SICK')}
                                      >Sakit</Button>
                                      <Button
                                        size="sm"
                                        variant={currentStatus === 'LEAVE' ? 'default' : 'outline'}
                                        className={cn(currentStatus === 'LEAVE' && "bg-blue-600 hover:bg-blue-700 text-white")}
                                        onClick={() => handleStatusChange(student.id, 'LEAVE')}
                                      >Izin</Button>
                                      <Button
                                        size="sm"
                                        variant={currentStatus === 'ALPHA' ? 'default' : 'outline'}
                                        className={cn(currentStatus === 'ALPHA' && "bg-red-600 hover:bg-red-700 text-white")}
                                        onClick={() => handleStatusChange(student.id, 'ALPHA')}
                                      >Alpha</Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                        </div>
                    </CardContent>
                  </Card>
                )}
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
