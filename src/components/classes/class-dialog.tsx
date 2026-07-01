'use client'

import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useTeachers } from '@/lib/hooks/use-teachers'
import { createClass, updateClass } from '@/actions/classes'
import { toast } from 'sonner'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { Plus, X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ClassDialog({ classToEdit, children }: { classToEdit?: any, children?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(classToEdit?.name || '')
  const [scheduleDays, setScheduleDays] = useState<string[]>(classToEdit?.schedule_days || [])
  const [teacherIds, setTeacherIds] = useState<string[]>(classToEdit?.teachers?.map((t: any) => t.id) || [])
  const [programId, setProgramId] = useState(classToEdit?.program_id || 'none')
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    if (open) {
      setName(classToEdit?.name || '')
      setScheduleDays(classToEdit?.schedule_days || [])
      setTeacherIds(classToEdit?.teachers?.map((t: any) => t.id) || [])
      setProgramId(classToEdit?.program_id || 'none')
    }
  }, [open, classToEdit])

  const { data: teachers, isLoading: isLoadingTeachers } = useTeachers()
  const supabase = createClient()
  const { data: programs, isLoading: isLoadingPrograms } = useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('programs').select('* ').eq('is_active', true)
      if (error) throw error
      return data
    }
  })
  const queryClient = useQueryClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      name,
      schedule_days: scheduleDays.length > 0 ? scheduleDays : null,
      program_id: programId === 'none' ? null : programId,
      teacher_ids: teacherIds,
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
      queryClient.invalidateQueries({ queryKey: ['class_list_simple'] })
      queryClient.invalidateQueries({ queryKey: ['students', 'classes'] }) // Also invalidate class list for dropdowns
      setOpen(false)
      if (!classToEdit) {
        setName('')
        setScheduleDays([])
        setTeacherIds([])
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
            <Label>Jadwal Hari</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {[
                { id: 'Monday', label: 'Senin' },
                { id: 'Tuesday', label: 'Selasa' },
                { id: 'Wednesday', label: 'Rabu' },
                { id: 'Thursday', label: 'Kamis' },
                { id: 'Friday', label: 'Jumat' },
                { id: 'Saturday', label: 'Sabtu' },
                { id: 'Sunday', label: 'Minggu' }
              ].map(day => (
                <div key={day.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`day-${day.id}`} 
                    checked={scheduleDays.includes(day.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setScheduleDays([...scheduleDays, day.id])
                      } else {
                        setScheduleDays(scheduleDays.filter(d => d !== day.id))
                      }
                    }}
                  />
                  <Label htmlFor={`day-${day.id}`} className="font-normal cursor-pointer">{day.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
          <div className="space-y-2">
            <Label>Program</Label>
            <Select value={programId} onValueChange={setProgramId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Belum Ditentukan</SelectItem>
                {!isLoadingPrograms && programs?.map((p: any) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          </div>

          <div className="space-y-2">
            <Label>Guru Pengajar</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {teacherIds.map((id) => {
                const teacher = teachers?.find((t) => t.id === id)
                if (!teacher) return null
                return (
                  <Badge key={id} variant="secondary" className="flex items-center gap-1.5 px-3 py-1 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-full border-blue-200">
                    {teacher.full_name || teacher.email}
                    <button
                      type="button"
                      onClick={() => setTeacherIds(teacherIds.filter((tid) => tid !== id))}
                      className="ml-1 rounded-full p-0.5 hover:bg-blue-200 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )
              })}
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="w-full justify-start border-dashed">
                  <Plus className="mr-2 h-4 w-4" />
                  + Tambah Guru
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Cari nama guru..." />
                  <CommandList>
                    <CommandEmpty>Tidak ada guru yang ditemukan.</CommandEmpty>
                    <CommandGroup>
                      {!isLoadingTeachers && teachers?.map((t) => {
                        const isSelected = teacherIds.includes(t.id)
                        return (
                          <CommandItem
                            key={t.id}
                            onSelect={() => {
                              if (isSelected) {
                                setTeacherIds(teacherIds.filter((id) => id !== t.id))
                              } else {
                                setTeacherIds([...teacherIds, t.id])
                              }
                            }}
                          >
                            <div className="flex flex-1 items-center justify-between">
                              <span>{t.full_name || t.email}</span>
                              {isSelected && <Check className="h-4 w-4 text-[color:var(--mec-blue)]" />}
                            </div>
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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
