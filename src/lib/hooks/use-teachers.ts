import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useTeachers() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'teacher')
        .order('full_name')

      if (error) throw error
      return data
    },
  })
}
