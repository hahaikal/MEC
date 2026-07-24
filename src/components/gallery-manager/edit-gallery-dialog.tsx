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
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUpdateGalleryItem } from '@/lib/hooks/use-gallery'
import { usePrograms } from '@/lib/hooks/use-programs'
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
  const [existingUrls, setExistingUrls] = useState<string[]>([])
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [pendingCropFiles, setPendingCropFiles] = useState<File[]>([])
  const [currentCropUrl, setCurrentCropUrl] = useState<string | null>(null)
  
  const fileRef = useRef<HTMLInputElement>(null)
  const { data: programs = [] } = usePrograms()
  const updateMutation = useUpdateGalleryItem()

  useEffect(() => {
    if (pendingCropFiles.length > 0 && !currentCropUrl) {
      setCurrentCropUrl(URL.createObjectURL(pendingCropFiles[0]))
    }
  }, [pendingCropFiles, currentCropUrl])

  const handleCropComplete = (croppedFile: File) => {
    const addedFiles = [...newFiles, croppedFile]
    setNewFiles(addedFiles)
    const addedPreviews = [...newPreviews, URL.createObjectURL(croppedFile)]
    setNewPreviews(addedPreviews)
    
    const remaining = pendingCropFiles.slice(1)
    setPendingCropFiles(remaining)
    setCurrentCropUrl(null)
  }

  const handleCropCancel = () => {
    const remaining = pendingCropFiles.slice(1)
    setPendingCropFiles(remaining)
    setCurrentCropUrl(null)
  }

  useEffect(() => {
    if (item) {
      setTitle(item.title)
      setDescription(item.description || '')
      setCategory(item.category)
      setEventDate(item.event_date || '')
      setExistingUrls(item.image_url ? item.image_url.split(',').map(s => s.trim()).filter(Boolean) : [])
      setNewFiles([])
      setNewPreviews([])
      setPendingCropFiles([])
      setCurrentCropUrl(null)
    }
  }, [item])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setPendingCropFiles(prev => [...prev, ...files])
    if (e.target) e.target.value = ''
  }

  const removeExisting = (index: number) => {
    setExistingUrls(prev => prev.filter((_, i) => i !== index))
  }

  const removeNew = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index))
    setNewPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!item || !title || !category || (existingUrls.length === 0 && newFiles.length === 0)) {
      toast.error('Please fill in all required fields and ensure there is at least one image.')
      return
    }

    setUploading(true)
    try {
      const uploadedUrls: string[] = []
      for (const f of newFiles) {
        const url = await uploadGalleryImage(f)
        uploadedUrls.push(url)
      }
      const finalImageUrl = [...existingUrls, ...uploadedUrls].join(',')

      const result = await updateMutation.mutateAsync({
        id: item.id,
        data: { 
          title, 
          description, 
          category,
          event_date: category === 'event' && eventDate ? eventDate : null,
          image_url: finalImageUrl,
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
            <Label>
              Photos
              <span className="block text-xs font-normal text-blue-600 mt-1">
                Anda bisa menambah atau menghapus foto.
              </span>
            </Label>
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-3 gap-2">
                {existingUrls.map((url, i) => (
                  <div key={`exist-${i}`} className="relative group aspect-square">
                    <img src={url} alt={`Existing ${i + 1}`} className="h-full w-full rounded-lg object-cover border" />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeExisting(i)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {newPreviews.map((url, i) => (
                  <div key={`new-${i}`} className="relative group aspect-square">
                    <img src={url} alt={`New ${i + 1}`} className="h-full w-full rounded-lg object-cover border border-blue-400" />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeNew(i)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <div
                className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50 transition"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="h-8 w-8 text-slate-400" />
                <p className="mt-2 text-sm text-slate-500">Click to add photos</p>
              </div>
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/jpeg, image/jpg, image/png, image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="edit-title">Title *</Label>
            <Input id="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="edit-desc">Description</Label>
            <Textarea id="edit-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
          </div>

          {/* Category */}
          <div>
            <Label>Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {programs.map((p: any) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
                <SelectItem value="event">Special Events</SelectItem>
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
      {currentCropUrl && (
        <ImageCropper
          imageSrc={currentCropUrl}
          aspectRatio={4 / 3}
          open={!!currentCropUrl}
          onCancel={handleCropCancel}
          onCropComplete={handleCropComplete}
        />
      )}
    </Dialog>
  )
}
