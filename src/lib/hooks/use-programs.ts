import { useQuery } from '@tanstack/react-query'
import { getPublicPrograms, getPublicProgramTeachers } from '@/actions/parent-hub-public'

export function usePrograms() {
  return useQuery({
    queryKey: ['programs', 'active'],
    queryFn: async () => getPublicPrograms(),
  })
}

export function useProgramTeachers(programId: string) {
  return useQuery({
    queryKey: ['program-teachers', programId],
    queryFn: async () => getPublicProgramTeachers(programId),
    enabled: !!programId
  })
}
