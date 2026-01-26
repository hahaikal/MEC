import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function usePayments() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*, student:students(*)')
        .order('payment_date', { ascending: false })

      if (error) throw error
      return data
    },
  })
}

export function usePaymentsByStudent(studentId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['payments', studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('student_id', studentId)
        .order('payment_date', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!studentId,
  })
}
