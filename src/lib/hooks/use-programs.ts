import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'

type Program = Database['public']['Tables']['programs']['Row']

export function useActivePrograms() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['programs', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      return data as Program[]
    },
  })
}
