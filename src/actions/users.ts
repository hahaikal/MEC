'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getUsers() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('users')
    .select('id, email, full_name, department, phone_number, profile_picture_url, is_active, bio, roles, staff_id, date_of_birth, payday, created_at, updated_at')
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

export async function changeUserPassword(targetUserId: string, newPassword: string) {
  const supabase = await createClient()

  // Verify caller is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Unauthorized' }
  }

  // Verify caller is Admin
  const { data: callerData, error: callerError } = await supabase
    .from('users')
    .select('roles')
    .eq('id', user.id)
    .single()

  if (callerError || !callerData) {
    return { error: 'Failed to verify permissions' }
  }

  const roles = callerData.roles || []
  if (!roles.includes('Admin') && !roles.includes('Director')) {
    return { error: 'Hanya Admin yang dapat merubah password' }
  }

  // Use Supabase Admin to update password
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { error: 'Server configuration error (missing service role key)' }
  }

  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(targetUserId, {
    password: newPassword
  })

  if (updateError) {
    console.error('Error updating password:', updateError)
    return { error: updateError.message }
  }

  return { success: true }
}
