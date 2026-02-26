'use server'

import { createClient } from '@/lib/supabase/server'
import { studentSchema, type StudentFormValues } from '@/lib/validators/student'
import { revalidatePath } from 'next/cache'

export async function createStudent(data: StudentFormValues) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const validatedFields = studentSchema.safeParse(data)

  if (!validatedFields.success) {
    return { error: 'Invalid fields: ' + validatedFields.error.message }
  }

  // Helper function to convert empty string to null for date fields
  const toDateValue = (value: string | undefined | null): string | null => {
    if (!value || value === '') return null
    return value
  }

  const { error } = await supabase.from('students').insert({
    name: validatedFields.data.name,
    email: validatedFields.data.email || null,
    phone_number: validatedFields.data.phone_number || null,
    class_name: validatedFields.data.class_name || null,
    parent_name: validatedFields.data.parent_name || null,
    parent_phone: validatedFields.data.parent_phone || null,
    parent_occupation: validatedFields.data.parent_occupation || null,
    base_fee: validatedFields.data.base_fee,
    address: validatedFields.data.address || null,
    place_of_birth: validatedFields.data.place_of_birth || null,
    date_of_birth: toDateValue(validatedFields.data.date_of_birth),
    gender: validatedFields.data.gender || 'MALE',
    religion: validatedFields.data.religion || null,
    school_origin: validatedFields.data.school_origin || null,
    enrollment_date: toDateValue(validatedFields.data.enrollment_date) || new Date().toISOString(),
    status: 'ACTIVE',
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
  const supabase = await createClient()
  
  const validatedFields = studentSchema.safeParse(data)

  if (!validatedFields.success) {
    return { error: 'Invalid fields: ' + validatedFields.error.message }
  }

  // Helper function to convert empty string to null for date fields
  const toDateValue = (value: string | undefined | null): string | null => {
    if (!value || value === '') return null
    return value
  }

  const updateData = {
    name: validatedFields.data.name,
    email: validatedFields.data.email || null,
    phone_number: validatedFields.data.phone_number || null,
    class_name: validatedFields.data.class_name || null,
    parent_name: validatedFields.data.parent_name || null,
    parent_phone: validatedFields.data.parent_phone || null,
    parent_occupation: validatedFields.data.parent_occupation || null,
    base_fee: validatedFields.data.base_fee,
    address: validatedFields.data.address || null,
    place_of_birth: validatedFields.data.place_of_birth || null,
    date_of_birth: toDateValue(validatedFields.data.date_of_birth),
    gender: validatedFields.data.gender || 'MALE',
    religion: validatedFields.data.religion || null,
    school_origin: validatedFields.data.school_origin || null,
    enrollment_date: toDateValue(validatedFields.data.enrollment_date),
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('students')
    .update(updateData)
    .eq('id', id)

  if (error) {
    console.error('Update Error:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/students')
  return { success: true }
}

export async function deleteStudent(id: string) {
  const supabase = await createClient()
  
  // Note: Ensure foreign key constraints (like payments) are handled.
  // If ON DELETE CASCADE is set in DB, this works. Otherwise, we might need to delete payments first.
  // Assuming CASCADE based on user's request to just "delete it".

  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Delete Error:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/students')
  return { success: true }
}
