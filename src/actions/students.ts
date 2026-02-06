'use server'

import { createClient } from '@/lib/supabase/server'
import { studentSchema, type StudentFormValues } from '@/lib/validators/student'
import { revalidatePath } from 'next/cache'

export async function createStudent(data: StudentFormValues) {
  // FIX: Tambahkan await karena createClient mengembalikan Promise
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const validatedFields = studentSchema.safeParse(data)

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const { error } = await supabase.from('students').insert({
    name: validatedFields.data.name,
    nis: validatedFields.data.nis,
    email: validatedFields.data.email,
    phone_number: validatedFields.data.phone_number,
    class_name: validatedFields.data.class_name, // Field baru
    class_year: validatedFields.data.class_year,
    status: validatedFields.data.status,
    parent_name: validatedFields.data.parent_name,
    parent_phone: validatedFields.data.parent_phone,
    base_fee: validatedFields.data.base_fee,
    billing_cycle_date: validatedFields.data.billing_cycle_date,
    address: validatedFields.data.address,
    enrollment_date: validatedFields.data.enrollment_date || new Date().toISOString(),
    created_by: user.id,
  })

  if (error) {
    console.error('Database Error:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/students')
  return { success: true }
}

export async function updateStudent(id: string, data: StudentFormValues) {
  // FIX: Tambahkan await
  const supabase = await createClient()
  
  const validatedFields = studentSchema.safeParse(data)

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  // Kita construct object update manual agar aman dari field undefined
  const updateData = {
    name: validatedFields.data.name,
    nis: validatedFields.data.nis,
    email: validatedFields.data.email,
    phone_number: validatedFields.data.phone_number,
    class_name: validatedFields.data.class_name,
    class_year: validatedFields.data.class_year,
    status: validatedFields.data.status,
    parent_name: validatedFields.data.parent_name,
    parent_phone: validatedFields.data.parent_phone,
    base_fee: validatedFields.data.base_fee,
    billing_cycle_date: validatedFields.data.billing_cycle_date,
    address: validatedFields.data.address,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('students')
    .update(updateData)
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/students')
  return { success: true }
}

export async function deleteStudent(id: string) {
  // FIX: Tambahkan await
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/students')
  return { success: true }
}