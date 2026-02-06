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
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useClasses } from "@/lib/hooks/use-mutations" 
import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

// Skema validasi
const studentSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  phone_number: z.string().optional(),
  parent_name: z.string().optional(),
  parent_phone: z.string().optional(),
  address: z.string().optional(),
  date_of_birth: z.string().optional(), // String YYYY-MM-DD
  status: z.enum(["ACTIVE", "GRADUATED", "DROPOUT", "ON_LEAVE"]).default("ACTIVE"),
  class_id: z.string().optional(),
  program_id: z.string().min(1, "Program wajib dipilih"), // Program wajib untuk enrollment awal
  base_fee: z.coerce.number().min(0, "Biaya bulanan tidak boleh negatif"),
  billing_cycle_date: z.coerce.number().min(1).max(28).default(10),
  nis: z.string().optional(),
})

export type StudentFormValues = z.infer<typeof studentSchema>

interface StudentFormProps {
  defaultValues?: Partial<StudentFormValues>
  onSubmit: (data: StudentFormValues) => void
  isLoading?: boolean
}

export function StudentForm({ defaultValues, onSubmit, isLoading }: StudentFormProps) {
  const supabase = createClient()

  // Fetch Classes
  const { data: classesData } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const { data, error } = await supabase.from('classes').select('*').order('name')
      if (error) throw error
      return data
    }
  })

  // Fetch Programs (Active only)
  const { data: programsData } = useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('programs').select('*').eq('is_active', true).order('name')
      if (error) throw error
      return data
    }
  })

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      parent_name: "",
      parent_phone: "",
      address: "",
      status: "ACTIVE",
      base_fee: 0,
      billing_cycle_date: 10,
      nis: "",
      ...defaultValues,
    },
  })

  // Set default price based on selected program IF base_fee is 0/empty
  // Ini opsional, jika user ingin harga otomatis dari program, tapi tetap bisa diedit
  const selectedProgramId = form.watch("program_id")
  
  useEffect(() => {
    if (selectedProgramId && programsData && form.getValues("base_fee") === 0) {
      const program = programsData.find(p => p.id === selectedProgramId)
      if (program) {
        // Asumsi harga program bisa jadi referensi awal
        form.setValue("base_fee", Number(program.price))
      }
    }
  }, [selectedProgramId, programsData, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Informasi Pribadi */}
          <div className="space-y-4 border p-4 rounded-md">
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">Data Pribadi</h3>
            
            <FormField
              control={form.control}
              name="nis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIS (Nomor Induk Siswa)</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: 2024001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama siswa" {...field} />
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
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
          </div>

          {/* Informasi Kontak Orang Tua */}
          <div className="space-y-4 border p-4 rounded-md">
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">Kontak & Orang Tua</h3>
            
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
                  <FormLabel>No. HP Orang Tua (WA)</FormLabel>
                  <FormControl>
                    <Input placeholder="0812..." {...field} />
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
                    <Input placeholder="0812..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Informasi Akademik & Keuangan */}
        <div className="border p-4 rounded-md space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground mb-2">Akademik & Keuangan</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="class_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kelas Fisik</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Kelas" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classesData?.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="program_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Pendidikan *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Program" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {programsData?.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Program menentukan kurikulum yang diambil siswa.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="base_fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biaya Bulanan (SPP) *</FormLabel>
                  <FormControl>
                    {/* Fix: Handle NaN by converting null/undefined to empty string for display, but number for logic */}
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">Rp</span>
                      <Input 
                        type="number" 
                        className="pl-10" 
                        placeholder="0" 
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)} 
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Harga SPP khusus untuk siswa ini (unik).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billing_cycle_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Tagihan</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      max={28} 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Tanggal jatuh tempo setiap bulan (1-28).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Simpan Data Siswa
        </Button>
      </form>
    </Form>
  )
}