import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { getPublicPreschoolTeachers } from '@/actions/parent-hub-public'

export function useTeachers() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .contains('roles', ['Teacher'])
        .order('full_name')

      if (error) throw error
      return data
    },
  })
}

export function usePreschoolTeachers() {
  return useQuery({
    queryKey: ['preschool-teachers'],
    queryFn: async () => getPublicPreschoolTeachers(),
  })
}
