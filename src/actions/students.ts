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

  const { data: student, error } = await supabase.from('students').insert({
    name: validatedFields.data.name,
    email: validatedFields.data.email || null,
    phone_number: validatedFields.data.phone_number || null,
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
  }).select('id').single()

  if (error) {
    console.error('Database Error:', error)
    return { error: error.message }
  }

  // Enroll student if class_id is provided
  if (validatedFields.data.class_id) {
    const { error: enrollmentError } = await supabase.from('class_enrollments').insert({
      student_id: student.id,
      class_id: validatedFields.data.class_id,
    })

    if (enrollmentError) {
      console.error('Enrollment Error:', enrollmentError)
      // Note: we could rollback or just return an error
      return { error: 'Student created but enrollment failed: ' + enrollmentError.message }
    }
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

  // Handle enrollment update
  // First, check existing enrollment
  const { data: existingEnrollments } = await supabase
    .from('class_enrollments')
    .select('id, class_id')
    .eq('student_id', id)

  if (validatedFields.data.class_id) {
    // Upsert enrollment
    if (existingEnrollments && existingEnrollments.length > 0) {
      // Update existing
      if (existingEnrollments[0].class_id !== validatedFields.data.class_id) {
        await supabase
          .from('class_enrollments')
          .update({ class_id: validatedFields.data.class_id })
          .eq('id', existingEnrollments[0].id)
      }
    } else {
      // Insert new
      await supabase.from('class_enrollments').insert({
        student_id: id,
        class_id: validatedFields.data.class_id,
      })
    }
  } else {
    // If class_id is cleared, optionally remove enrollment
    // Uncomment if un-enrolling is allowed via form:
    // await supabase.from('class_enrollments').delete().eq('student_id', id)
  }

  revalidatePath('/dashboard/students')
  return { success: true }
}

export async function deleteStudent(id: string) {
  const supabase = await createClient()
  
  // Instead of hard deleting, we soft delete the student by setting status to 'INACTIVE'
  const { error } = await supabase
    .from('students')
    .update({
      status: 'INACTIVE',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('Update Student Status Error:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/students')
  return { success: true }
}
