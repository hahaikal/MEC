'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Pencil } from 'lucide-react'
import { useInternalUsers } from '@/lib/hooks/use-users'
import { toast } from 'sonner'

export function EditUserDialog({ user }: { user: any }) {
  const [open, setOpen] = useState(false)
  const { updateUser } = useInternalUsers()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    full_name: user.full_name || '',
    role: user.role || 'staff',
    email: user.email || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // We update the user details
    updateUser(
      { id: user.id, updates: { full_name: formData.full_name, role: formData.role } },
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
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Simpan Perubahan
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
