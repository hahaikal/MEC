'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { Student, AttendanceSummary } from '@/types/attendance'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { useUpsertAttendance } from '@/lib/hooks/use-attendance'
import { TableCell, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface AttendanceRowProps {
  student: Student
  className: string
  semester: number
  year: number
  initialAttendance?: AttendanceSummary | null
}

export function AttendanceRow({
  student,
  className,
  semester,
  year,
  initialAttendance
}: AttendanceRowProps) {

  const [total, setTotal] = useState(initialAttendance?.total_meetings || 0)
  const [sick, setSick] = useState(initialAttendance?.sick || 0)
  const [leave, setLeave] = useState(initialAttendance?.leave || 0)
  const [alpha, setAlpha] = useState(initialAttendance?.alpha || 0)
  
  const [isSaving, setIsSaving] = useState(false)
  const [hasError, setHasError] = useState(false)

  const isFirstRender = useRef(true)

  const upsertMutation = useUpsertAttendance()

  useEffect(() => {
    setTotal(initialAttendance?.total_meetings || 0)
    setSick(initialAttendance?.sick || 0)
    setLeave(initialAttendance?.leave || 0)
    setAlpha(initialAttendance?.alpha || 0)
  }, [initialAttendance])

  const attended = Math.max(0, total - sick - leave - alpha)
  const percentage = total > 0 ? (attended / total) * 100 : 0

  let indicatorColor = "bg-red-500" // < 50%
  if (percentage >= 80) indicatorColor = "bg-green-500"
  else if (percentage >= 50) indicatorColor = "bg-yellow-500"

  useEffect(() => {
    if ((sick + leave + alpha) > total && total > 0) {
      setHasError(true)
    } else {
      setHasError(false)
    }
  }, [total, sick, leave, alpha])

  const saveData = useCallback(
    (newTotal: number, newSick: number, newLeave: number, newAlpha: number) => {
      // Input Validation: Prevent save if absenses > Total
      if ((newSick + newLeave + newAlpha) > newTotal && newTotal > 0) {
         return
      }

      setIsSaving(true)
      upsertMutation.mutate(
        {
          student_id: student.id,
          class_name: className,
          semester,
          year,
          total_meetings: newTotal,
          sick: newSick,
          leave: newLeave,
          alpha: newAlpha
        },
        {
          onSuccess: () => {
            setIsSaving(false)
          },
          onError: (error) => {
            setIsSaving(false)
            toast.error("Failed to save attendance")
            console.error(error)
          }
        }
      )
    },
    [className, semester, year, student.id, upsertMutation]
  )

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (
      total === (initialAttendance?.total_meetings || 0) &&
      sick === (initialAttendance?.sick || 0) &&
      leave === (initialAttendance?.leave || 0) &&
      alpha === (initialAttendance?.alpha || 0)
    ) {
      return
    }

    // Debounce save
    const handler = setTimeout(() => {
      // Validation Check before calling save
      if ((sick + leave + alpha) > total && total > 0) {
        toast.error(`Error: Total absensi (${sick + leave + alpha}) melebihi total pertemuan (${total})`)
        return; // Do not save
      }
      saveData(total, sick, leave, alpha)
    }, 800)

    return () => {
      clearTimeout(handler)
    }
  }, [total, sick, leave, alpha, saveData, initialAttendance])

  return (
    <TableRow>
      <TableCell className="font-medium">
        {student.name}
        {student.status?.toUpperCase() !== 'ACTIVE' && <span className="text-xs text-muted-foreground ml-2">({student.status})</span>}
      </TableCell>
      <TableCell>
        <Input
          type="number"
          min="0"
          value={total}
          onChange={(e) => setTotal(parseInt(e.target.value) || 0)}
          className="w-16 h-8 text-center"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          min="0"
          value={sick}
          onChange={(e) => setSick(parseInt(e.target.value) || 0)}
          className={cn("w-16 h-8 text-center", hasError && "border-red-500 focus-visible:ring-red-500")}
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          min="0"
          value={leave}
          onChange={(e) => setLeave(parseInt(e.target.value) || 0)}
          className={cn("w-16 h-8 text-center", hasError && "border-red-500 focus-visible:ring-red-500")}
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          min="0"
          value={alpha}
          onChange={(e) => setAlpha(parseInt(e.target.value) || 0)}
          className={cn("w-16 h-8 text-center", hasError && "border-red-500 focus-visible:ring-red-500")}
        />
      </TableCell>
      <TableCell className="text-right font-semibold">
        {attended}
      </TableCell>
      <TableCell className="w-[150px]">
        <div className="flex items-center gap-2">
          <Progress value={percentage} className="h-2" indicatorClassName={indicatorColor} />
          <span className="text-xs w-10 text-right">{percentage.toFixed(0)}%</span>
        </div>
      </TableCell>
      <TableCell className="text-center">
        {isSaving ? <span className="text-xs text-muted-foreground animate-pulse">Saving...</span> :
         hasError ? <span className="text-xs text-red-500">Invalid</span> : null}
      </TableCell>
    </TableRow>
  )
}
