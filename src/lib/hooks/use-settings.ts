import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSystemSettings, updateSystemSettings } from '@/actions/settings'
import { toast } from 'sonner'

export function useSettings() {
  const queryClient = useQueryClient()

  const { data: settings, isLoading } = useQuery({
    queryKey: ['system-settings'],
    queryFn: async () => {
      return await getSystemSettings()
    }
  })

  const mutation = useMutation({
    mutationFn: async (newSettings: Record<string, any>) => {
      const result = await updateSystemSettings(newSettings)
      if (result.error) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] })
      toast.success("Semua perubahan pengaturan telah disimpan dengan sukses.")
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menyimpan pengaturan. Silakan coba lagi.")
    }
  })

  return {
    settings,
    isLoading,
    updateSettings: mutation.mutate,
    isUpdating: mutation.isPending
  }
}
