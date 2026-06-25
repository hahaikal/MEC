'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getUsers() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
    return { error: error.message }
  }
  return { users: data }
}

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export async function updateUser(id: string, updates: { full_name?: string, roles?: string[], is_active?: boolean, bio?: string, profile_picture_url?: string, staff_id?: string, date_of_birth?: string | null, payday?: number | null }) {
  const supabase = await createClient()

  // 1. Update public.users
  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)

  if (error) {
    console.error('Error updating user:', error)
    return { error: error.message }
  }

  // 2. If roles changed, sync to Auth User Metadata using Service Role
  if (updates.roles && process.env.SUPABASE_SERVICE_ROLE_KEY) {
     const supabaseAdmin = createSupabaseClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.SUPABASE_SERVICE_ROLE_KEY
     )

     const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, {
       user_metadata: { roles: updates.roles }
     })

     if (authError) {
       console.error("Failed to sync roles to auth.users metadata:", authError.message)
     }
  } else if (updates.roles) {
     console.warn("SUPABASE_SERVICE_ROLE_KEY is not set. Cannot sync roles to auth.users metadata.")
  }

  revalidatePath('/dashboard/users')
  return { success: true }
}

export async function deleteUser(id: string) {
  const supabase = await createClient()

  // Actually deleting from auth.users requires service role via API or Edge Function,
  // but we can just mark them as inactive in public.users to keep the history intact and revoke access.
  const { error } = await supabase
    .from('users')
    .update({ is_active: false })
    .eq('id', id)

  if (error) {
    console.error('Error disabling user:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/users')
  return { success: true }
}
