'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPayment(data: any) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase.from('payments').insert({
    student_id: data.student_id,
    program_id: data.program_id,
    amount: data.amount,
    payment_method: data.payment_method || 'cash',
    payment_status: 'completed',
    invoice_number: `INV-${Date.now()}`,
    notes: data.notes,
    category: data.category || 'tuition',
    month: data.month,
    year: data.year,
    payment_date: data.payment_date,
    discount_amount: data.discount_amount || 0,
    received_by: user?.id,
  })

  if (error) {
    console.error('Create Payment Error:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/payments')
  return { success: true }
}

export async function updatePayment(id: string, data: any) {
  const supabase = await createClient()

  const { error } = await supabase.from('payments').update({
    amount: data.amount,
    payment_method: data.payment_method,
    notes: data.notes,
    discount_amount: data.discount_amount,
    payment_date: data.payment_date,
  }).eq('id', id)

  if (error) {
    console.error('Update Payment Error:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/payments')
  revalidatePath('/dashboard/students')
  return { success: true }
}
