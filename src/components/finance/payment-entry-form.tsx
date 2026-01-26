'use client'

import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { Loader2, Check, User, Calculator } from 'lucide-react'

// Hooks & UI
import { useStudents } from '@/lib/hooks/use-students'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast' // Pastikan hook toast sudah ada

// --- SCHEMA VALIDATION ---
const paymentSchema = z.object({
  studentId: z.string().min(1, "Silakan pilih murid terlebih dahulu"),
  months: z.array(z.string()).refine((value) => value.length > 0, {
    message: "Pilih minimal satu bulan pembayaran",
  }),
})

type PaymentFormValues = z.infer<typeof paymentSchema>

// --- CONSTANTS (Bisa dipindah ke config/constants) ---
const MONTHS_LIST = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
]

export function PaymentEntryForm() {
  const { data: students, isLoading: isLoadingStudents } = useStudents()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Setup Form
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      studentId: "",
      months: [],
    },
  })

  // --- LOGIC SIMULASI HARGA (Nantinya logic ini bisa dari Backend/API) ---
  // Kita pantau perubahan pada field 'studentId' dan 'months'
  const selectedStudentId = form.watch("studentId")
  const selectedMonths = form.watch("months")

  const billingDetails = useMemo(() => {
    if (!selectedStudentId || !students) return null

    // Cari data student yang dipilih
    const student = students.find((s) => s.id === selectedStudentId)
    
    // CONTOH LOGIKA DISKON:
    // Misalnya, jika backend mengirim flag 'has_scholarship' atau sejenisnya.
    // Di sini saya hardcode simulasi: Jika nama mengandung 'A', dia dapat diskon.
    // Nanti ganti dengan: const isDiscount = student?.payment_type === 'DISCOUNT'
    const isDiscount = student?.full_name?.includes("a") || false 
    
    const basePrice = 500000 // Harga Normal
    const discountPrice = 350000 // Harga Diskon
    
    const pricePerMonth = isDiscount ? discountPrice : basePrice
    const totalAmount = pricePerMonth * selectedMonths.length

    return {
      studentName: student?.full_name,
      pricePerMonth,
      isDiscount,
      totalAmount,
      count: selectedMonths.length
    }
  }, [selectedStudentId, selectedMonths, students])


  // --- HANDLER SUBMIT ---
  async function onSubmit(data: PaymentFormValues) {
    setIsSubmitting(true)
    
    // Simulasi API Call
    setTimeout(() => {
      console.log("Submit Data:", { ...data, total: billingDetails?.totalAmount })
      
      toast({
        title: "Pembayaran Berhasil Disimpan",
        description: `Total Rp ${billingDetails?.totalAmount.toLocaleString('id-ID')} untuk ${billingDetails?.studentName}`,
      })

      form.reset({ studentId: "", months: [] })
      setIsSubmitting(false)
    }, 1500)
  }

  // Format Mata Uang
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number)
  }

  return (
    <div className="flex justify-center p-4 lg:p-8">
      <Card className="w-full max-w-4xl shadow-md border-t-4 border-t-primary">
        <CardHeader className="bg-muted/20">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl">Input Pembayaran SPP</CardTitle>
              <CardDescription>
                Pilih murid dan bulan tagihan untuk kalkulasi otomatis.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* LAYOUT GRID: Kiri (Input), Kanan (Summary) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* KOLOM KIRI: INPUT DATA */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* 1. PILIH MURID */}
                  <FormField
                    control={form.control}
                    name="studentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Murid</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          disabled={isLoadingStudents}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={isLoadingStudents ? "Memuat data..." : "Pilih nama murid..."} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {students?.map((student: any) => (
                              <SelectItem key={student.id} value={student.id}>
                                {student.full_name || "Tanpa Nama"} 
                                <span className="text-muted-foreground ml-2 text-xs">
                                  ({student.grade || "Kelas ?"})
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 2. PILIH BULAN (CHECKBOX GRID) */}
                  <FormField
                    control={form.control}
                    name="months"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Pilih Bulan Pembayaran</FormLabel>
                          <FormDescription>
                            Anda bisa memilih lebih dari satu bulan sekaligus.
                          </FormDescription>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {MONTHS_LIST.map((month) => (
                            <FormField
                              key={month}
                              control={form.control}
                              name="months"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={month}
                                    className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm transition-colors hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(month)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, month])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== month
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer w-full">
                                      {month}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* KOLOM KANAN: RINGKASAN TAGIHAN (Sticky) */}
                <div className="lg:col-span-1">
                  <div className="sticky top-6">
                    <Card className="bg-slate-50 dark:bg-slate-900 border-dashed">
                      <CardHeader>
                        <CardTitle className="text-lg">Ringkasan Tagihan</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        
                        {/* DETAIL MURID */}
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Murid</p>
                          <div className="font-medium flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            {billingDetails?.studentName || "-"}
                          </div>
                        </div>

                        <Separator />

                        {/* STATUS HARGA */}
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Tipe Biaya</p>
                          <div className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                            billingDetails?.isDiscount 
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          )}>
                            {billingDetails?.isDiscount ? "Beasiswa / Diskon" : "Reguler"}
                          </div>
                        </div>

                        <Separator />

                        {/* KALKULASI */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Harga/Bulan</span>
                            <span>{formatRupiah(billingDetails?.pricePerMonth || 0)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Jumlah Bulan</span>
                            <span>x {billingDetails?.count || 0}</span>
                          </div>
                        </div>

                        <Separator className="my-2" />
                        
                        {/* TOTAL */}
                        <div className="flex justify-between items-end">
                          <span className="font-bold text-lg">Total</span>
                          <span className="font-bold text-2xl text-primary">
                            {formatRupiah(billingDetails?.totalAmount || 0)}
                          </span>
                        </div>
                        
                      </CardContent>
                      <CardFooter>
                        <Button 
                          type="submit" 
                          className="w-full h-11 text-base"
                          disabled={!selectedStudentId || selectedMonths.length === 0 || isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Memproses...
                            </>
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Simpan Pembayaran
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>

              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}