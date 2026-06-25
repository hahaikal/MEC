'use client'

import { useState, useMemo } from 'react'
import { format, getDaysInMonth, getDay } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useStudentsByClass } from '@/lib/hooks/use-students-by-class'
import { useMonthlyAttendance, useUpsertDailyAttendance, useMarkHolidayForClass } from '@/lib/hooks/use-daily-attendance'
import { Loader2, Check, X, Plane, Stethoscope, HelpCircle, CalendarOff } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const DAY_MAP: Record<string, number> = {
  'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
  'Thursday': 4, 'Friday': 5, 'Saturday': 6
}

interface AttendanceMatrixProps {
  classData: any
  month: number
  year: number
}

export function AttendanceMatrix({ classData, month, year }: AttendanceMatrixProps) {
  const { data: students, isLoading: isLoadingStudents } = useStudentsByClass(classData?.id || null)
  const { data: logs, isLoading: isLoadingLogs } = useMonthlyAttendance(classData?.id || null, month, year)
  
  const upsertMutation = useUpsertDailyAttendance()
  const holidayMutation = useMarkHolidayForClass()

  // Calculate valid dates in the month based on schedule_days
  const validDates = useMemo(() => {
    if (!classData || !classData.schedule_days || classData.schedule_days.length === 0) return []
    
    const allowedDays = classData.schedule_days.map((d: string) => DAY_MAP[d])
    const daysInMonth = getDaysInMonth(new Date(year, month - 1))
    const dates = []

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month - 1, i)
      if (allowedDays.includes(getDay(date))) {
        dates.push(format(date, 'yyyy-MM-dd'))
      }
    }
    
    return dates
  }, [classData, month, year])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PRESENT': return <Check className="w-4 h-4 text-green-600" />
      case 'SICK': return <Stethoscope className="w-4 h-4 text-yellow-500" />
      case 'LEAVE': return <Plane className="w-4 h-4 text-blue-500" />
      case 'ALPHA': return <X className="w-4 h-4 text-red-500" />
      case 'HOLIDAY': return <CalendarOff className="w-4 h-4 text-slate-400" />
      default: return <HelpCircle className="w-4 h-4 text-slate-300" />
    }
  }

  const handleStatusChange = (studentId: string, date: string, status: string, closePopover?: () => void) => {
    upsertMutation.mutate(
      { class_id: classData.id, date, student_id: studentId, status },
      {
        onSuccess: () => {
          if (closePopover) closePopover()
        },
        onError: () => toast.error("Gagal menyimpan data kehadiran.")
      }
    )
  }

  const handleSetHoliday = (date: string) => {
    if (!students || students.length === 0) return
    const studentIds = students.map((s: any) => s.id)
    holidayMutation.mutate(
      { class_id: classData.id, date, student_ids: studentIds },
      {
        onSuccess: () => toast.success(`Kelas diliburkan pada ${format(new Date(date), 'dd MMM', { locale: idLocale })}`),
        onError: () => toast.error("Gagal meliburkan kelas.")
      }
    )
  }

  if (!classData?.schedule_days || classData.schedule_days.length === 0) {
    return (
      <div className="text-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
        Jadwal hari kelas belum diatur. Silakan atur jadwal di menu Manajemen Kelas terlebih dahulu.
      </div>
    )
  }

  if (isLoadingStudents || isLoadingLogs) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!students || students.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground border rounded-lg">
        Tidak ada siswa aktif di kelas ini.
      </div>
    )
  }

  if (validDates.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground border rounded-lg">
        Tidak ada jadwal pertemuan kelas pada bulan ini berdasarkan jadwal hari kelas yang ditentukan.
      </div>
    )
  }

  return (
    <div className="w-full rounded-md border overflow-x-auto bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px] sticky left-0 bg-slate-50 z-10 shadow-[1px_0_0_0_#e2e8f0]">Nama Siswa</TableHead>
            {validDates.map(date => {
              const d = new Date(date)
              return (
                <TableHead key={date} className="text-center min-w-[80px]">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs font-normal text-muted-foreground">{format(d, 'EEE', { locale: idLocale })}</span>
                    <span className="font-semibold">{format(d, 'dd')}</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-full text-[10px] mt-1 text-muted-foreground hover:text-red-600">
                          Set Libur
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-2">
                         <div className="space-y-2">
                            <p className="text-xs text-center">Liburkan seluruh anak pada tanggal {format(d, 'dd MMM yyyy')}?</p>
                            <Button size="sm" variant="destructive" className="w-full" onClick={() => handleSetHoliday(date)}>
                              Ya, Liburkan Kelas
                            </Button>
                         </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student: any) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium sticky left-0 bg-white z-10 shadow-[1px_0_0_0_#e2e8f0]">
                {student.name}
              </TableCell>
              {validDates.map(date => {
                const log = logs?.find((l: any) => l.student_id === student.id && l.date === date)
                const currentStatus = log?.status

                return (
                  <TableCell key={date} className="text-center p-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn("h-8 w-8", currentStatus ? "bg-slate-50" : "opacity-50")}
                        >
                          {getStatusIcon(currentStatus)}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-2" align="center">
                        <div className="grid grid-cols-2 gap-2">
                          <Button size="sm" variant="outline" className="justify-start gap-2 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleStatusChange(student.id, date, 'PRESENT')}>
                            <Check className="w-4 h-4" /> Hadir
                          </Button>
                          <Button size="sm" variant="outline" className="justify-start gap-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50" onClick={() => handleStatusChange(student.id, date, 'SICK')}>
                            <Stethoscope className="w-4 h-4" /> Sakit
                          </Button>
                          <Button size="sm" variant="outline" className="justify-start gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleStatusChange(student.id, date, 'LEAVE')}>
                            <Plane className="w-4 h-4" /> Izin
                          </Button>
                          <Button size="sm" variant="outline" className="justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleStatusChange(student.id, date, 'ALPHA')}>
                            <X className="w-4 h-4" /> Alpha
                          </Button>
                          <Button size="sm" variant="outline" className="col-span-2 justify-center gap-2 text-slate-600 hover:text-slate-700 hover:bg-slate-50" onClick={() => handleStatusChange(student.id, date, 'HOLIDAY')}>
                            <CalendarOff className="w-4 h-4" /> Libur
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
