'use server'

import { createClient } from '@/lib/supabase/server'
import { galleryItemSchema, type GalleryFormValues } from '@/lib/validators/gallery'
import { revalidatePath } from 'next/cache'

export async function getGalleryItems(category?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('gallery_items')
    .select('*')
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Fetch Gallery Error:', error)
    return { error: error.message }
  }

  return { data }
}

export async function getActiveGalleryItems(category?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('gallery_items')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Fetch Active Gallery Error:', error)
    return { error: error.message }
  }

  return { data }
}

export async function createGalleryItem(data: GalleryFormValues) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const validated = galleryItemSchema.safeParse(data)
  if (!validated.success) return { error: 'Invalid fields: ' + validated.error.message }

  const { error } = await supabase.from('gallery_items').insert({
    title: validated.data.title,
    description: validated.data.description || null,
    image_url: validated.data.image_url,
    category: validated.data.category,
    is_active: validated.data.is_active,
    order_index: validated.data.order_index,
    created_by: user.id,
  })

  if (error) {
    console.error('Create Gallery Item Error:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/parent-hub-manager')
  return { success: true }
}

export async function updateGalleryItem(id: string, data: Partial<GalleryFormValues>) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('gallery_items')
    .update(data)
    .eq('id', id)

  if (error) {
    console.error('Update Gallery Item Error:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/parent-hub-manager')
  return { success: true }
}

export async function toggleGalleryItem(id: string, isActive: boolean) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('gallery_items')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) {
    console.error('Toggle Gallery Item Error:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/parent-hub-manager')
  return { success: true }
}

export async function deleteGalleryItem(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // First get the item to find image path
  const { data: item } = await supabase
    .from('gallery_items')
    .select('image_url')
    .eq('id', id)
    .single()

  // Delete from storage if it's a Supabase storage URL
  if (item?.image_url?.includes('parent_hub_gallery')) {
    const pathMatch = item.image_url.match(/parent_hub_gallery\/(.+?)(?:\?|$)/)
    if (pathMatch?.[1]) {
      await supabase.storage.from('parent_hub_gallery').remove([pathMatch[1]])
    }
  }

  // Delete from database
  const { error } = await supabase
    .from('gallery_items')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Delete Gallery Item Error:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/parent-hub-manager')
  return { success: true }
}
