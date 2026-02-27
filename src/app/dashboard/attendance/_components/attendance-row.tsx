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
  month: number
  year: number
  initialAttendance?: AttendanceSummary | null
}

export function AttendanceRow({
  student,
  className,
  month,
  year,
  initialAttendance
}: AttendanceRowProps) {
  // Set default attended to 15 if no record exists
  // If record exists, use that. If not, default to 15 (but only if total is also unset or 0?)
  // Requirement: "pertama nilai default Attended adalah 15"
  const [total, setTotal] = useState(initialAttendance?.total_meetings || 0)
  const [attended, setAttended] = useState(initialAttendance?.attended_meetings ?? 15) // Use nullish coalescing to default to 15 if undefined/null
  
  const [isSaving, setIsSaving] = useState(false)
  const [hasError, setHasError] = useState(false)

  const isFirstRender = useRef(true)

  const upsertMutation = useUpsertAttendance()

  useEffect(() => {
    setTotal(initialAttendance?.total_meetings || 0)
    // If initialAttendance is present, use its value. Otherwise, default to 15.
    setAttended(initialAttendance?.attended_meetings ?? 15)
  }, [initialAttendance])

  const percentage = total > 0 ? (attended / total) * 100 : 0

  let indicatorColor = "bg-red-500" // < 50%
  if (percentage >= 80) indicatorColor = "bg-green-500"
  else if (percentage >= 50) indicatorColor = "bg-yellow-500"

  useEffect(() => {
    if (attended > total && total > 0) {
      setHasError(true)
    } else {
      setHasError(false)
    }
  }, [total, attended])

  const saveData = useCallback(
    (newTotal: number, newAttended: number) => {
      // Input Validation: Prevent save if Attended > Total
      if (newAttended > newTotal && newTotal > 0) {
         // Show alert only if it's not the initial render/load causing this
         // But here we are inside saveData which is called by debounce.
         // We should just abort save and show error.
         // toast.error(`Cannot save: Attended (${newAttended}) > Total (${newTotal})`)
         return
      }

      setIsSaving(true)
      upsertMutation.mutate(
        {
          student_id: student.id,
          class_name: className,
          month,
          year,
          total_meetings: newTotal,
          attended_meetings: newAttended
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
    [className, month, year, student.id, upsertMutation]
  )

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (
      total === (initialAttendance?.total_meetings || 0) &&
      attended === (initialAttendance?.attended_meetings ?? 15)
    ) {
      return
    }

    // Debounce save
    const handler = setTimeout(() => {
      // Validation Check before calling save
      if (attended > total && total > 0) {
        toast.error(`Error: Attended (${attended}) cannot be greater than Total (${total})`)
        return; // Do not save
      }
      saveData(total, attended)
    }, 800)

    return () => {
      clearTimeout(handler)
    }
  }, [total, attended, saveData, initialAttendance])

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
          className="w-20 h-8"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          min="0"
          value={attended}
          onChange={(e) => {
             const val = parseInt(e.target.value) || 0;
             setAttended(val);
          }}
          className={cn("w-20 h-8", hasError && "border-red-500 focus-visible:ring-red-500")}
        />
      </TableCell>
      <TableCell className="w-[200px]">
        <div className="flex items-center gap-2">
          <Progress value={percentage} className="h-2" indicatorClassName={indicatorColor} />
          <span className="text-xs w-12 text-right">{percentage.toFixed(0)}%</span>
        </div>
      </TableCell>
      <TableCell>
        {isSaving ? <span className="text-xs text-muted-foreground animate-pulse">Saving...</span> :
         hasError ? <span className="text-xs text-red-500">Invalid</span> : null}
      </TableCell>
    </TableRow>
  )
}
