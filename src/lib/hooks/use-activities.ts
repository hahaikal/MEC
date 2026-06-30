import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useClassActivities(classId?: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['class-activities', classId],
    queryFn: async () => {
      if (!classId) return []
      
      const { data, error } = await supabase
        .from('class_activities')
        .select('*')
        .eq('class_id', classId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data ?? []
    },
    enabled: !!classId
  })
}

export function useProgramActivities(programId?: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['program-activities', programId],
    queryFn: async () => {
      if (!programId) return []
      
      const { data, error } = await supabase
        .from('class_activities')
        .select('*, classes!inner(program_id)')
        .eq('classes.program_id', programId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data ?? []
    },
    enabled: !!programId
  })
}

export function useAllClassActivities(limit: number = 6) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['all-class-activities', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('class_activities')
        .select('*, classes(name, programs(name))')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data ?? []
    },
  })
}
