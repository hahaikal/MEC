import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { AttendanceSummary, UpsertAttendanceParams } from '@/types/attendance'

export function useAttendanceByMonth(className: string | null, month: number, year: number) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['attendance', className, month, year],
    queryFn: async () => {
      if (!className) return []

      const { data, error } = await supabase
        .from('attendance_summaries')
        .select('*')
        .eq('class_name', className)
        .eq('month', month)
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
            month: params.month,
            year: params.year,
            total_meetings: params.total_meetings,
            attended_meetings: params.attended_meetings,
            created_by: user?.id,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'student_id, class_name, month, year',
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
        queryKey: ['attendance', variables.class_name, variables.month, variables.year],
      })
    },
  })
}
