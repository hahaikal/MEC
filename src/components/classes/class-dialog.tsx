'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTeachers } from '@/lib/hooks/use-teachers'
import { createClass, updateClass } from '@/actions/classes'
import { toast } from 'sonner'

export function ClassDialog({ classToEdit, children }: { classToEdit?: any, children?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(classToEdit?.name || '')
  const [targetMeetings, setTargetMeetings] = useState(classToEdit?.target_meetings?.toString() || '15')
  const [feePerMeeting, setFeePerMeeting] = useState(classToEdit?.fee_per_meeting?.toString() || '0')
  const [teacherId, setTeacherId] = useState(classToEdit?.teacher_id || 'none')
  const [loading, setLoading] = useState(false)

  const { data: teachers, isLoading: isLoadingTeachers } = useTeachers()
  const queryClient = useQueryClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      name,
      target_meetings: parseInt(targetMeetings) || 15,
      fee_per_meeting: parseFloat(feePerMeeting) || 0,
      teacher_id: teacherId === 'none' ? null : teacherId,
    }

    let result
    if (classToEdit) {
      result = await updateClass(classToEdit.id, payload)
    } else {
      result = await createClass(payload)
    }

    setLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(`Kelas berhasil ${classToEdit ? 'diperbarui' : 'dibuat'}!`)
      queryClient.invalidateQueries({ queryKey: ['classes'] })
      queryClient.invalidateQueries({ queryKey: ['students', 'classes'] }) // Also invalidate class list for dropdowns
      setOpen(false)
      if (!classToEdit) {
        setName('')
        setTargetMeetings('15')
        setTeacherId('none')
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || <Button>Tambah Kelas</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{classToEdit ? 'Edit Kelas' : 'Tambah Kelas Baru'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Kelas</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} required placeholder="Mis. Basic 1" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target">Target Pertemuan</Label>
            <Input id="target" type="number" min="1" value={targetMeetings} onChange={e => setTargetMeetings(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fee">Honor per Pertemuan (Rp)</Label>
            <Input id="fee" type="number" min="0" value={feePerMeeting} onChange={e => setFeePerMeeting(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label>Guru Pengajar</Label>
            <Select value={teacherId} onValueChange={setTeacherId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Guru" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Belum Ditentukan</SelectItem>
                {!isLoadingTeachers && teachers?.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.full_name || t.email}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading || !name}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
