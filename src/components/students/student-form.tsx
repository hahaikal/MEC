"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createStudent, updateStudent } from "@/actions/students"
import { useToast } from "@/components/ui/use-toast" // atau path hook toast yang sesuai di projectmu
import { useState } from "react"
import { Loader2 } from "lucide-react"

// Schema validasi yang diperbarui agar lebih robust
const studentSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  nis: z.string().optional(),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  phone_number: z.string().optional(),
  parent_name: z.string().optional(),
  parent_phone: z.string().optional(),
  address: z.string().optional(),
  status: z.string().default("ACTIVE"),
  class_year: z.string().optional(),
  base_fee: z.string().or(z.number()).transform((val) => Number(val) || 0),
})

interface StudentFormProps {
  initialData?: any // Data siswa untuk mode Edit
  onSuccess?: () => void
}

export function StudentForm({ initialData, onSuccess }: StudentFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  // Inisialisasi default values, memastikan tidak ada field yang undefined
  const defaultValues = {
    name: initialData?.name || "",
    nis: initialData?.nis || "",
    email: initialData?.email || "",
    phone_number: initialData?.phone_number || "",
    parent_name: initialData?.parent_name || "",
    parent_phone: initialData?.parent_phone || "",
    address: initialData?.address || "",
    status: initialData?.status || "ACTIVE",
    class_year: initialData?.class_year || "",
    base_fee: initialData?.base_fee || 0,
  }

  const form = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues,
  })

  // Fungsi onSubmit yang menangani Create (jika tidak ada ID) dan Update (jika ada ID)
  async function onSubmit(values: z.infer<typeof studentSchema>) {
    setLoading(true)
    try {
      if (initialData?.id) {
        // Mode Edit
        await updateStudent(initialData.id, values)
        toast({
          title: "Berhasil",
          description: "Data siswa berhasil diperbarui",
        })
      } else {
        // Mode Create
        await createStudent(values)
        toast({
          title: "Berhasil",
          description: "Siswa baru berhasil ditambahkan",
        })
      }
      onSuccess?.()
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Gagal",
        description: "Terjadi kesalahan saat menyimpan data",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          
          <FormField
            control={form.control}
            name="nis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NIS</FormLabel>
                <FormControl>
                  <Input placeholder="Nomor Induk Siswa" {...field} />
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

           <FormField
            control={form.control}
            name="base_fee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SPP Bulanan (Base Fee)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                    <Input placeholder="email@contoh.com" {...field} />
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
        </div>

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
        </div>

        <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Alamat</FormLabel>
                <FormControl>
                <Input placeholder="Alamat lengkap" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Data
          </Button>
        </div>
      </form>
    </Form>
  )
}