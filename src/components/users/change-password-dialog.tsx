'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { KeyRound, Loader2 } from 'lucide-react'
import { useInternalUsers } from '@/lib/hooks/use-users'

export function ChangePasswordDialog({ user }: { user: any }) {
  const [open, setOpen] = useState(false)
  const { changePassword, isChangingPassword } = useInternalUsers()
  const [newPassword, setNewPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    changePassword(
      { targetUserId: user.id, newPassword },
      {
        onSuccess: () => {
          setOpen(false)
          setNewPassword('')
        }
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700" title="Ubah Password">
          <KeyRound className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ubah Password Pengguna</DialogTitle>
          <DialogDescription>
            Ubah password untuk {user.full_name || user.email}. Pastikan password baru kuat dan aman.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Password Baru</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Minimal 6 karakter"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isChangingPassword}>
            {isChangingPassword ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Simpan Password
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
