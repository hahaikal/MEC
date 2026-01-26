import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export function useAddStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (studentData: {
      name: string
      email: string
      phone: string
      program_id: string
      enrollment_date: string
      status: string
    }) => {
      const { data, error } = await supabase
        .from('students')
        .insert([studentData])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
    },
  })
}

export function useAddPayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (paymentData: {
      student_id: string
      amount: number
      payment_method: string
      payment_date: string
      description?: string
    }) => {
      const { data, error } = await supabase
        .from('payments')
        .insert([paymentData])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
    },
  })
}
