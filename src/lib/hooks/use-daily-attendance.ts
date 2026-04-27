import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useDailyAttendance(classId: string | null, date: string | null) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['attendance', 'daily', classId, date],
    queryFn: async () => {
      if (!classId || !date) return []

      const { data, error } = await supabase
        .from('attendance_logs')
        .select('*')
        .eq('class_id', classId)
        .eq('date', date)

      if (error) throw error
      return data
    },
    enabled: !!classId && !!date,
  })
}

export function useUpsertDailyAttendance() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: { class_id: string, date: string, student_id: string, status: string }) => {
      const { data: { user } } = await supabase.auth.getUser()

      // Ensure class enrollment logic respects RLS by not failing entirely if it can't update.
      // But typically, a teacher can insert/update logs for their class.

      // Upsert isn't directly available safely here since id is generated and we don't know it unless we query.
      // A better way is checking if exists, then update or insert.

      const { data: existing } = await supabase
        .from('attendance_logs')
        .select('id')
        .eq('class_id', params.class_id)
        .eq('date', params.date)
        .eq('student_id', params.student_id)
        .single()

      if (existing) {
        const { data, error } = await supabase
          .from('attendance_logs')
          .update({
            status: params.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single()
        if (error) throw error
        return data
      } else {
        const { data, error } = await supabase
          .from('attendance_logs')
          .insert({
            class_id: params.class_id,
            student_id: params.student_id,
            date: params.date,
            status: params.status,
            created_by: user?.id,
          })
          .select()
          .single()
        if (error) throw error
        return data
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['attendance', 'daily', variables.class_id, variables.date],
      })
    },
  })
}
