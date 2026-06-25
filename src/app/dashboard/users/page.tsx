'use client'

import React, { useState } from 'react'
import { useInternalUsers } from '@/lib/hooks/use-users'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { UserPlus, Ban, Loader2, CheckCircle2 } from 'lucide-react'
import { EditUserDialog } from '@/components/users/edit-user-dialog'

export default function UsersPage() {
  const { users, isLoading, createUser, isCreating, updateUser, deleteUser } = useInternalUsers()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    roles: ['Staff']
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createUser(formData, {
      onSuccess: () => {
        setIsDialogOpen(false)
        setFormData({ email: '', password: '', full_name: '', roles: ['Staff'] })
      }
    })
  }

  const toggleStatus = (id: string, currentStatus: boolean) => {
    updateUser({ id, updates: { is_active: !currentStatus } })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Internal</h1>
          <p className="text-muted-foreground">
            Kelola staff, guru, manajer, dan direktur sistem ini.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Tambah Pengguna
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Pengguna Baru</DialogTitle>
              <DialogDescription className="sr-only">Formulir untuk menambah pengguna baru</DialogDescription>
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
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Password Sementara</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label>Roles</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['Teacher', 'Principal', 'Head of Department', 'Director', 'Admin', 'Manager', 'Staff'].map((roleItem) => (
                    <div key={roleItem} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`new-role-${roleItem}`} 
                        checked={formData.roles.includes(roleItem)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({...formData, roles: [...formData.roles, roleItem]})
                          } else {
                            setFormData({...formData, roles: formData.roles.filter(r => r !== roleItem)})
                          }
                        }}
                      />
                      <Label htmlFor={`new-role-${roleItem}`} className="font-normal cursor-pointer">{roleItem}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isCreating}>
                {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Simpan
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Belum ada data pengguna.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name || '-'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles && user.roles.length > 0 ? (
                        user.roles.map((r: string) => (
                          <Badge key={r} variant="outline" className="capitalize">
                            {r}
                          </Badge>
                        ))
                      ) : user.role ? (
                        <Badge variant="outline" className="capitalize">
                          {user.role}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.is_active ? (
                       <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Aktif</Badge>
                    ) : (
                       <Badge variant="secondary" className="bg-slate-100 text-slate-800 hover:bg-slate-100">Non-Aktif</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <EditUserDialog user={user} />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStatus(user.id, user.is_active)}
                        className={user.is_active ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                      >
                        {user.is_active ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
