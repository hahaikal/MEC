import { createClient } from '@/lib/supabase/server'

export const authService = {
  async register(email: string, password: string, userData: { full_name: string; role: 'admin' | 'staff' | 'viewer' }) {
    const supabase = await createClient()

    // Sign up user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.full_name,
          role: userData.role,
        },
      },
    })

    if (error) throw error
    return data
  },

  async login(email: string, password: string) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  },

  async logout() {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getSession() {
    const supabase = await createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  },

  async getCurrentUser() {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  },

  async getUserProfile(userId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  },
}
