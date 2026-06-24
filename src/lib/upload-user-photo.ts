import imageCompression from 'browser-image-compression'
import { createClient } from '@/lib/supabase/client'

/**
 * Compresses an image client-side and uploads it to Supabase Storage.
 *
 * Pipeline: File → Compress (max 500KB, 800px) → Upload to profile_pictures bucket → Return public URL
 */
export async function uploadUserPhoto(file: File): Promise<string> {
  // 1. Client-side compression
  const compressedFile = await imageCompression(file, {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 800,
    useWebWorker: true,
    fileType: 'image/webp',
  })

  // 2. Generate unique filename
  const timestamp = Date.now()
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  const filePath = `${timestamp}_${safeName}.webp`

  // 3. Upload to Supabase Storage
  const supabase = createClient()

  const { error: uploadError } = await supabase.storage
    .from('profile_pictures')
    .upload(filePath, compressedFile, {
      cacheControl: '3600',
      upsert: false,
      contentType: 'image/webp',
    })

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`)
  }

  // 4. Get public URL
  const { data } = supabase.storage
    .from('profile_pictures')
    .getPublicUrl(filePath)

  return data.publicUrl
}
