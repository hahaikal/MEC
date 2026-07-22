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
      
      const { data: classesData, error: err1 } = await supabase
        .from('class_activities')
        .select('*, classes!inner(program_id)')
        .eq('classes.program_id', programId)

      if (err1) throw err1

      const { data: galleryData, error: err2 } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('category', programId)
        .eq('is_active', true)

      if (err2) throw err2

      const combined = [
        ...(classesData ?? []),
        ...(galleryData ?? [])
      ]

      return combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    },
    enabled: !!programId
  })
}

export function useAllClassActivities(limit: number = 6) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['all-class-activities', limit],
    queryFn: async () => {
      const { data: classesData, error: err1 } = await supabase
        .from('class_activities')
        .select('*, classes(name, programs(name))')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (err1) throw err1

      const { data: galleryData, error: err2 } = await supabase
        .from('gallery_items')
        .select('*')
        .neq('category', 'event')
        .neq('category', 'general')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (err2) throw err2

      // Fetch programs to map category IDs to names
      const { data: programs } = await supabase.from('programs').select('id, name')
      const programMap = new Map(programs?.map(p => [p.id, p.name]) || [])

      const galleryWithClasses = (galleryData ?? []).map(g => {
        const programName = programMap.get(g.category)
        return {
          ...g,
          classes: programName ? { name: '', programs: { name: programName } } : undefined
        }
      })

      const combined = [
        ...(classesData ?? []),
        ...galleryWithClasses
      ]

      return combined
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit)
    },
  })
}
