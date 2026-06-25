'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUpdateGalleryItem } from '@/lib/hooks/use-gallery'
import { GALLERY_CATEGORIES } from '@/types/gallery'
import { toast } from 'sonner'
import { Upload, X } from 'lucide-react'
import { ImageCropper } from '@/components/ui/image-cropper'
import { uploadGalleryImage } from '@/lib/upload-gallery-image'
import { useRef } from 'react'

interface EditGalleryDialogProps {
  item: {
    id: string
    title: string
    description: string | null
    image_url: string
    category: string
    event_date?: string | null
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditGalleryDialog({ item, open, onOpenChange }: EditGalleryDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [cropFileSrc, setCropFileSrc] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const updateMutation = useUpdateGalleryItem()

  useEffect(() => {
    if (item) {
      setTitle(item.title)
      setDescription(item.description || '')
      setCategory(item.category)
      setEventDate(item.event_date || '')
      setPreview(item.image_url)
      setFile(null)
    }
  }, [item])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    const url = URL.createObjectURL(selected)
    setCropFileSrc(url)
    setShowCropper(true)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleSubmit = async () => {
    if (!item || !title || !category) {
      toast.error('Please fill in all required fields.')
      return
    }

    setUploading(true)
    try {
      let imageUrl = item.image_url
      if (file) {
        imageUrl = await uploadGalleryImage(file)
      }

      const result = await updateMutation.mutateAsync({
        id: item.id,
        data: { 
          title, 
          description, 
          event_date: category === 'event' && eventDate ? eventDate : null,
          image_url: imageUrl,
        },
      })

      if ('error' in result && result.error) {
        toast.error(result.error)
      } else {
        toast.success('Gallery item updated!')
        onOpenChange(false)
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update image')
    } finally {
      setUploading(false)
    }
  }

  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Gallery Item</DialogTitle>
          <DialogDescription>Update the details for this gallery item.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 px-1 max-h-[65vh] overflow-y-auto">
          {/* Current Image Preview */}
          <div>
            <Label>Image</Label>
            {preview ? (
              <div className="relative mt-2">
                <img src={preview} alt={item.title} className="h-40 w-full rounded-lg object-cover" />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-2 right-2 h-8 w-8 bg-white/80 hover:bg-white"
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                className="mt-2 flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50 transition"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="h-8 w-8 text-slate-400" />
                <p className="mt-2 text-sm text-slate-500">Change image</p>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="edit-title">Title *</Label>
            <Input id="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="edit-desc">Description</Label>
            <Input id="edit-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          {/* Category */}
          <div>
            <Label>Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {GALLERY_CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Event Date (Conditional) */}
          {category === 'event' && (
            <div>
              <Label htmlFor="edit-event_date">Event Date *</Label>
              <Input
                id="edit-event_date"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={uploading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={uploading}>
            {uploading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
      {cropFileSrc && (
        <ImageCropper
          imageSrc={cropFileSrc}
          aspectRatio={4 / 3}
          open={showCropper}
          onCancel={() => {
            setShowCropper(false)
            setCropFileSrc(null)
          }}
          onCropComplete={(croppedFile) => {
            setFile(croppedFile)
            setPreview(URL.createObjectURL(croppedFile))
            setShowCropper(false)
            setCropFileSrc(null)
          }}
        />
      )}
    </Dialog>
  )
}
