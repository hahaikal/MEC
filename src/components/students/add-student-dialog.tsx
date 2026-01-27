'use client'

import React from "react"

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useClasses } from '@/lib/hooks/use-students'
import { useAuth } from '@/lib/auth/use-auth'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/lib/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface AddStudentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddStudentDialog({ open, onOpenChange }: AddStudentDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    programId: '',
  })
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const supabase = createClient()
  const { user } = useAuth()

  // Fetch classes
  const { data: classes, isLoading: classesLoading } = useClasses()

  // Create student mutation
  const { mutate: createStudent, isPending } = useMutation({
    mutationFn: async () => {
      // First, create the student
      const { data: student, error: studentError } = await supabase
        .from('students')
        .insert([
          {
            name: formData.name,
            email: formData.email || null,
            phone_number: formData.phoneNumber,
            status: 'active',
            created_by: user!.id,
          },
        ])
        .select()
        .single()

      if (studentError) throw studentError

      // Then, enroll the student in the selected program
      if (formData.programId && student) {
        const { error: enrollError } = await supabase
          .from('student_programs')
          .insert([
            {
              student_id: student.id,
              program_id: formData.programId,
              status: 'active',
            },
          ])

        if (enrollError) throw enrollError
      }

      return student
    },
    onSuccess: () => {
      toast({
        title: 'Sukses',
        description: 'Siswa baru berhasil ditambahkan',
      })
      queryClient.invalidateQueries({ queryKey: ['students'] })
      queryClient.invalidateQueries({ queryKey: ['student-programs'] })
      setFormData({ name: '', email: '', phoneNumber: '', programId: '' })
      onOpenChange(false)
    },
    onError: (error) => {
      console.error('Error creating student:', error)
      toast({
        title: 'Error',
        description: 'Gagal menambahkan siswa',
        variant: 'destructive',
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: 'Error',
        description: 'User tidak terautentikasi',
        variant: 'destructive',
      })
      return
    }
    if (!formData.name || !formData.phoneNumber || !formData.programId) {
      toast({
        title: 'Validasi Gagal',
        description: 'Mohon isi Nama Lengkap, No HP, dan Kelas',
        variant: 'destructive',
      })
      return
    }
    createStudent()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Siswa Baru</DialogTitle>
          <DialogDescription>
            Isi data siswa baru untuk mendaftarkan mereka di sistem
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Nama Lengkap */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nama Lengkap *</Label>
            <Input
              id="name"
              placeholder="Contoh: Budi Santoso"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={isPending}
            />
          </div>

          {/* Email (Optional) */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email (Opsional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="budi@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              disabled={isPending}
            />
          </div>

          {/* No HP */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">No HP *</Label>
            <Input
              id="phone"
              placeholder="08123456789"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              disabled={isPending}
            />
          </div>

          {/* Pilihan Kelas */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="program">Pilih Kelas *</Label>
            <Select
              value={formData.programId}
              onValueChange={(value) =>
                setFormData({ ...formData, programId: value })
              }
              disabled={isPending || classesLoading}
            >
              <SelectTrigger id="program">
                <SelectValue placeholder="Pilih kelas" />
              </SelectTrigger>
              <SelectContent>
                {classes?.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
