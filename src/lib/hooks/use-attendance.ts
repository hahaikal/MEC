import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { AttendanceSummary, UpsertAttendanceParams } from '@/types/attendance'

export function useAttendanceBySemester(classId: string | null, semester: number, year: number) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['attendance', classId, semester, year],
    queryFn: async () => {
      if (!classId) return []

      const startDate = semester === 1 ? `${year}-01-01` : `${year}-07-01`
      const endDate = semester === 1 ? `${year}-06-30` : `${year}-12-31`

      const { data, error } = await supabase
        .from('attendance_logs')
        .select('student_id, status')
        .eq('class_id', classId)
        .gte('date', startDate)
        .lte('date', endDate)

      if (error) throw error

      const summaries: Record<string, AttendanceSummary> = {}
      
      data.forEach(log => {
        if (log.status === 'HOLIDAY') return;

        if (!summaries[log.student_id]) {
          summaries[log.student_id] = {
            student_id: log.student_id,
            total_meetings: 0,
            sick: 0,
            leave: 0,
            alpha: 0,
          } as any
        }
        
        summaries[log.student_id].total_meetings++
        
        if (log.status === 'SICK') summaries[log.student_id].sick++
        else if (log.status === 'LEAVE') summaries[log.student_id].leave++
        else if (log.status === 'ALPHA') summaries[log.student_id].alpha++
      })

      return Object.values(summaries)
    },
    enabled: !!classId,
  })
}

export function useAttendanceByYear(className: string | null, year: number) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['attendance', 'year', className, year],
    queryFn: async () => {
      if (!className) return []

      const { data, error } = await supabase
        .from('attendance_summaries')
        .select('*')
        .eq('class_name', className)
        .eq('year', year)

      if (error) throw error
      return data as AttendanceSummary[]
    },
    enabled: !!className,
  })
}

export function useUpsertAttendance() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: UpsertAttendanceParams) => {
      const { data: { user } } = await supabase.auth.getUser()

      const { data, error } = await supabase
        .from('attendance_summaries')
        .upsert(
          {
            student_id: params.student_id,
            class_name: params.class_name,
            semester: params.semester,
            year: params.year,
            total_meetings: params.total_meetings,
            sick: params.sick,
            leave: params.leave,
            alpha: params.alpha,
            created_by: user?.id,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'student_id, class_name, semester, year',
          }
        )
        .select()
        .single()

      if (error) throw error
      return data as AttendanceSummary
    },
    onSuccess: (_, variables) => {
      // Invalidate the query to refresh data
      queryClient.invalidateQueries({
        queryKey: ['attendance', variables.class_name, variables.semester, variables.year],
      })
      // Also invalidate yearly cache if it exists
      queryClient.invalidateQueries({
        queryKey: ['attendance', 'year', variables.class_name, variables.year],
      })
    },
  })
}
