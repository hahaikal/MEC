import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function usePrograms() {
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
      return data || []
    },
  })
}

export function useProgramTeachers(programId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['program-teachers', programId],
    queryFn: async () => {
      if (!programId) return []

      const { data: classes, error: classError } = await supabase
        .from('classes')
        .select('id')
        .eq('program_id', programId)
        
      if (classError || !classes.length) return []
      
      const classIds = classes.map(c => c.id)

      const { data: classTeachers, error: ctError } = await supabase
        .from('class_teachers')
        .select('users(id, full_name, roles, profile_picture_url, bio)')
        .in('class_id', classIds)
        
      if (ctError || !classTeachers) return []

      const uniqueTeachers = new Map()
      classTeachers.forEach((ct: any) => {
        if (ct.users && !uniqueTeachers.has(ct.users.id)) {
          uniqueTeachers.set(ct.users.id, {
            id: ct.users.id,
            name: ct.users.full_name || 'Teacher',
            role: ct.users.roles?.[0] || 'Teacher',
            image: ct.users.profile_picture_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
            bio: ct.users.bio || ''
          })
        }
      })

      return Array.from(uniqueTeachers.values())
    },
    enabled: !!programId
  })
}
