'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export const useAuth = () => {
  const supabase = createClient()

  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      return session
    },
  })

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['user', session?.user?.id],
    queryFn: async () => {
      if (!session?.user) return null
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single()
      return data
    },
    enabled: !!session?.user,
  })

  return {
    session,
    user,
    isLoading: isSessionLoading || isUserLoading,
  }
}
