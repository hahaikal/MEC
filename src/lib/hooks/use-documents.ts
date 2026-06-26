import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { getPublicPreschoolMagazines, getPublicClassDocuments } from '@/actions/parent-hub-public'

export function useClassDocuments(classId?: string, documentType?: string) {
  return useQuery({
    queryKey: ['class-documents', classId, documentType],
    queryFn: async () => getPublicClassDocuments(classId, documentType),
    enabled: !!classId
  })
}

export function usePreschoolMagazines() {
  return useQuery({
    queryKey: ['preschool-magazines'],
    queryFn: async () => getPublicPreschoolMagazines()
  })
}
