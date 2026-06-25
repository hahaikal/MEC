import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { createGalleryItem, updateGalleryItem, toggleGalleryItem, deleteGalleryItem } from '@/actions/gallery'
import type { GalleryFormValues } from '@/lib/validators/gallery'

export function useGalleryItems(category?: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['gallery-items', category],
    queryFn: async () => {
      let query = supabase
        .from('gallery_items')
        .select('*')
        .order('created_at', { ascending: false })

      if (category) {
        query = query.eq('category', category)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    },
  })
}

export function useActiveGalleryItems(category?: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['gallery-items', 'active', category],
    queryFn: async () => {
      let query = supabase
        .from('gallery_items')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (category) {
        query = query.eq('category', category)
      }

      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
  })
}

export function useCreateGalleryItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: GalleryFormValues) => createGalleryItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-items'] })
    },
  })
}

export function useUpdateGalleryItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<GalleryFormValues> }) =>
      updateGalleryItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-items'] })
    },
  })
}

export function useToggleGalleryItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleGalleryItem(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-items'] })
    },
  })
}

export function useDeleteGalleryItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteGalleryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-items'] })
    },
  })
}
