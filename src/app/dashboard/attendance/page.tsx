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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useClassList, useStudentsByClass } from '@/lib/hooks/use-students-by-class'
import { useAttendanceByMonth, useAttendanceByYear } from '@/lib/hooks/use-attendance'
import { AttendanceRow } from './_components/attendance-row'
import { AttendanceYearView } from './_components/attendance-year-view'
import { Loader2 } from 'lucide-react'

export default function AttendancePage() {
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [activeTab, setActiveTab] = useState("monthly")

  // Fetch Classes
  const { data: classes, isLoading: isLoadingClasses } = useClassList()

  // Derived state for queries
  const monthInt = selectedMonth ? parseInt(selectedMonth) : 0
  const yearInt = selectedYear ? parseInt(selectedYear) : 0

  const isFilterComplete = !!(selectedClass && yearInt && (activeTab === 'yearly' || monthInt))

  // Fetch Data (only if filters complete)
  const {
    data: students,
    isLoading: isLoadingStudents
  } = useStudentsByClass(selectedClass || null)

  const {
    data: attendanceRecordsMonth,
    isLoading: isLoadingAttendanceMonth
  } = useAttendanceByMonth(
    activeTab === 'monthly' && isFilterComplete ? selectedClass : null,
    monthInt,
    yearInt
  )

  const {
    data: attendanceRecordsYear,
    isLoading: isLoadingAttendanceYear
  } = useAttendanceByYear(
    activeTab === 'yearly' && isFilterComplete ? selectedClass : null,
    yearInt
  )

  const isLoadingData = (activeTab === 'monthly' ? isLoadingAttendanceMonth : isLoadingAttendanceYear) || isLoadingStudents

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

                  {/* Month Select - Only for Monthly Tab */}
                  {activeTab === 'monthly' && (
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
                  )}

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

            <Tabs defaultValue="monthly" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly">Monthly Entry</TabsTrigger>
                <TabsTrigger value="yearly">Yearly Overview</TabsTrigger>
              </TabsList>

              <div className="mt-4">
                  {/* Validation Message */}
                  {!isFilterComplete ? (
                    <div className="text-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
                      Please select {activeTab === 'monthly' ? 'Year, Month,' : 'Year'} and Class to view attendance.
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
                    <>
                      <TabsContent value="monthly" className="m-0">
                          <Card>
                            <CardContent className="p-0">
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
                                      const record = attendanceRecordsMonth?.find(
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
                            </CardContent>
                          </Card>
                      </TabsContent>

                      <TabsContent value="yearly" className="m-0">
                        <AttendanceYearView
                            students={students}
                            attendanceRecords={attendanceRecordsYear}
                            year={yearInt}
                        />
                      </TabsContent>
                    </>
                  )}
              </div>
            </Tabs>

        </CardContent>
      </Card>
    </div>
  )
}
