import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { AttendanceSummary, UpsertAttendanceParams } from '@/types/attendance'

export function useAttendanceBySemester(className: string | null, semester: number, year: number) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['attendance', className, semester, year],
    queryFn: async () => {
      if (!className) return []

      const { data, error } = await supabase
        .from('attendance_summaries')
        .select('*')
        .eq('class_name', className)
        .eq('semester', semester)
        .eq('year', year)

      if (error) throw error
      return data as AttendanceSummary[]
    },
    enabled: !!className,
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
