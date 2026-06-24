'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Pencil, Upload, X } from 'lucide-react'
import { useInternalUsers } from '@/lib/hooks/use-users'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { uploadUserPhoto } from '@/lib/upload-user-photo'
import { useRef } from 'react'

export function EditUserDialog({ user }: { user: any }) {
  const [open, setOpen] = useState(false)
  const { updateUser } = useInternalUsers()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    full_name: user.full_name || '',
    role: user.role || 'staff',
    email: user.email || '',
    bio: user.bio || ''
  })
  
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(user.profile_picture_url || null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      let photoUrl = user.profile_picture_url
      if (file) {
        photoUrl = await uploadUserPhoto(file)
      }

      // We update the user details
      updateUser(
        { 
          id: user.id, 
          updates: { 
            full_name: formData.full_name, 
            role: formData.role,
            bio: formData.bio,
            ...(photoUrl !== user.profile_picture_url ? { profile_picture_url: photoUrl } : {})
          } 
        },
      {
        onSuccess: () => {
          toast.success('Pengguna berhasil diperbarui')
          setOpen(false)
          setLoading(false)
        },
        onError: (err: any) => {
          toast.error(err.message || 'Gagal memperbarui pengguna')
          setLoading(false)
        }
      }
    )
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengunggah foto profil')
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Pengguna</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4 px-1 max-h-[70vh] overflow-y-auto">
          {/* Photo Upload */}
          <div>
            <Label>Pas Foto</Label>
            {preview ? (
              <div className="relative mt-2 w-32 h-32 mx-auto">
                <img src={preview} alt="Preview" className="h-full w-full rounded-full object-cover border" />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-0 right-0 h-6 w-6 rounded-full"
                  type="button"
                  onClick={() => { setFile(null); setPreview(null) }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div
                className="mt-2 flex h-32 w-32 mx-auto cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50 transition"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="h-6 w-6 text-slate-400" />
                <p className="mt-1 text-[10px] text-slate-500">Upload</p>
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

          <div className="space-y-2">
            <Label>Nama Lengkap</Label>
            <Input
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              disabled
              className="bg-slate-50 text-slate-500"
            />
            <p className="text-xs text-muted-foreground">Email tidak dapat diubah setelah dibuat.</p>
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={formData.role} onValueChange={(val) => setFormData({...formData, role: val})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="teacher">Guru</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="director">Direktur</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Biodata Guru</Label>
            <Textarea
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              placeholder="Ceritakan singkat tentang guru ini..."
              rows={3}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Simpan Perubahan
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
