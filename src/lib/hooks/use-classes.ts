import { useQuery } from '@tanstack/react-query'
import { getPublicActiveClasses, getPublicClass } from '@/actions/parent-hub-public'
import { createClient } from '@/lib/supabase/client'

export function useClasses() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          class_teachers ( users (id, full_name) ),
          programs:program_id (id, name),
          class_enrollments(count)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data.map((c: any) => ({
        ...c,
        teachers: c.class_teachers?.map((ct: any) => ct.users) || [],
        enrolled_count: c.class_enrollments[0]?.count || 0
      }))
    },
  })
}

export function useActiveClasses() {
  return useQuery({
    queryKey: ['classes', 'active'],
    queryFn: async () => getPublicActiveClasses(),
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

export function useClass(id: string) {
  return useQuery({
    queryKey: ['classes', id],
    queryFn: async () => getPublicClass(id),
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled: !!id,
  })
}
