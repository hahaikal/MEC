import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSystemSettings, updateSystemSettings } from '@/actions/settings'
import { toast } from '@/lib/hooks/use-toast'

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
      toast({
        title: "Pengaturan Tersimpan",
        description: "Semua perubahan pengaturan telah disimpan dengan sukses.",
      })
    },
    onError: (error) => {
      toast({
        title: "Gagal Menyimpan",
        description: error.message || "Gagal menyimpan pengaturan. Silakan coba lagi.",
        variant: "destructive",
      })
    }
  })

  return {
    settings,
    isLoading,
    updateSettings: mutation.mutate,
    isUpdating: mutation.isPending
  }
}
