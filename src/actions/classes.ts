'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getClasses() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('classes')
    .select(`
      *,
      class_teachers ( users (id, full_name) ),
      programs:program_id (id, name),
      class_enrollments(count)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fetch Classes Error:', error)
    throw new Error(error.message)
  }

  return data.map((c: any) => ({
    ...c,
    teachers: c.class_teachers?.map((ct: any) => ct.users) || [],
    enrolled_count: c.class_enrollments[0]?.count || 0
  }))
}

export async function createClass(data: any) {
  const supabase = await createClient()

  const { data: newClass, error } = await supabase.from('classes').insert({
    name: data.name,
    schedule_days: data.schedule_days || null,
    program_id: data.program_id || null,
  }).select('id').single()

  if (error) {
    console.error('Create Class Error:', error)
    return { error: error.message }
  }

  if (data.teacher_ids && data.teacher_ids.length > 0) {
    const teacherInserts = data.teacher_ids.map((id: string) => ({
      class_id: newClass.id,
      teacher_id: id
    }))
    await supabase.from('class_teachers').insert(teacherInserts)
  }

  revalidatePath('/dashboard/classes')
  return { success: true }
}

export async function updateClass(id: string, data: any) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('classes')
    .update({
      name: data.name,
      schedule_days: data.schedule_days || null,
      program_id: data.program_id || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) {
    console.error('Update Class Error:', error)
    return { error: error.message }
  }

  // Sync teachers
  await supabase.from('class_teachers').delete().eq('class_id', id)
  if (data.teacher_ids && data.teacher_ids.length > 0) {
    const teacherInserts = data.teacher_ids.map((tid: string) => ({
      class_id: id,
      teacher_id: tid
    }))
    await supabase.from('class_teachers').insert(teacherInserts)
  }

  revalidatePath('/dashboard/classes')
  return { success: true }
}

export async function deleteClass(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('classes')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Delete Class Error:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/classes')
  return { success: true }
}
