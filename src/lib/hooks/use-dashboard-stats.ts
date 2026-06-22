import { useQuery } from '@tanstack/react-query'
import { getDashboardStats } from '@/actions/dashboard'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => getDashboardStats(),
  })
}
