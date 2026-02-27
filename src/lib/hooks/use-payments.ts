import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client'; // FIX: Import createClient, bukan supabase
import { toast } from 'sonner';

// Define types locally if not yet available in global types
interface PaymentFilter {
  startDate?: string;
  endDate?: string;
  studentId?: string;
  page?: number;
  pageSize?: number;
}

export function usePayments(filters?: PaymentFilter) {
  // FIX: Inisialisasi client di dalam hook
  const supabase = createClient();

  return useQuery({
    // Cache key now includes filters to trigger refetch when date changes
    queryKey: ['payments', filters],
    queryFn: async () => {
      let query = supabase
        .from('payments')
        .select(`
          *,
          students (
            id,
            name,
            email
          ),
          programs (
            name
          )
        `, { count: 'exact' });

      // Server-side Filtering
      if (filters?.startDate) {
        query = query.gte('payment_date', filters.startDate); // FIX: Gunakan column 'payment_date'
      }
      
      if (filters?.endDate) {
        query = query.lte('payment_date', filters.endDate); // FIX: Gunakan column 'payment_date'
      }

      if (filters?.studentId) {
        query = query.eq('student_id', filters.studentId);
      }

      // Pagination support (optional but recommended for scalability)
      if (filters?.page && filters?.pageSize) {
        const from = (filters.page - 1) * filters.pageSize;
        const to = from + filters.pageSize - 1;
        query = query.range(from, to);
      }

      // Order by latest payment
      query = query.order('payment_date', { ascending: false }); // FIX: Gunakan column 'payment_date'

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching payments:', error);
        throw error;
      }

      return { data, count };
    },
  });
}

export function useStudentPaymentsYearly(studentId: string | undefined, year: number) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['payments', 'yearly', studentId, year],
    queryFn: async () => {
      if (!studentId) return [];

      const startOfYear = `${year}-01-01`;
      const endOfYear = `${year}-12-31`;

      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('student_id', studentId)
        .gte('payment_date', startOfYear)
        .lte('payment_date', endOfYear)
        .order('payment_date', { ascending: false });

      if (error) {
        console.error('Error fetching yearly payments:', error);
        throw error;
      }

      return data;
    },
    enabled: !!studentId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes to avoid redundant calls per cell
  });
}

// Hook khusus untuk mendapatkan outstanding balance via Database Function
export function useStudentOutstanding(studentId: string | undefined) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['student-outstanding', studentId],
    queryFn: async () => {
      if (!studentId) return 0;

      // Memanggil RPC (Remote Procedure Call) ke fungsi PostgreSQL yang baru dibuat
      // FIX: Cast 'as any' digunakan karena type definition lokal belum di-update dengan fungsi baru
      const { data, error } = await supabase
        .rpc('get_student_outstanding' as any, { student_uuid: studentId });

      if (error) {
        console.error('Error calculating outstanding:', error);
        throw error;
      }

      return data as number;
    },
    enabled: !!studentId, // Hanya jalan jika studentId ada
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async (newPayment: any) => {
      const { data, error } = await supabase
        .from('payments')
        .insert(newPayment)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      toast.success('Pembayaran berhasil dicatat');
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      // Invalidate yearly payments for the specific student
      if (variables.student_id && variables.year) {
         queryClient.invalidateQueries({ 
            queryKey: ['payments', 'yearly', variables.student_id, variables.year] 
         });
      } else {
         // Fallback invalidate all yearly if we can't determine specifics easily
         queryClient.invalidateQueries({ queryKey: ['payments', 'yearly'] });
      }
      
      // Refresh outstanding balance for that specific student
      if (variables.student_id) {
        queryClient.invalidateQueries({ queryKey: ['student-outstanding', variables.student_id] });
      }

      // INVALIDATE DASHBOARD STATS
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (error) => {
      toast.error(`Gagal mencatat pembayaran: ${error.message}`);
    },
  });
}
