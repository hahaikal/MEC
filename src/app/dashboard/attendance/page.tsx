'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useClassList, useStudentsByClass } from '@/lib/hooks/use-students-by-class'
import { useAttendanceByMonth } from '@/lib/hooks/use-attendance'
import { AttendanceRow } from './_components/attendance-row'
import { Loader2 } from 'lucide-react'

export default function AttendancePage() {
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [selectedClass, setSelectedClass] = useState<string>('')

  // Fetch Classes
  const { data: classes, isLoading: isLoadingClasses } = useClassList()

  // Derived state for queries
  const monthInt = selectedMonth ? parseInt(selectedMonth) : 0
  const yearInt = selectedYear ? parseInt(selectedYear) : 0

  const isFilterComplete = !!(selectedClass && monthInt && yearInt)

  // Fetch Data (only if filters complete)
  const {
    data: students,
    isLoading: isLoadingStudents
  } = useStudentsByClass(isFilterComplete ? selectedClass : null)

  const {
    data: attendanceRecords,
    isLoading: isLoadingAttendance
  } = useAttendanceByMonth(
    isFilterComplete ? selectedClass : null,
    monthInt,
    yearInt
  )

  const isLoadingData = isLoadingStudents || isLoadingAttendance

  // Generate Year Options (Current Year - 2 to + 2)
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>

      <Card>
        <CardHeader>
          <CardTitle>Filter Attendance</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          {/* Month Select */}
          <div className="w-full md:w-1/4">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year Select */}
          <div className="w-full md:w-1/4">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Class Select */}
          <div className="w-full md:w-1/2">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingClasses ? (
                  <div className="p-2 text-center text-sm text-muted-foreground">Loading...</div>
                ) : (
                  classes?.map((className) => (
                    <SelectItem key={className} value={className}>
                      {className}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Table Area */}
      {isFilterComplete ? (
        <Card>
          <CardContent className="p-0">
            {isLoadingData ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : !students || students.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                No active students found in this class.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Total Meetings</TableHead>
                    <TableHead>Attended</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => {
                    // Find existing attendance record
                    const record = attendanceRecords?.find(
                      (r) => r.student_id === student.id
                    )

                    return (
                      <AttendanceRow
                        key={student.id}
                        student={student}
                        className={selectedClass}
                        month={monthInt}
                        year={yearInt}
                        initialAttendance={record}
                      />
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="text-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
          Please select Month, Year, and Class to view attendance.
        </div>
      )}
    </div>
  )
}
