import { Database } from '@/types/supabase'

export type GalleryItem = Database['public']['Tables']['gallery_items']['Row']
export type GalleryItemInsert = Database['public']['Tables']['gallery_items']['Insert']
export type GalleryItemUpdate = Database['public']['Tables']['gallery_items']['Update']

export const GALLERY_CATEGORIES = [
  { value: 'english-class', label: 'English Class' },
  { value: 'bimbel', label: 'Tutoring (Bimbel)' },
  { value: 'calistung', label: 'Reading, Writing & Counting' },
  { value: 'preschool', label: 'Preschool' },
  { value: 'event', label: 'Special Events' },
  { value: 'general', label: 'General' },
] as const
