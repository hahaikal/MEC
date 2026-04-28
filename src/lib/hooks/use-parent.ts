import { useQuery } from '@tanstack/react-query'
import { getParentStats } from '@/actions/parent'

export function useParentStats() {
  return useQuery({
    queryKey: ['parent-stats'],
    queryFn: async () => {
      return await getParentStats()
    }
  })
}
