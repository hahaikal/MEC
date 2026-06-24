import { z } from 'zod'

export const galleryItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional().default(''),
  image_url: z.string().min(1, 'Image is required'),
  category: z.string().min(1, 'Category is required'),
  is_active: z.boolean().default(true),
  order_index: z.number().int().default(0),
})

export type GalleryFormValues = z.infer<typeof galleryItemSchema>
