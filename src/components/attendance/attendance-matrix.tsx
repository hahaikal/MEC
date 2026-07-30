'use client'

import { useState, useMemo } from 'react'
import { format, getDaysInMonth, getDay } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useStudentsByClass } from '@/lib/hooks/use-students-by-class'
import { useMonthlyAttendance, useUpsertDailyAttendance, useMarkHolidayForClass, useCancelHolidayForClass } from '@/lib/hooks/use-daily-attendance'
import { Loader2, Check, X, Plane, Stethoscope, HelpCircle, CalendarOff, Undo2 } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { StudentDetailDialog } from '@/components/students/StudentDetailDialog'
import { Minus } from 'lucide-react'

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
  const [loadingDate, setLoadingDate] = useState<string | null>(null)
  const [loadingCell, setLoadingCell] = useState<{studentId: string, date: string} | null>(null)

  const { data: students, isLoading: isLoadingStudents } = useStudentsByClass(classData?.id || null)
  const { data: logs, isLoading: isLoadingLogs } = useMonthlyAttendance(classData?.id || null, month, year)
  
  const upsertMutation = useUpsertDailyAttendance()
  const holidayMutation = useMarkHolidayForClass()
  const cancelHolidayMutation = useCancelHolidayForClass()

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
      case 'NOT_ENROLLED': return <Minus className="w-4 h-4 text-slate-400" />
      default: return <HelpCircle className="w-4 h-4 text-slate-300" />
    }
  }

  const handleStatusChange = (studentId: string, date: string, status: string, closePopover?: () => void) => {
    setLoadingCell({ studentId, date })
    upsertMutation.mutate(
      { class_id: classData.id, date, student_id: studentId, status },
      {
        onSuccess: () => {
          setLoadingCell(null)
          if (closePopover) closePopover()
        },
        onError: () => {
          setLoadingCell(null)
          toast.error("Gagal menyimpan data kehadiran.")
        }
      }
    )
  }

  const handleSetHoliday = (date: string, isCancel = false) => {
    if (!students || students.length === 0) return
    const studentIds = students.map((s: any) => s.id)
    setLoadingDate(date)
    if (isCancel) {
      cancelHolidayMutation.mutate(
        { class_id: classData.id, date },
        {
          onSuccess: () => {
            toast.success(`Libur dibatalkan pada ${format(new Date(date), 'dd MMM', { locale: idLocale })}`)
            setLoadingDate(null)
          },
          onError: () => {
            toast.error("Gagal membatalkan libur.")
            setLoadingDate(null)
          }
        }
      )
    } else {
      holidayMutation.mutate(
        { class_id: classData.id, date, student_ids: studentIds },
        {
          onSuccess: () => {
            toast.success(`Kelas diliburkan pada ${format(new Date(date), 'dd MMM', { locale: idLocale })}`)
            setLoadingDate(null)
          },
          onError: () => {
            toast.error("Gagal meliburkan kelas.")
            setLoadingDate(null)
          }
        }
      )
    }
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
              const isHoliday = students && students.every((s: any) => {
                 const log = logs?.find((l: any) => l.student_id === s.id && l.date === date)
                 return log?.status === 'HOLIDAY'
              }) && students.length > 0;

              return (
                <TableHead key={date} className="text-center min-w-[80px]">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs font-normal text-muted-foreground">{format(d, 'EEE', { locale: idLocale })}</span>
                    <span className="font-semibold">{format(d, 'dd')}</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className={cn("h-6 w-full text-[10px] mt-1 hover:text-red-600", isHoliday ? "text-red-500 font-medium" : "text-muted-foreground")}>
                          {isHoliday ? "Diliburkan" : "Set Libur"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-2">
                         <div className="space-y-2">
                            <p className="text-xs text-center">
                              {isHoliday ? `Batalkan libur pada tanggal ${format(d, 'dd MMM yyyy')}?` : `Liburkan seluruh anak pada tanggal ${format(d, 'dd MMM yyyy')}?`}
                            </p>
                            {isHoliday ? (
                               <Button size="sm" variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700" onClick={() => handleSetHoliday(date, true)} disabled={loadingDate === date}>
                                 {loadingDate === date ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Undo2 className="w-3 h-3 mr-2" />} Batalkan Libur
                               </Button>
                            ) : (
                               <Button size="sm" variant="destructive" className="w-full" onClick={() => handleSetHoliday(date, false)} disabled={loadingDate === date}>
                                 {loadingDate === date ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : null} Ya, Liburkan Kelas
                               </Button>
                            )}
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
                <StudentDetailDialog student={student} profileOnly>
                  <Button variant="link" className="p-0 h-auto font-medium text-slate-900 hover:text-primary whitespace-nowrap">
                    {student.name}
                  </Button>
                </StudentDetailDialog>
              </TableCell>
              {validDates.map(date => {
                const log = logs?.find((l: any) => l.student_id === student.id && l.date === date)
                const currentStatus = log?.status

                const isLoadingThisCell = loadingCell?.studentId === student.id && loadingCell?.date === date

                return (
                  <TableCell key={date} className="text-center p-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn("h-8 w-8", currentStatus ? "bg-slate-50" : "opacity-50")}
                          disabled={isLoadingThisCell}
                        >
                          {isLoadingThisCell ? <Loader2 className="w-4 h-4 animate-spin text-slate-400" /> : getStatusIcon(currentStatus)}
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
                          <Button size="sm" variant="outline" className="justify-start gap-2 text-slate-600 hover:text-slate-700 hover:bg-slate-50 col-span-2" onClick={() => handleStatusChange(student.id, date, 'NOT_ENROLLED')}>
                            <Minus className="w-4 h-4" /> Belum Masuk / Tdk Aktif
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
