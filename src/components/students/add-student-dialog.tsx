'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, UserPlus } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'

// Menggunakan relative paths untuk keamanan impor
import { studentSchema, type StudentFormValues } from '../../lib/validators/student'
import { createClient } from '../../lib/supabase/client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { toast } from '../ui/use-toast'

export function AddStudentDialog() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()
  const supabase = createClient()

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: '',
      email: '',
      phone_number: '',
      base_fee: 0,
      class_year: new Date().getFullYear().toString(),
      status: 'active',
    },
  })

  async function onSubmit(values: StudentFormValues) {
    setIsSubmitting(true)
    try {
      // Mengambil user ID untuk kolom created_by (Audit Trail)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error("Sesi berakhir. Silakan login kembali.")

      // Perbaikan: Masukkan data sebagai objek tunggal dan tambahkan created_by
      const { error } = await supabase.from('students').insert({
        name: values.name,
        email: values.email || null,
        phone_number: values.phone_number || null,
        base_fee: values.base_fee,
        class_year: values.class_year || null,
        status: values.status,
        address: values.address || null,
        date_of_birth: values.date_of_birth || null,
        created_by: user.id // Menambahkan field wajib sesuai error TS
      })

      if (error) throw error

      toast({
        title: "Siswa Berhasil Ditambahkan",
        description: `${values.name} telah terdaftar dalam sistem.`,
      })
      
      queryClient.invalidateQueries({ queryKey: ['students'] })
      setOpen(false)
      form.reset()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal Menambah Siswa",
        description: error.message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Tambah Siswa Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrasi Siswa Baru</DialogTitle>
          <DialogDescription>
            Lengkapi data di bawah untuk mendaftarkan siswa ke sistem keuangan.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Ahmad Fauzi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="class_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Angkatan</FormLabel>
                    <FormControl>
                      <Input placeholder="2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="base_fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SPP Dasar (IDR)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="siswa@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Simpan Data
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}