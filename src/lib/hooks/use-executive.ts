import { useQuery } from '@tanstack/react-query'
import { getExecutiveStats } from '@/actions/executive'

export function useExecutiveStats() {
  return useQuery({
    queryKey: ['executive-stats'],
    queryFn: async () => {
      return await getExecutiveStats()
    }
  })
}
