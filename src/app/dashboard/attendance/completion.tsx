'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export function AttendanceCompletion() {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const supabase = createClient()

  const { data, isLoading } = useQuery({
    queryKey: ['attendance-completion', selectedDate],
    queryFn: async () => {
      // 1. Get all classes and their enrolled students
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('id, name, schedule_days, class_enrollments(students(status))')
        .order('name')

      if (classesError) throw classesError

      // 2. Get all attendance logs for the selected date
      const { data: logsData, error: logsError } = await supabase
        .from('attendance_logs')
        .select('class_id, student_id, status')
        .eq('date', selectedDate)

      if (logsError) throw logsError

      const dayMap: Record<string, number> = {
        'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
        'Thursday': 4, 'Friday': 5, 'Saturday': 6
      }
      const selectedDayOfWeek = new Date(selectedDate).getDay()

      // Calculate completion for each class
      const completionData = classesData
        .filter((cls) => {
           // Only include classes that meet on the selected date's day of week
           if (!cls.schedule_days || cls.schedule_days.length === 0) return false;
           const allowedDays = (cls.schedule_days as string[]).map(d => dayMap[d])
           return allowedDays.includes(selectedDayOfWeek)
        })
        .map((cls) => {
          const activeStudents = cls.class_enrollments?.filter((e: any) => 
            e.students && (e.students.status === 'ACTIVE' || e.students.status === 'active')
          ).length || 0

          const logsForClass = logsData.filter((log) => log.class_id === cls.id)
          const filledLogs = logsForClass.length
          
          let percentage = 0
          if (activeStudents > 0) {
            percentage = Math.round((filledLogs / activeStudents) * 100)
          } else {
            percentage = 100 // If no active students, consider it 100% complete so it doesn't look like 0%
          }
          
          if (percentage > 100) percentage = 100

          return {
            id: cls.id,
            name: cls.name,
            enrolled: activeStudents,
            filled: filledLogs,
            percentage
          }
        })

      // Sort by percentage descending, then by name
      return completionData.sort((a, b) => b.percentage - a.percentage || a.name.localeCompare(b.name))
    }
  })

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Status Pengisian Absensi Kelas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center gap-4">
          <label className="text-sm font-medium">Tanggal:</label>
          <Input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)} 
            className="w-[200px]"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
             <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : data && data.length > 0 ? (
          <div className="space-y-6">
            {data.map((cls) => (
              <div key={cls.id} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">{cls.name}</span>
                  <span className="text-muted-foreground">
                    {cls.filled} / {cls.enrolled} ({cls.percentage}%)
                  </span>
                </div>
                <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
                      cls.percentage === 100 
                        ? 'bg-green-500' 
                        : cls.percentage >= 50 
                          ? 'bg-yellow-500' 
                          : cls.percentage > 0 
                            ? 'bg-orange-500' 
                            : 'bg-red-500'
                    }`}
                    style={{ width: `${cls.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 text-muted-foreground border rounded-lg">
            Tidak ada data kelas.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
