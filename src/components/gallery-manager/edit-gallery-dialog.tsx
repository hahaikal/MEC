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

interface EditGalleryDialogProps {
  item: {
    id: string
    title: string
    description: string | null
    image_url: string
    category: string
    order_index: number
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditGalleryDialog({ item, open, onOpenChange }: EditGalleryDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [orderIndex, setOrderIndex] = useState(0)
  const updateMutation = useUpdateGalleryItem()

  useEffect(() => {
    if (item) {
      setTitle(item.title)
      setDescription(item.description || '')
      setCategory(item.category)
      setOrderIndex(item.order_index)
    }
  }, [item])

  const handleSubmit = async () => {
    if (!item || !title || !category) {
      toast.error('Please fill in all required fields.')
      return
    }

    const result = await updateMutation.mutateAsync({
      id: item.id,
      data: { title, description, category, order_index: orderIndex },
    })

    if ('error' in result && result.error) {
      toast.error(result.error)
    } else {
      toast.success('Gallery item updated!')
      onOpenChange(false)
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

        <div className="space-y-4 py-4">
          {/* Current Image Preview */}
          <div>
            <Label>Current Image</Label>
            <img src={item.image_url} alt={item.title} className="mt-2 h-40 w-full rounded-lg object-cover" />
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

          {/* Order */}
          <div>
            <Label htmlFor="edit-order">Display Order</Label>
            <Input id="edit-order" type="number" value={orderIndex} onChange={(e) => setOrderIndex(Number(e.target.value))} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
