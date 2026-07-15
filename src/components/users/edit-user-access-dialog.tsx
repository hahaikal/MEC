'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { KeyRound, Loader2 } from 'lucide-react'
import { useInternalUsers } from '@/lib/hooks/use-users'
import { toast } from 'sonner'

export const SYSTEM_MENUS = [
  { id: '/dashboard', label: 'Dashboard' },
  { id: '/dashboard/students', label: 'Students' },
  { id: '/dashboard/attendance', label: 'Absensi & Kehadiran' },
  { id: '/dashboard/expenses', label: 'Expenses' },
  { id: '/dashboard/reports', label: 'Reports' },
  { id: '/dashboard/classes', label: 'Manajemen Kelas' },
  { id: '/dashboard/users', label: 'Manajemen Staff' },
  { id: '/dashboard/parent-hub-manager', label: 'Parent Hub' },
  { id: '/dashboard/teacher-workspace', label: 'Teacher Workspace' },
  { id: '/dashboard/settings', label: 'Settings' }
]

export function EditUserAccessDialog({ user }: { user: any }) {
  const [open, setOpen] = useState(false)
  const { updateUser, isUpdating } = useInternalUsers()
  
  // Default to empty array if null
  const initialMenus = user.allowed_menus || []
  const [selectedMenus, setSelectedMenus] = useState<string[]>(initialMenus)

  const handleSave = () => {
    updateUser({ id: user.id, updates: { allowed_menus: selectedMenus } }, {
      onSuccess: () => {
        toast.success('Hak akses berhasil diperbarui')
        setOpen(false)
      },
      onError: (err: any) => {
        toast.error(err.message || 'Gagal memperbarui hak akses')
      }
    })
  }

  const toggleMenu = (menuId: string, checked: boolean) => {
    if (checked) {
      setSelectedMenus(prev => [...prev, menuId])
    } else {
      setSelectedMenus(prev => prev.filter(id => id !== menuId))
    }
  }

  const selectAll = () => setSelectedMenus(SYSTEM_MENUS.map(m => m.id))
  const deselectAll = () => setSelectedMenus([])

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val)
      if (val) {
        setSelectedMenus(user.allowed_menus || [])
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border-indigo-200">
          <KeyRound className="h-4 w-4" />
          Akses
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Atur Hak Akses Menu</DialogTitle>
          <DialogDescription>
            Pilih menu sistem yang dapat diakses oleh <strong>{user.full_name || user.email}</strong>.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="text-sm font-medium">Pilih Menu</span>
            <div className="space-x-2">
              <Button variant="ghost" size="sm" onClick={selectAll} className="h-8 text-xs">Pilih Semua</Button>
              <Button variant="ghost" size="sm" onClick={deselectAll} className="h-8 text-xs text-muted-foreground">Reset</Button>
            </div>
          </div>
          
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {SYSTEM_MENUS.map((menu) => (
              <div key={menu.id} className="flex items-center space-x-3">
                <Checkbox 
                  id={`menu-${menu.id}`}
                  checked={selectedMenus.includes(menu.id)}
                  onCheckedChange={(checked) => toggleMenu(menu.id, checked as boolean)}
                />
                <Label htmlFor={`menu-${menu.id}`} className="font-normal cursor-pointer leading-none">
                  {menu.label} <span className="text-muted-foreground text-xs ml-1">({menu.id})</span>
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
          <Button onClick={handleSave} disabled={isUpdating}>
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Hak Akses
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
