import { useQuery } from '@tanstack/react-query'
import { getPublicActiveClasses, getPublicClass } from '@/actions/parent-hub-public'
import { getClasses } from '@/actions/classes'
import { createClient } from '@/lib/supabase/client'

export function useClasses() {
  return useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      return await getClasses()
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

import { getPublicPreschoolClasses } from '@/actions/parent-hub-public'

export function usePreschoolClasses() {
  return useQuery({
    queryKey: ['preschool-classes'],
    queryFn: async () => getPublicPreschoolClasses(),
  })
}
