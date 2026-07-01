'use client'

import { useState, useRef } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { studentSchema, type StudentFormValues } from '@/lib/validators/student'
import { AvatarUpload } from './avatar-upload'
import { uploadStudentPhoto } from '@/lib/upload-student-photo'
import { updateStudentPhoto } from '@/actions/students'
import { useCreateStudent, useUpdateStudent } from '@/lib/hooks/use-mutations'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'
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
import { useClassList } from '@/lib/hooks/use-students-by-class'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

interface StudentFormProps {
  initialData?: any 
  onSuccess?: () => void
}

function ClassOptions() {
  const { data: classes, isLoading } = useClassList()
  if (isLoading) return <SelectItem value="loading" disabled>Loading...</SelectItem>
  if (!classes || classes.length === 0) return <SelectItem value="empty" disabled>No classes found</SelectItem>
  return (
    <>
      {classes.map((c: any) => (
        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
      ))}
    </>
  )
}

export function StudentForm({ initialData, onSuccess }: StudentFormProps) {
  const createStudent = useCreateStudent()
  const updateStudent = useUpdateStudent()

  const isEditing = !!initialData
  const isLoading = createStudent.isPending || updateStudent.isPending
  const [pendingPhotoFile, setPendingPhotoFile] = useState<File | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialData?.photo_url || null)
  
  const [showConfirm, setShowConfirm] = useState(false)
  const [formDataToSubmit, setFormDataToSubmit] = useState<StudentFormValues | null>(null)

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: initialData ? {
      ...initialData,
      // Pastikan field optional memiliki fallback string kosong jika null
      class_id: initialData.class_id || '',
      phone_number: initialData.phone_number || '',
      father_name: initialData.father_name || '',
      mother_name: initialData.mother_name || '',
      father_occupation: initialData.father_occupation || '',
      mother_occupation: initialData.mother_occupation || '',
      parent_phone: initialData.parent_phone || '',
      address: initialData.address || '',
      place_of_birth: initialData.place_of_birth || '',
      date_of_birth: initialData.date_of_birth || '',
      gender: initialData.gender || 'MALE',
      religion: initialData.religion || '',
      school_origin: initialData.school_origin || '',
      joined_since_class: initialData.joined_since_class || '',
      enrollment_date: initialData.enrollment_date || '',
      enrollments: initialData.enrollments && initialData.enrollments.length > 0 
        ? initialData.enrollments.map((enr: any) => ({
            class_id: enr.class_id,
            base_fee: enr.base_fee ?? 375000,
          }))
        : [],
    } : {
      name: '',
      place_of_birth: '',
      date_of_birth: '',
      gender: 'MALE',
      religion: '',
      address: '',
      phone_number: '',
      school_origin: '',
      joined_since_class: '',
      father_occupation: '',
      mother_occupation: '',
      parent_phone: '',
      enrollments: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "enrollments"
  })

  const onSubmit = (data: StudentFormValues) => {
    setFormDataToSubmit(data)
    setShowConfirm(true)
  }

  const executeSubmit = async () => {
    if (!formDataToSubmit) return
    const data = formDataToSubmit
    
    try {
      if (isEditing) {
        await updateStudent.mutateAsync({ id: initialData.id, data })
        
        // If there's a new photo to upload
        if (pendingPhotoFile) {
          try {
            const publicUrl = await uploadStudentPhoto(pendingPhotoFile, initialData.id)
            await updateStudentPhoto(initialData.id, publicUrl)
            toast.success('Foto profil berhasil diperbarui!')
          } catch (photoError) {
            console.error('Photo upload failed:', photoError)
            toast.error('Gagal mengunggah foto profil.')
          }
        }
        
        toast.success('Data siswa berhasil diperbarui!')
      } else {
        const result = await createStudent.mutateAsync(data)
        
        // If there's a pending photo for the new student, upload it now
        if (pendingPhotoFile && result && 'studentId' in result && result.studentId) {
          try {
            const publicUrl = await uploadStudentPhoto(pendingPhotoFile, result.studentId)
            await updateStudentPhoto(result.studentId, publicUrl)
            toast.success('Foto profil siswa berhasil diunggah!')
          } catch (photoError) {
            console.error('Photo upload after create failed:', photoError)
            toast.error('Gagal mengunggah foto profil.')
          }
        }
        
        toast.success('Siswa baru berhasil ditambahkan!')
      }
      
      if (!isEditing) {
        form.reset()
        setPendingPhotoFile(null)
        setPhotoUrl(null)
      }

      setShowConfirm(false)
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error?.message || 'Gagal menyimpan data siswa.')
      setShowConfirm(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* SECTION: DATA PRIBADI */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Biodata Siswa</h3>

          {/* Avatar Upload */}
          <div className="flex justify-center py-2">
            <AvatarUpload
              studentId={isEditing ? initialData.id : null}
              studentName={form.watch('name') || 'Siswa'}
              currentPhotoUrl={photoUrl}
              onPhotoUploaded={(url) => setPhotoUrl(url)}
              onFileSelected={(file) => setPendingPhotoFile(file)}
              size="lg"
            />
          </div>

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
                      <SelectItem value="CHRISTIANITY">Christianity</SelectItem>
                      <SelectItem value="CATHOLICISM">Catholicism</SelectItem>
                      <SelectItem value="HINDUISM">Hinduism</SelectItem>
                      <SelectItem value="BUDDHISM">Buddhism</SelectItem>
                      <SelectItem value="CONFUCIANISM">Confucianism</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
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
              name="joined_since_class"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Masuk Sejak Kelas?</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Basic 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </div>
        </div>

        {/* SECTION: DATA KELAS & KEUANGAN */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-lg font-semibold">Kelas & Biaya Pendidikan</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ class_id: '', base_fee: 375000 })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kelas
            </Button>
          </div>
          
          {fields.length === 0 && (
            <div className="text-center py-6 border border-dashed rounded-lg text-neutral-500">
              Belum ada kelas yang dipilih. Klik &quot;Tambah Kelas&quot; untuk mendaftarkan siswa ke kelas.
            </div>
          )}

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-xl bg-neutral-50 flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <FormField
                    control={form.control}
                    name={`enrollments.${index}.class_id`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel>Pilih Kelas</FormLabel>
                        <FormControl>
                          <Select onValueChange={f.onChange} value={f.value || ''}>
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Pilih Kelas" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <ClassOptions />
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="w-full md:w-48">
                  <FormField
                    control={form.control}
                    name={`enrollments.${index}.base_fee`}
                    render={({ field: f }) => (
                    <FormItem>
                        <FormLabel>Biaya SPP (Rp)</FormLabel>
                        <FormControl>
                        <Input 
                            className="bg-white"
                            type="number" 
                            placeholder="0"
                            {...f} 
                            onChange={e => f.onChange(Number(e.target.value))}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                  />
                </div>
                
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon" 
                  className="mb-[2px] shrink-0" 
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION: DATA ORANG TUA */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Data Orang Tua / Wali</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="father_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Ayah</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama Ayah" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mother_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Ibu</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama Ibu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="father_occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pekerjaan Ayah</FormLabel>
                  <FormControl>
                    <Input placeholder="Pekerjaan Ayah" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mother_occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pekerjaan Ibu</FormLabel>
                  <FormControl>
                    <Input placeholder="Pekerjaan Ibu" {...field} />
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
                    <Input placeholder="+62 8..." {...field} />
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
                    <Input placeholder="+62 8..." {...field} />
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
      
      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title={isEditing ? "Simpan Perubahan?" : "Tambah Siswa?"}
        description={isEditing 
          ? "Apakah Anda yakin ingin menyimpan perubahan data siswa ini?" 
          : "Apakah Anda yakin ingin menambahkan siswa baru dengan data ini?"}
        onConfirm={executeSubmit}
        isProcessing={isLoading}
      />
    </Form>
  )
}