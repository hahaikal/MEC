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

  const { error } = await supabase.from('students').insert({
    name: validatedFields.data.name,
    email: validatedFields.data.email,
    phone_number: validatedFields.data.phone_number,
    class_name: validatedFields.data.class_name,
    parent_name: validatedFields.data.parent_name,
    parent_phone: validatedFields.data.parent_phone,
    parent_occupation: validatedFields.data.parent_occupation,
    base_fee: validatedFields.data.base_fee,
    address: validatedFields.data.address,
    place_of_birth: validatedFields.data.place_of_birth,
    date_of_birth: validatedFields.data.date_of_birth,
    gender: validatedFields.data.gender,
    religion: validatedFields.data.religion,
    school_origin: validatedFields.data.school_origin,
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
  const supabase = await createClient()
  
  const validatedFields = studentSchema.safeParse(data)

  if (!validatedFields.success) {
    return { error: 'Invalid fields: ' + validatedFields.error.message }
  }

  const updateData = {
    name: validatedFields.data.name,
    email: validatedFields.data.email,
    phone_number: validatedFields.data.phone_number,
    class_name: validatedFields.data.class_name,
    parent_name: validatedFields.data.parent_name,
    parent_phone: validatedFields.data.parent_phone,
    parent_occupation: validatedFields.data.parent_occupation,
    base_fee: validatedFields.data.base_fee,
    address: validatedFields.data.address,
    place_of_birth: validatedFields.data.place_of_birth,
    date_of_birth: validatedFields.data.date_of_birth,
    gender: validatedFields.data.gender,
    religion: validatedFields.data.religion,
    school_origin: validatedFields.data.school_origin,
    enrollment_date: validatedFields.data.enrollment_date, // Allow updating this if necessary
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
