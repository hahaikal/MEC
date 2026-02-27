'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Student, AttendanceSummary } from '@/types/attendance'
import { cn } from '@/lib/utils'

interface AttendanceYearViewProps {
  students: Student[]
  attendanceRecords: AttendanceSummary[] | undefined
  year: number
}

export function AttendanceYearView({ students, attendanceRecords, year }: AttendanceYearViewProps) {

  // Helper to calculate percentage
  const getPercentage = (studentId: string, month: number) => {
    const record = attendanceRecords?.find(
      (r) => r.student_id === studentId && r.month === month && r.year === year
    )

    if (!record || record.total_meetings === 0) return '-'

    const pct = (record.attended_meetings / record.total_meetings) * 100
    return `${pct.toFixed(0)}%`
  }

  // Helper to calculate Semester Percentage
  const getSemesterPercentage = (studentId: string, startMonth: number, endMonth: number) => {
    const records = attendanceRecords?.filter(
      (r) => r.student_id === studentId && r.year === year && r.month >= startMonth && r.month <= endMonth
    ) || []

    let totalAttended = 0
    let totalMeetings = 0

    records.forEach(r => {
      totalAttended += r.attended_meetings
      totalMeetings += r.total_meetings
    })

    if (totalMeetings === 0) return '-'

    const pct = (totalAttended / totalMeetings) * 100
    return `${pct.toFixed(0)}%`
  }

  const getIndicatorColor = (pctString: string) => {
    if (pctString === '-') return ""
    const pct = parseInt(pctString)
    if (pct >= 80) return "text-green-600 font-medium"
    if (pct >= 50) return "text-yellow-600 font-medium"
    return "text-red-600 font-medium"
  }

  return (
    // Added relative wrapper to constrain the overflow-x-auto area properly within the card
    <div className="relative w-full overflow-hidden rounded-md border">
        <div className="overflow-x-auto w-full">
          <Table className="min-w-[1200px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] sticky left-0 bg-background z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Student Name</TableHead>
                {/* Semester 1 */}
                <TableHead className="text-center w-16">Jan</TableHead>
                <TableHead className="text-center w-16">Feb</TableHead>
                <TableHead className="text-center w-16">Mar</TableHead>
                <TableHead className="text-center w-16">Apr</TableHead>
                <TableHead className="text-center w-16">May</TableHead>
                <TableHead className="text-center w-16">Jun</TableHead>
                <TableHead className="text-center w-20 font-bold bg-slate-50 border-x">Sem 1</TableHead>

                {/* Semester 2 */}
                <TableHead className="text-center w-16">Jul</TableHead>
                <TableHead className="text-center w-16">Aug</TableHead>
                <TableHead className="text-center w-16">Sep</TableHead>
                <TableHead className="text-center w-16">Oct</TableHead>
                <TableHead className="text-center w-16">Nov</TableHead>
                <TableHead className="text-center w-16">Dec</TableHead>
                <TableHead className="text-center w-20 font-bold bg-slate-50 border-l">Sem 2</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => {
                const sem1Pct = getSemesterPercentage(student.id, 1, 6)
                const sem2Pct = getSemesterPercentage(student.id, 7, 12)

                return (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium sticky left-0 bg-background z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      {student.name}
                      {student.status?.toUpperCase() !== 'ACTIVE' && <span className="text-xs text-muted-foreground ml-1">({student.status})</span>}
                    </TableCell>

                    {/* Semester 1 */}
                    {[1, 2, 3, 4, 5, 6].map(m => {
                        const pct = getPercentage(student.id, m)
                        return (
                            <TableCell key={m} className={cn("text-center", getIndicatorColor(pct))}>
                                {pct}
                            </TableCell>
                        )
                    })}
                    <TableCell className={cn("text-center font-bold bg-slate-50 border-x", getIndicatorColor(sem1Pct))}>
                        {sem1Pct}
                    </TableCell>

                    {/* Semester 2 */}
                    {[7, 8, 9, 10, 11, 12].map(m => {
                        const pct = getPercentage(student.id, m)
                        return (
                            <TableCell key={m} className={cn("text-center", getIndicatorColor(pct))}>
                                {pct}
                            </TableCell>
                        )
                    })}
                    <TableCell className={cn("text-center font-bold bg-slate-50 border-l", getIndicatorColor(sem2Pct))}>
                        {sem2Pct}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
    </div>
  )
}
