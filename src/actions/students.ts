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
    phone_number: validatedFields.data.phone_number || null,
    father_name: validatedFields.data.father_name || null,
    mother_name: validatedFields.data.mother_name || null,
    father_occupation: validatedFields.data.father_occupation || null,
    mother_occupation: validatedFields.data.mother_occupation || null,
    parent_phone: validatedFields.data.parent_phone || null,
    address: validatedFields.data.address || null,
    place_of_birth: validatedFields.data.place_of_birth || null,
    date_of_birth: toDateValue(validatedFields.data.date_of_birth),
    gender: validatedFields.data.gender || 'MALE',
    religion: validatedFields.data.religion || null,
    school_origin: validatedFields.data.school_origin || null,
    joined_since_class: validatedFields.data.joined_since_class || null,
    enrollment_date: toDateValue(validatedFields.data.enrollment_date) || new Date().toISOString(),
    status: 'ACTIVE',
    created_by: user.id,
  }).select('id').single()

  if (error) {
    console.error('Database Error:', error)
    return { error: error.message }
  }

  // Enroll student if enrollments are provided
  if (validatedFields.data.enrollments && validatedFields.data.enrollments.length > 0) {
    const enrollmentsToInsert = validatedFields.data.enrollments.map((enr: any) => ({
      student_id: student.id,
      class_id: enr.class_id,
      base_fee: enr.base_fee
    }))
    
    const { error: enrollmentError } = await supabase.from('class_enrollments').insert(enrollmentsToInsert)

    if (enrollmentError) {
      console.error('Enrollment Error:', enrollmentError)
      return { error: 'Student created but enrollment failed: ' + enrollmentError.message }
    }
  }

  revalidatePath('/dashboard/students')
  return { success: true, studentId: student.id }
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
    phone_number: validatedFields.data.phone_number || null,
    father_name: validatedFields.data.father_name || null,
    mother_name: validatedFields.data.mother_name || null,
    father_occupation: validatedFields.data.father_occupation || null,
    mother_occupation: validatedFields.data.mother_occupation || null,
    parent_phone: validatedFields.data.parent_phone || null,
    address: validatedFields.data.address || null,
    place_of_birth: validatedFields.data.place_of_birth || null,
    date_of_birth: toDateValue(validatedFields.data.date_of_birth),
    gender: validatedFields.data.gender || 'MALE',
    religion: validatedFields.data.religion || null,
    school_origin: validatedFields.data.school_origin || null,
    joined_since_class: validatedFields.data.joined_since_class || null,
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

  // Handle enrollment updates by removing old and inserting new
  const { error: delError } = await supabase.from('class_enrollments').delete().eq('student_id', id)
  
  if (delError) {
    console.error('Delete old enrollments error:', delError)
  }

  if (validatedFields.data.enrollments && validatedFields.data.enrollments.length > 0) {
    const enrollmentsToInsert = validatedFields.data.enrollments.map((enr: any) => ({
      student_id: id,
      class_id: enr.class_id,
      base_fee: enr.base_fee
    }))
    
    const { error: enrollmentError } = await supabase.from('class_enrollments').insert(enrollmentsToInsert)
    if (enrollmentError) {
       console.error('Insert new enrollments error:', enrollmentError)
    }
  }

  revalidatePath('/dashboard/students')
  return { success: true }
}

export async function deleteStudent(id: string) {
  const supabase = await createClient()
  
  // Instead of hard deleting, we soft delete the student by setting status to 'INACTIVE'
  const { data, error } = await supabase
    .from('students')
    .update({
      status: 'INACTIVE',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()

  if (error) {
    console.error('Update Student Status Error:', error)
    return { error: error.message }
  }

  if (!data || data.length === 0) {
    console.error('No rows updated. RLS or invalid ID.')
    return { error: 'Gagal memperbarui status. Pastikan Anda memiliki akses.' }
  }

  revalidatePath('/dashboard/students')
  return { success: true }
}

export async function updateStudentPhoto(id: string, photoUrl: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('students')
    .update({
      photo_url: photoUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('Update Photo Error:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/students')
  return { success: true }
}
