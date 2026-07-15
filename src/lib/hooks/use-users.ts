import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUsers, updateUser, deleteUser, changeUserPassword } from '@/actions/users'
import { toast } from '@/lib/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'

export function useInternalUsers() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['internal-users'],
    queryFn: async () => {
      const res = await getUsers()
      if (res.error) throw new Error(res.error)
      return res.users
    }
  })

  const supabase = createClient()
  const { data: currentUserData } = useQuery({
    queryKey: ['current-user-roles'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []
      const { data } = await supabase.from('users').select('roles').eq('id', user.id).single()
      if (data) return data.roles || []
      return []
    }
  })

  const createUserMutation = useMutation({
    mutationFn: async (newUser: any) => {
      const { email, password, full_name, roles, allowed_menus } = newUser
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name, roles, allowed_menus })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internal-users'] })
      toast({ title: 'Success', description: 'User created successfully' })
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' })
    }
  })

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: any }) => {
      const res = await updateUser(id, updates)
      if (res.error) throw new Error(res.error)
      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internal-users'] })
      toast({ title: 'Success', description: 'User updated successfully' })
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' })
    }
  })

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteUser(id)
      if (res.error) throw new Error(res.error)
      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internal-users'] })
      toast({ title: 'Success', description: 'User disabled successfully' })
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' })
    }
  })

  const changePasswordMutation = useMutation({
    mutationFn: async ({ targetUserId, newPassword }: { targetUserId: string, newPassword: string }) => {
      const res = await changeUserPassword(targetUserId, newPassword)
      if (res.error) throw new Error(res.error)
      return res
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'User password changed successfully' })
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' })
    }
  })

  return {
    users: data || [],
    isLoading,
    createUser: createUserMutation.mutate,
    isCreating: createUserMutation.isPending,
    updateUser: updateUserMutation.mutate,
    isUpdating: updateUserMutation.isPending,
    deleteUser: deleteUserMutation.mutate,
    isDeleting: deleteUserMutation.isPending,
    changePassword: changePasswordMutation.mutate,
    isChangingPassword: changePasswordMutation.isPending,
    currentUserRoles: currentUserData || []
  }
}
