'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus, Upload, X } from 'lucide-react'
import { ImageCropper } from '@/components/ui/image-cropper'
import { useCreateGalleryItem } from '@/lib/hooks/use-gallery'
import { usePrograms } from '@/lib/hooks/use-programs'
import { uploadGalleryImage } from '@/lib/upload-gallery-image'
import { toast } from 'sonner'

export function AddGalleryDialog() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  
  const [pendingCropFiles, setPendingCropFiles] = useState<File[]>([])
  const [currentCropUrl, setCurrentCropUrl] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  
  const { data: programs = [] } = usePrograms()
  const createMutation = useCreateGalleryItem()

  useEffect(() => {
    if (pendingCropFiles.length > 0 && !currentCropUrl) {
      setCurrentCropUrl(URL.createObjectURL(pendingCropFiles[0]))
    }
  }, [pendingCropFiles, currentCropUrl])

  const handleCropComplete = (croppedFile: File) => {
    const newFiles = [...selectedFiles, croppedFile]
    setSelectedFiles(newFiles)
    const newPreviews = [...previewUrls, URL.createObjectURL(croppedFile)]
    setPreviewUrls(newPreviews)
    
    const remaining = pendingCropFiles.slice(1)
    setPendingCropFiles(remaining)
    setCurrentCropUrl(null)
  }

  const handleCropCancel = () => {
    const remaining = pendingCropFiles.slice(1)
    setPendingCropFiles(remaining)
    setCurrentCropUrl(null)
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setCategory('')
    setEventDate('')
    setSelectedFiles([])
    setPreviewUrls([])
    setPendingCropFiles([])
    setCurrentCropUrl(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setPendingCropFiles(prev => [...prev, ...files])
    if (e.target) e.target.value = ''
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!title || !category || selectedFiles.length === 0) {
      toast.error('Please fill in title, category, and select at least one image.')
      return
    }

    setUploading(true)
    try {
      const urls: string[] = []
      for (const f of selectedFiles) {
        const url = await uploadGalleryImage(f)
        urls.push(url)
      }
      const finalImageUrl = urls.join(',')

      const result = await createMutation.mutateAsync({
        title,
        description,
        image_url: finalImageUrl,
        category,
        event_date: category === 'event' && eventDate ? eventDate : null,
        is_active: true,
      })

      if ('error' in result && result.error) {
        toast.error(result.error)
      } else {
        toast.success('Gallery item added successfully!')
        resetForm()
        setOpen(false)
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Gallery Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Gallery Item</DialogTitle>
          <DialogDescription>Upload an image and add it to the Parent Hub gallery.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 px-1 max-h-[65vh] overflow-y-auto">
          {/* Image Upload */}
          <div>
            <Label>
              Photos (Max 5MB per file) *
              <span className="block text-xs font-normal text-blue-600 mt-1">
                Bisa upload lebih dari 1 foto
              </span>
            </Label>
            
            <div className="space-y-4 mt-2">
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
              
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {previewUrls.map((url, i) => (
                    <div key={i} className="relative group aspect-square">
                      <img 
                        src={url} 
                        alt={`Preview ${i + 1}`} 
                        className="h-full w-full rounded-lg object-cover border" 
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeFile(i)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Activity title" />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="desc">Description</Label>
            <Input id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description" />
          </div>

          {/* Category */}
          <div>
            <Label>Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
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
              <Label htmlFor="event_date">Event Date *</Label>
              <Input
                id="event_date"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={uploading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Add Item'}
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
