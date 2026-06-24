import { useQuery } from '@tanstack/react-query'
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
          users:teacher_id (id, full_name),
          programs:program_id (id, name),
          class_enrollments(count)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data.map((c: any) => ({
        ...c,
        teacher_name: c.users?.full_name || null,
        enrolled_count: c.class_enrollments[0]?.count || 0
      }))
    },
  })
}

export function useActiveClasses() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['classes', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          users:teacher_id (id, full_name, role, profile_picture_url, bio)
        `)
        .eq('is_active', true)
        .order('name', { ascending: true })

      if (error) throw error
      return data || []
    },
  })
}

export function useClass(id: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['classes', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          users:teacher_id (id, full_name, role, profile_picture_url, bio)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}
