import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function usePayments() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          students (name),
          programs (name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
  })
}

export function useStudentPayments(studentId: string | null) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['payments', 'student', studentId],
    queryFn: async () => {
      if (!studentId) return []
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('student_id', studentId)
        .order('year', { ascending: false })
        .order('month', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!studentId,
  })
}

export function useTuitionDetails(studentId: string | null) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['tuition', studentId],
    queryFn: async () => {
      if (!studentId) return null

      // 1. Get student's class and program_id
      const { data: enrollment, error: enrollError } = await supabase
        .from('class_enrollments')
        .select('classes(id, name, program_id, programs(price))')
        .eq('student_id', studentId)
        .single()

      if (enrollError && enrollError.code !== 'PGRST116') throw enrollError

      if (!enrollment || !enrollment.classes || !enrollment.classes.program_id) {
         return { price: 0, discount: 0, finalPrice: 0 }
      }

      const programId = enrollment.classes.program_id
      const price = enrollment.classes.programs?.price || 0

      // 2. Get active discounts
      const today = new Date().toISOString().split('T')[0]
      const { data: discounts, error: discError } = await supabase
        .from('student_discounts')
        .select('*')
        .eq('student_id', studentId)
        .eq('program_id', programId)
        .lte('start_date', today)
        .gte('end_date', today)

      if (discError) throw discError

      let totalDiscount = 0
      discounts?.forEach(d => {
        if (d.discount_type === 'fixed_amount') {
          totalDiscount += Number(d.discount_value)
        } else if (d.discount_type === 'percentage') {
          totalDiscount += price * (Number(d.discount_value) / 100)
        }
      })

      return {
        programId,
        price,
        discount: totalDiscount,
        finalPrice: Math.max(0, price - totalDiscount)
      }
    },
    enabled: !!studentId,
  })
}

export function useStudentPaymentsYearly(studentId: string, year: number) {
  return useQuery({
    queryKey: ['student-payments-yearly', studentId, year],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('student_id', studentId)
        .eq('year', year)
        .order('month', { ascending: true });

      if (error) {
        throw error;
      }
      return data;
    },
    enabled: !!studentId,
  });
}


import { createPayment } from '@/actions/payments';

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const result = await createPayment(data);
      if (result.error) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-payments-yearly'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}
