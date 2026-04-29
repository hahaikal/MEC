'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getSystemSettings() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('system_settings').select('setting_key, setting_value')

  if (error) {
    console.error('Error fetching settings:', error)
    return null
  }

  const settingsObj: Record<string, any> = {}
  data.forEach(item => {
    settingsObj[item.setting_key] = item.setting_value
  })

  return settingsObj
}

export async function updateSystemSettings(settings: Record<string, any>) {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  const updates = Object.entries(settings).map(([key, value]) => ({
    setting_key: key,
    setting_value: value,
    updated_at: new Date().toISOString(),
    updated_by: userData.user?.id
  }))

  const { error } = await supabase
    .from('system_settings')
    .upsert(updates, { onConflict: 'setting_key' })

  if (error) {
    console.error('Error updating settings:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/settings')
  return { success: true }
}
