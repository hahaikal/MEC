'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useClassList } from '@/lib/hooks/use-students-by-class'
import { AttendanceMatrix } from '@/components/attendance/attendance-matrix'

const MONTHS = [
  { value: 1, label: 'Januari' },
  { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mei' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Desember' }
]

export default function DailyAttendancePage() {
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString())
  
  const { data: classes, isLoading: isLoadingClasses } = useClassList()
  
  const currentYear = new Date().getFullYear()
  const classData = classes?.find((c: any) => c.id === selectedClass)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Kehadiran Kelas</h1>
      </div>

      <Card className="w-full overflow-hidden">
        <CardHeader>
          <CardTitle>Filter Kelas & Bulan</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="w-full md:w-[400px]">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Kelas" />
                  </SelectTrigger>
                  <SelectContent className="max-w-[400px]">
                    {isLoadingClasses ? (
                      <div className="p-2 text-center text-sm text-muted-foreground">Loading...</div>
                    ) : (
                      classes?.map((c: any) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-1/4">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Bulan" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map(m => (
                      <SelectItem key={m.value} value={m.value.toString()}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4">
                {!selectedClass ? (
                  <div className="text-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
                    Silakan pilih kelas dan bulan untuk menginput kehadiran.
                  </div>
                ) : (
                  <AttendanceMatrix 
                    classData={classData} 
                    month={parseInt(selectedMonth)} 
                    year={currentYear} 
                  />
                )}
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
