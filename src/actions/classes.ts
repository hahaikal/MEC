'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createClass(data: any) {
  const supabase = await createClient()

  const { error } = await supabase.from('classes').insert({
    name: data.name,
    target_meetings: data.target_meetings || 15,
    teacher_id: data.teacher_id || null,
  })

  if (error) {
    console.error('Create Class Error:', error)
    return { error: error.message }
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
      target_meetings: data.target_meetings,
      teacher_id: data.teacher_id || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) {
    console.error('Update Class Error:', error)
    return { error: error.message }
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
