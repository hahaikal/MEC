import { useQuery } from '@tanstack/react-query'
import { getPublicPrograms, getPublicProgramTeachers } from '@/actions/parent-hub-public'

export function usePrograms() {
  return useQuery({
    queryKey: ['programs', 'active'],
    queryFn: async () => getPublicPrograms(),
    staleTime: 1000 * 60 * 60, // 1 hour for public programs (rarely change)
  })
}

export function useProgramTeachers(programId: string) {
  return useQuery({
    queryKey: ['program-teachers', programId],
    queryFn: async () => getPublicProgramTeachers(programId),
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled: !!programId
  })
}
