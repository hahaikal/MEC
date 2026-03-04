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
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

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
      email: initialData.email || '',
      phone_number: initialData.phone_number || '',
      parent_name: initialData.parent_name || '',
      parent_phone: initialData.parent_phone || '',
      address: initialData.address || '',
      place_of_birth: initialData.place_of_birth || '',
      date_of_birth: initialData.date_of_birth || '',
      gender: initialData.gender || 'MALE',
      religion: initialData.religion || '',
      school_origin: initialData.school_origin || '',
      parent_occupation: initialData.parent_occupation || '',
    } : {
      name: '',
      place_of_birth: '',
      date_of_birth: '',
      gender: 'MALE',
      religion: '',
      address: '',
      email: '',
      phone_number: '',
      school_origin: '',
      class_name: '',
      parent_name: '',
      parent_occupation: '',
      parent_phone: '',
      base_fee: 0,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* SECTION: DATA PRIBADI */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Biodata Siswa</h3>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap</FormLabel>
                <FormControl>
                  <Input placeholder="Nama Lengkap Siswa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="place_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempat Lahir</FormLabel>
                  <FormControl>
                    <Input placeholder="Kota Lahir" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Lahir</FormLabel>
                  <FormControl>
                     <Input
                       type="date"
                       placeholder="Tanggal Lahir"
                       {...field}
                       value={field.value ? format(new Date(field.value), "yyyy-MM-dd") : ""}
                       onChange={(e) => field.onChange(e.target.value)}
                     />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Kelamin</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Jenis Kelamin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MALE">Laki-laki</SelectItem>
                      <SelectItem value="FEMALE">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="religion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agama</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Agama" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ISLAM">Islam</SelectItem>
                      <SelectItem value="KRISTEN">Kristen</SelectItem>
                      <SelectItem value="KATOLIK">Katolik</SelectItem>
                      <SelectItem value="HINDU">Hindu</SelectItem>
                      <SelectItem value="BUDDHA">Buddha</SelectItem>
                      <SelectItem value="KONGHUCU">Konghucu</SelectItem>
                      <SelectItem value="LAINNYA">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Textarea placeholder="Jalan, RT/RW, Kelurahan, Kecamatan..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* SECTION: DATA AKADEMIK */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Data Akademik</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="school_origin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sekolah Asal</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama Sekolah Asal" {...field} />
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
                  <FormLabel>Kelas Saat Ini (Masuk)</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Kelas" /></SelectTrigger></FormControl><SelectContent><SelectItem value="10 IPA 1">10 IPA 1</SelectItem><SelectItem value="10 IPS 1">10 IPS 1</SelectItem><SelectItem value="11 IPA 1">11 IPA 1</SelectItem><SelectItem value="11 IPS 1">11 IPS 1</SelectItem><SelectItem value="12 IPA 1">12 IPA 1</SelectItem><SelectItem value="12 IPS 1">12 IPS 1</SelectItem></SelectContent></Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isEditing && (
              <FormField
                control={form.control}
                name="enrollment_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Masuk / Gabung</FormLabel>
                    <FormControl>
                       <Input
                         type="date"
                         {...field}
                         value={field.value ? format(new Date(field.value), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")}
                         onChange={(e) => field.onChange(e.target.value)}
                       />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        {/* SECTION: DATA ORANG TUA */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Data Orang Tua / Wali</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="parent_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Orang Tua</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama Ayah/Ibu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parent_occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pekerjaan Orang Tua</FormLabel>
                  <FormControl>
                    <Input placeholder="Pekerjaan" {...field} />
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
                  <FormLabel>No. HP Orang Tua</FormLabel>
                  <FormControl>
                    <Input placeholder="08..." {...field} />
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
                  <FormLabel>No. HP Siswa (Opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="08..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Siswa (Opsional)</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="contoh@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* SECTION: KEUANGAN */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Pengaturan Keuangan</h3>
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
          </div>
        </div>

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