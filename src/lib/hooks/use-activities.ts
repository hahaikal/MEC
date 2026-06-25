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
