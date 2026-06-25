import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useClassDocuments(classId?: string, documentType?: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['class-documents', classId, documentType],
    queryFn: async () => {
      if (!classId) return []
      
      let query = supabase
        .from('class_documents')
        .select('*')
        .eq('class_id', classId)
        .order('created_at', { ascending: false })

      if (documentType) {
        query = query.eq('document_type', documentType)
      }

      const { data, error } = await query

      if (error) throw error
      return data ?? []
    },
    enabled: !!classId
  })
}

export function usePreschoolMagazines() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['preschool-magazines'],
    queryFn: async () => {
      const { data: classes, error: classErr } = await supabase
        .from('classes')
        .select('id, name')

      if (!classes || classes.length === 0) return []
      
      const preschoolClassIds = classes
        .filter(c => c.name.toLowerCase().includes('preschool') || c.name.toLowerCase().includes('pre-school') || c.name.toLowerCase().includes('kindergarten'))
        .map(c => c.id)

      if (preschoolClassIds.length === 0) return []

      const { data, error } = await supabase
        .from('class_documents')
        .select('*, classes(name)')
        .eq('document_type', 'MAGAZINE')
        .in('class_id', preschoolClassIds)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data ?? []
    }
  })
}
