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
  programId: string
  month: number
  year: number
  initialAttendance?: AttendanceSummary | null
}

export function AttendanceRow({
  student,
  programId,
  month,
  year,
  initialAttendance
}: AttendanceRowProps) {
  const [total, setTotal] = useState(initialAttendance?.total_meetings || 0)
  const [attended, setAttended] = useState(initialAttendance?.attended_meetings || 0)
  const [isSaving, setIsSaving] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Ref to track if the current state differs from the last saved/initial state
  // to avoid unnecessary saves on mount
  const isFirstRender = useRef(true)

  const upsertMutation = useUpsertAttendance()

  // Update local state when initialAttendance changes (e.g. month change or refresh)
  // We only update if the user isn't actively interacting?
  // For simplicity, we sync, assuming user stops typing for the debounce period.
  useEffect(() => {
    setTotal(initialAttendance?.total_meetings || 0)
    setAttended(initialAttendance?.attended_meetings || 0)
  }, [initialAttendance])

  // Calculate percentage
  const percentage = total > 0 ? (attended / total) * 100 : 0

  // Determine color
  let indicatorColor = "bg-red-500" // < 50%
  if (percentage >= 80) indicatorColor = "bg-green-500"
  else if (percentage >= 50) indicatorColor = "bg-yellow-500"

  // Validation
  useEffect(() => {
    if (attended > total && total > 0) {
      setHasError(true)
    } else {
      setHasError(false)
    }
  }, [total, attended])

  const saveData = useCallback(
    (newTotal: number, newAttended: number) => {
      if (newAttended > newTotal && newTotal > 0) {
         toast.error(`Cannot save: Attended (${newAttended}) > Total (${newTotal})`)
         return
      }

      setIsSaving(true)
      upsertMutation.mutate(
        {
          student_id: student.id,
          program_id: programId,
          month,
          year,
          total_meetings: newTotal,
          attended_meetings: newAttended
        },
        {
          onSuccess: () => {
            setIsSaving(false)
            // toast.success("Saved") // Optional: too noisy for auto-save
          },
          onError: (error) => {
            setIsSaving(false)
            toast.error("Failed to save attendance")
            console.error(error)
          }
        }
      )
    },
    [programId, month, year, student.id, upsertMutation]
  )

  // Debounce Logic
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    // Don't save if values match props (no change)
    if (
      total === (initialAttendance?.total_meetings || 0) &&
      attended === (initialAttendance?.attended_meetings || 0)
    ) {
      return
    }

    const handler = setTimeout(() => {
      saveData(total, attended)
    }, 800) // 800ms debounce

    return () => {
      clearTimeout(handler)
    }
  }, [total, attended, saveData, initialAttendance])

  return (
    <TableRow>
      <TableCell className="font-medium">
        {student.name}
        {student.status !== 'active' && <span className="text-xs text-muted-foreground ml-2">({student.status})</span>}
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
          onChange={(e) => setAttended(parseInt(e.target.value) || 0)}
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
