'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const paymentSchema = z.object({
  student_id: z.string().uuid(),
  amount: z.number().min(0),
  discount_amount: z.number().min(0).optional(),
  payment_date: z.string(), // ISO string
  payment_method: z.enum(['CASH', 'TRANSFER']),
  month: z.number().min(0).max(11),
  year: z.number().min(2000),
  status: z.enum(['completed', 'pending', 'failed']).default('completed'),
})

export type CreatePaymentInput = z.infer<typeof paymentSchema>

export async function createPayment(data: CreatePaymentInput) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const validatedFields = paymentSchema.safeParse(data)

  if (!validatedFields.success) {
    return { error: 'Invalid fields: ' + validatedFields.error.message }
  }

  // Check if payment already exists for this month/year (Optional: Remove if duplicate payments are allowed)
  const { data: existingPayment } = await supabase
    .from('payments')
    .select('id')
    .eq('student_id', data.student_id)
    .eq('month', data.month)
    .eq('year', data.year)
    .single()

  if (existingPayment) {
    return { error: 'Payment for this month/year already exists.' }
  }

  // Insert Payment with month/year columns (program_id is now optional/nullable in schema)
  const { error } = await supabase.from('payments').insert({
    student_id: data.student_id,
    amount: data.amount,
    discount_amount: data.discount_amount || 0,
    payment_date: data.payment_date,
    payment_method: data.payment_method,
    month: data.month,
    year: data.year,
    payment_status: data.status,
    created_by: user.id, // Ensure this column is used or mapped correctly, in provided schema it is received_by?
    received_by: user.id, // Based on schema
    notes: 'Quick Payment via Dashboard',
    invoice_number: `INV-${Date.now()}`,
    category: 'tuition', // Default
    program_id: null, // Explicitly null for tuition/spp
  })

  if (error) {
    console.error('Database Error:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/students')
  revalidatePath('/dashboard/payments')
  revalidatePath('/dashboard/reports') // Important for reports page update

  return { success: true }
}
