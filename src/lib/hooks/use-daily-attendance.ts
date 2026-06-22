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

export function useMonthlyAttendance(classId: string | null, month: number, year: number) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['attendance', 'monthly', classId, month, year],
    queryFn: async () => {
      if (!classId) return []

      const d1 = new Date(year, month - 1, 1)
      const d2 = new Date(year, month, 0)
      const startOfMonth = `${d1.getFullYear()}-${String(d1.getMonth() + 1).padStart(2, '0')}-${String(d1.getDate()).padStart(2, '0')}`
      const endOfMonth = `${d2.getFullYear()}-${String(d2.getMonth() + 1).padStart(2, '0')}-${String(d2.getDate()).padStart(2, '0')}`

      const { data, error } = await supabase
        .from('attendance_logs')
        .select('*')
        .eq('class_id', classId)
        .gte('date', startOfMonth)
        .lte('date', endOfMonth)

      if (error) throw error
      return data
    },
    enabled: !!classId && !!month && !!year,
  })
}

export function useMarkHolidayForClass() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: { class_id: string, date: string, student_ids: string[] }) => {
      const { data: { user } } = await supabase.auth.getUser()

      // Fetch existing
      const { data: existing } = await supabase
        .from('attendance_logs')
        .select('id, student_id')
        .eq('class_id', params.class_id)
        .eq('date', params.date)

      const existingMap = new Map(existing?.map(e => [e.student_id, e.id]) || [])
      const upserts = []
      
      for (const studentId of params.student_ids) {
        if (existingMap.has(studentId)) {
           await supabase.from('attendance_logs').update({ status: 'HOLIDAY', updated_at: new Date().toISOString() }).eq('id', existingMap.get(studentId))
        } else {
           await supabase.from('attendance_logs').insert({
             class_id: params.class_id,
             student_id: studentId,
             date: params.date,
             status: 'HOLIDAY',
             created_by: user?.id,
           })
        }
      }
      return true
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['attendance'],
      })
    },
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
        queryKey: ['attendance'],
      })
    },
  })
}
