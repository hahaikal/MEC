'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { studentSchema, type StudentFormValues } from '@/lib/validators/student'
import { useCreateStudent, useUpdateStudent } from '@/lib/hooks/use-mutations'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface StudentFormProps {
  initialData?: any 
  onSuccess?: () => void
}

export function StudentForm({ initialData, onSuccess }: StudentFormProps) {
  const createStudent = useCreateStudent()
  const updateStudent = useUpdateStudent()

  const isEditing = !!initialData
  const isLoading = createStudent.isPending || updateStudent.isPending

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: initialData ? {
      ...initialData,
      // Pastikan field optional memiliki fallback string kosong jika null
      class_name: initialData.class_name || '',
      nis: initialData.nis || '',
      email: initialData.email || '',
      phone_number: initialData.phone_number || '',
      parent_name: initialData.parent_name || '',
      parent_phone: initialData.parent_phone || '',
      address: initialData.address || '',
    } : {
      name: '',
      email: '',
      phone_number: '',
      nis: '',
      class_name: '',
      class_year: new Date().getFullYear().toString(),
      status: 'ACTIVE',
      parent_name: '',
      parent_phone: '',
      address: '',
      base_fee: 0,
      billing_cycle_date: 10,
    },
  })

  async function onSubmit(data: StudentFormValues) {
    try {
      if (isEditing) {
        await updateStudent.mutateAsync({ id: initialData.id, data })
      } else {
        await createStudent.mutateAsync(data)
      }
      
      if (!isEditing) {
        form.reset()
      }

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Data Pribadi */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Data Siswa</h3>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama siswa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="nis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIS</FormLabel>
                    <FormControl>
                      <Input placeholder="NIS" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="class_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kelas</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: 10 IPA 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
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
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Aktif</SelectItem>
                          <SelectItem value="GRADUATED">Lulus</SelectItem>
                          <SelectItem value="DROPOUT">Keluar</SelectItem>
                          <SelectItem value="ON_LEAVE">Cuti</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
          </div>

          {/* Data Kontak & Wali */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Kontak & Wali</h3>
            
            <FormField
              control={form.control}
              name="parent_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Orang Tua/Wali</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama orang tua" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

             <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No. HP Siswa</FormLabel>
                  <FormControl>
                    <Input placeholder="08..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="parent_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No. HP Wali</FormLabel>
                  <FormControl>
                    <Input placeholder="08..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="base_fee"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Biaya SPP Dasar (Rp)</FormLabel>
                    <FormControl>
                    <Input 
                        type="number" 
                        placeholder="0" 
                        {...field} 
                        onChange={e => field.onChange(Number(e.target.value))}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="billing_cycle_date"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Tanggal Tagihan (Setiap bulan)</FormLabel>
                    <FormControl>
                    <Input 
                        type="number" 
                        min={1} 
                        max={28} 
                        placeholder="10" 
                        {...field} 
                        onChange={e => field.onChange(Number(e.target.value))}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat Lengkap</FormLabel>
              <FormControl>
                <Textarea placeholder="Alamat siswa..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Simpan Perubahan' : 'Tambah Siswa'}
          </Button>
        </div>
      </form>
    </Form>
  )
}