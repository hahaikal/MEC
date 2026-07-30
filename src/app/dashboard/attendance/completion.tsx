'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format, endOfMonth } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'

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

function getWeekdaysInMonth(month: number, year: number, weekdays: number[], upToDate?: number) {
  let count = 0;
  const daysInMonth = new Date(year, month, 0).getDate();
  const limit = upToDate ? Math.min(upToDate, daysInMonth) : daysInMonth;
  for (let i = 1; i <= limit; i++) {
    const d = new Date(year, month - 1, i).getDay();
    if (weekdays.includes(d)) count++;
  }
  return count;
}

export function AttendanceCompletion() {
  const [viewMode, setViewMode] = useLocalStorage<'daily' | 'monthly'>('attendance_completion_mode', 'daily')
  const [selectedDate, setSelectedDate] = useLocalStorage<string>('attendance_completion_date', format(new Date(), 'yyyy-MM-dd'))
  const [selectedMonth, setSelectedMonth] = useLocalStorage<string>('attendance_completion_month', (new Date().getMonth() + 1).toString())
  const [selectedYear, setSelectedYear] = useLocalStorage<string>('attendance_completion_year', new Date().getFullYear().toString())
  
  const supabase = createClient()

  const { data, isLoading } = useQuery({
    queryKey: ['attendance-completion', viewMode, selectedDate, selectedMonth, selectedYear],
    queryFn: async () => {
      // 1. Get all classes and their enrolled students
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('id, name, schedule_days, class_enrollments(students(status))')
        .order('name')

      if (classesError) throw classesError

      // 2. Get attendance logs based on mode
      let logsQuery = supabase.from('attendance_logs').select('class_id, student_id, status, date')
      
      if (viewMode === 'daily') {
        logsQuery = logsQuery.eq('date', selectedDate)
      } else {
        const monthInt = parseInt(selectedMonth)
        const yearInt = parseInt(selectedYear)
        const startDate = `${yearInt}-${monthInt.toString().padStart(2, '0')}-01`
        const endDate = format(endOfMonth(new Date(yearInt, monthInt - 1)), 'yyyy-MM-dd')
        logsQuery = logsQuery.gte('date', startDate).lte('date', endDate)
      }

      let allLogsData: any[] = []
      let from = 0
      const limit = 1000
      let fetchMore = true

      while (fetchMore) {
        const { data, error } = await logsQuery.range(from, from + limit - 1)
        if (error) throw error
        
        if (data && data.length > 0) {
          allLogsData = [...allLogsData, ...data]
        }
        
        if (!data || data.length < limit) {
          fetchMore = false
        } else {
          from += limit
        }
      }

      const logsData = allLogsData

      const dayMap: Record<string, number> = {
        'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
        'Thursday': 4, 'Friday': 5, 'Saturday': 6
      }
      
      // Calculate completion for each class
      const completionData = classesData
        .filter((cls) => {
           if (!cls.schedule_days || cls.schedule_days.length === 0) return false;
           
           if (viewMode === 'daily') {
             const selectedDayOfWeek = new Date(selectedDate).getDay()
             const allowedDays = (cls.schedule_days as string[]).map(d => dayMap[d])
             return allowedDays.includes(selectedDayOfWeek)
           }
           
           return true; // For monthly, include all classes that have a schedule
        })
        .map((cls) => {
          const activeStudents = cls.class_enrollments?.filter((e: any) => 
            e.students && (e.students.status === 'ACTIVE' || e.students.status === 'active')
          ).length || 0

          const logsForClass = logsData.filter((log) => log.class_id === cls.id)
          
          let expectedLogs = 0;
          let filledLogs = 0;
          
          if (viewMode === 'daily') {
             expectedLogs = activeStudents;
             filledLogs = logsForClass.length;
          } else {
             const allowedDays = (cls.schedule_days as string[]).map(d => dayMap[d])
             let upToDate = undefined;
             const now = new Date();
             if (now.getMonth() + 1 === parseInt(selectedMonth) && now.getFullYear() === parseInt(selectedYear)) {
               upToDate = now.getDate();
             } else if (new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1, 1) > now) {
               upToDate = 0;
             }
             const sessionsInMonth = upToDate === 0 ? 0 : getWeekdaysInMonth(parseInt(selectedMonth), parseInt(selectedYear), allowedDays, upToDate)
             expectedLogs = sessionsInMonth;
             
             // For monthly view, filled is the number of distinct days attendance was taken
             const uniqueDates = new Set(logsForClass.map(log => log.date).filter(Boolean));
             filledLogs = uniqueDates.size;
          }
          
          let percentage = 0
          if (expectedLogs > 0) {
            percentage = Math.round((filledLogs / expectedLogs) * 100)
          } else {
            percentage = 100 // If no expected logs (e.g. 0 active students), consider 100% complete
          }
          
          if (percentage > 100) percentage = 100

          return {
            id: cls.id,
            name: cls.name,
            expected: expectedLogs,
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
        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="w-full md:w-[200px]">
            <Select value={viewMode} onValueChange={(v: 'daily' | 'monthly') => setViewMode(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Mode Tampilan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Harian</SelectItem>
                <SelectItem value="monthly">Bulanan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {viewMode === 'daily' ? (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Tanggal:</label>
              <Input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)} 
                className="w-[200px]"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 w-full md:w-auto">
              <label className="text-sm font-medium mr-2">Bulan:</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Pilih Bulan" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map(m => (
                    <SelectItem key={m.value} value={m.value.toString()}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Tahun" />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2].map(offset => {
                    const y = new Date().getFullYear() - offset
                    return <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                  })}
                </SelectContent>
              </Select>
            </div>
          )}
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
                    {cls.filled} / {cls.expected} ({cls.percentage}%)
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
            Tidak ada kelas yang dijadwalkan pada waktu tersebut.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
