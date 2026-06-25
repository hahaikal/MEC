'use client'

import { Student, AttendanceSummary } from '@/types/attendance'
import { Progress } from '@/components/ui/progress'
import { TableCell, TableRow } from '@/components/ui/table'

interface AttendanceRowProps {
  student: Student
  className: string
  semester: number
  year: number
  initialAttendance?: AttendanceSummary | null
}

export function AttendanceRow({
  student,
  initialAttendance
}: AttendanceRowProps) {
  const total = initialAttendance?.total_meetings || 0
  const sick = initialAttendance?.sick || 0
  const leave = initialAttendance?.leave || 0
  const alpha = initialAttendance?.alpha || 0
  
  const attended = Math.max(0, total - sick - leave - alpha)
  const percentage = total > 0 ? (attended / total) * 100 : 0

  let indicatorColor = "bg-red-500" // < 50%
  if (percentage >= 80) indicatorColor = "bg-green-500"
  else if (percentage >= 50) indicatorColor = "bg-yellow-500"

  return (
    <TableRow>
      <TableCell className="font-medium">
        {student.name}
        {student.status?.toUpperCase() !== 'ACTIVE' && <span className="text-xs text-muted-foreground ml-2">({student.status})</span>}
      </TableCell>
      <TableCell className="text-center font-medium">
        {total}
      </TableCell>
      <TableCell className="text-center">
        {sick}
      </TableCell>
      <TableCell className="text-center">
        {leave}
      </TableCell>
      <TableCell className="text-center">
        {alpha}
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
        {total === 0 ? <span className="text-xs text-muted-foreground">No Data</span> : <span className="text-xs text-green-600">Synced</span>}
      </TableCell>
    </TableRow>
  )
}
