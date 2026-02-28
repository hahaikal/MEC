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
import { useAttendanceBySemester } from '@/lib/hooks/use-attendance'
import { AttendanceRow } from './_components/attendance-row'
import { Loader2 } from 'lucide-react'

export default function AttendancePage() {
  const [selectedSemester, setSelectedSemester] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [selectedClass, setSelectedClass] = useState<string>('')

  // Fetch Classes
  const { data: classes, isLoading: isLoadingClasses } = useClassList()

  // Derived state for queries
  const semesterInt = selectedSemester ? parseInt(selectedSemester) : 0
  const yearInt = selectedYear ? parseInt(selectedYear) : 0

  const isFilterComplete = !!(selectedClass && yearInt && semesterInt)

  // Fetch Data (only if filters complete)
  const {
    data: students,
    isLoading: isLoadingStudents
  } = useStudentsByClass(selectedClass || null)

  const {
    data: attendanceRecordsSemester,
    isLoading: isLoadingAttendanceSemester
  } = useAttendanceBySemester(
    isFilterComplete ? selectedClass : null,
    semesterInt,
    yearInt
  )

  const isLoadingData = isLoadingAttendanceSemester || isLoadingStudents

  // Generate Year Options (Current Year - 2 to + 2)
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Attendance</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col gap-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                  {/* Year Select - Always needed */}
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

                  {/* Semester Select */}
                  <div className="w-full md:w-1/4">
                    <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Semester 1 (Jan - Jun)</SelectItem>
                        <SelectItem value="2">Semester 2 (Jul - Des)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Class Select - Always needed */}
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
              </div>
            </div>
            
            <div className="mt-4">
                {/* Validation Message */}
                {!isFilterComplete ? (
                  <div className="text-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
                    Please select Year, Semester, and Class to view attendance.
                  </div>
                ) : isLoadingData ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : !students || students.length === 0 ? (
                  <div className="text-center p-8 text-muted-foreground">
                    No active students found in this class.
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Student Name</TableHead>
                              <TableHead className="w-24">Total</TableHead>
                              <TableHead className="w-24">Sakit</TableHead>
                              <TableHead className="w-24">Izin</TableHead>
                              <TableHead className="w-24">Alpha</TableHead>
                              <TableHead className="text-right">Hadir</TableHead>
                              <TableHead className="text-right">%</TableHead>
                              <TableHead className="text-center">Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {students.map((student) => {
                              // Find existing attendance record
                              const record = attendanceRecordsSemester?.find(
                                (r) => r.student_id === student.id
                              )

                              return (
                                <AttendanceRow
                                  key={student.id}
                                  student={student}
                                  className={selectedClass}
                                  semester={semesterInt}
                                  year={yearInt}
                                  initialAttendance={record}
                                />
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
