import imageCompression from 'browser-image-compression'
import { createClient } from '@/lib/supabase/client'

/**
 * Compresses an image client-side and uploads it to Supabase Storage.
 * 
 * Pipeline: File → Compress (max 200KB, 500x500) → Upload to student-profiles bucket → Return public URL
 */
export async function uploadStudentPhoto(
  file: File,
  studentId: string
): Promise<string> {
  // 1. Client-side compression
  const compressedFile = await imageCompression(file, {
    maxSizeMB: 0.2,            // Max 200KB
    maxWidthOrHeight: 500,      // Max 500x500 pixels
    useWebWorker: true,
    fileType: 'image/webp',     // Convert to WebP for smaller size
  })

  // 2. Upload to Supabase Storage
  const supabase = createClient()
  const filePath = `${studentId}.webp`

  const { error: uploadError } = await supabase.storage
    .from('student-profiles')
    .upload(filePath, compressedFile, {
      cacheControl: '3600',
      upsert: true,             // Overwrite existing photo
      contentType: 'image/webp',
    })

  if (uploadError) {
    throw new Error(`Upload gagal: ${uploadError.message}`)
  }

  // 3. Get public URL with cache-buster to force browser refresh
  const { data } = supabase.storage
    .from('student-profiles')
    .getPublicUrl(filePath)

  return `${data.publicUrl}?t=${Date.now()}`
}
