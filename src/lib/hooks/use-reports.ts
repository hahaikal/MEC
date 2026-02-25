import { useQuery } from '@tanstack/react-query';
import { getReportsData } from '@/actions/reports';

export function useReports(year: number = new Date().getFullYear()) {
  return useQuery({
    queryKey: ['reports', year],
    queryFn: async () => {
      const data = await getReportsData(year);
      return data;
    },
    // Optional: Add staletime or keep default
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
