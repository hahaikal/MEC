'use client'

import { useState, useRef } from 'react'
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
import { useCreateGalleryItem } from '@/lib/hooks/use-gallery'
import { uploadGalleryImage } from '@/lib/upload-gallery-image'
import { GALLERY_CATEGORIES } from '@/types/gallery'
import { toast } from 'sonner'

export function AddGalleryDialog() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [orderIndex, setOrderIndex] = useState(0)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const createMutation = useCreateGalleryItem()

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setCategory('')
    setEventDate('')
    setOrderIndex(0)
    setFile(null)
    setPreview(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  const handleSubmit = async () => {
    if (!title || !category || !file) {
      toast.error('Please fill in title, category, and select an image.')
      return
    }

    setUploading(true)
    try {
      const imageUrl = await uploadGalleryImage(file)

      const result = await createMutation.mutateAsync({
        title,
        description,
        image_url: imageUrl,
        category,
        event_date: category === 'event' && eventDate ? eventDate : null,
        is_active: true,
        order_index: orderIndex,
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
            <Label>Image *</Label>
            {preview ? (
              <div className="relative mt-2">
                <img src={preview} alt="Preview" className="h-48 w-full rounded-lg object-cover" />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 h-7 w-7"
                  onClick={() => { setFile(null); setPreview(null) }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                className="mt-2 flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50 transition"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="h-8 w-8 text-slate-400" />
                <p className="mt-2 text-sm text-slate-500">Click to upload image</p>
                <p className="text-xs text-slate-400">PNG, JPG, WebP (max 5MB)</p>
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
                {GALLERY_CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
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

          {/* Order */}
          <div>
            <Label htmlFor="order">Display Order</Label>
            <Input id="order" type="number" value={orderIndex} onChange={(e) => setOrderIndex(Number(e.target.value))} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={uploading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Add Item'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
