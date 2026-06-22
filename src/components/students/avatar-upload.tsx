'use client'

import { useRef, useState } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { uploadStudentPhoto } from '@/lib/upload-student-photo'
import { updateStudentPhoto } from '@/actions/students'
import { useToast } from '@/components/ui/use-toast'
import { useQueryClient } from '@tanstack/react-query'

interface AvatarUploadProps {
  studentId: string | null
  studentName: string
  currentPhotoUrl: string | null
  onPhotoUploaded?: (url: string) => void
  /** Store file for later upload (used when creating a new student) */
  onFileSelected?: (file: File) => void
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-12 w-12',
  md: 'h-20 w-20',
  lg: 'h-24 w-24',
}

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-xl',
  lg: 'text-2xl',
}

export function AvatarUpload({
  studentId,
  studentName,
  currentPhotoUrl,
  onPhotoUploaded,
  onFileSelected,
  size = 'lg',
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const initials = studentName
    ? studentName.substring(0, 2).toUpperCase()
    : '??'

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: 'destructive',
        title: 'Format tidak valid',
        description: 'Silakan pilih file gambar (JPG, PNG, WebP).',
      })
      return
    }

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file)
    setPreviewUrl(localPreview)

    // If no studentId yet (new student), store file for later
    if (!studentId) {
      onFileSelected?.(file)
      toast({
        title: 'Foto dipilih',
        description: 'Foto akan di-upload setelah data siswa disimpan.',
      })
      return
    }

    // Upload immediately for existing students
    setIsUploading(true)
    try {
      const publicUrl = await uploadStudentPhoto(file, studentId)

      // Persist to database
      const result = await updateStudentPhoto(studentId, publicUrl)
      if (result.error) {
        throw new Error(result.error)
      }

      setPreviewUrl(publicUrl)
      onPhotoUploaded?.(publicUrl)

      // Invalidate student queries to refresh data table
      queryClient.invalidateQueries({ queryKey: ['students'] })

      toast({
        title: 'Foto berhasil di-upload',
        description: 'Foto profil siswa telah diperbarui.',
      })
    } catch (error: any) {
      console.error('Photo upload error:', error)
      setPreviewUrl(currentPhotoUrl) // Revert preview
      toast({
        variant: 'destructive',
        title: 'Upload gagal',
        description: error.message || 'Terjadi kesalahan saat meng-upload foto.',
      })
    } finally {
      setIsUploading(false)
      // Reset input so same file can be re-selected
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="relative group cursor-pointer" onClick={handleClick}>
      <Avatar className={`${sizeClasses[size]} border-4 border-slate-100 shadow-md transition-transform group-hover:scale-105`}>
        <AvatarImage
          src={previewUrl || undefined}
          alt={studentName}
          className="object-cover"
        />
        <AvatarFallback className={`bg-primary/10 text-primary ${textSizeClasses[size]} font-bold`}>
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        {isUploading ? (
          <Loader2 className="text-white h-6 w-6 animate-spin" />
        ) : (
          <Camera className="text-white h-6 w-6" />
        )}
      </div>

      {/* Uploading indicator ring */}
      {isUploading && (
        <div className="absolute inset-0 rounded-full border-2 border-blue-500 animate-pulse" />
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}
