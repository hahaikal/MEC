'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { Loader2, CalendarIcon, Check, ChevronsUpDown, Edit } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Form,
  FormControl,
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
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { useCreatePayment, useUpdatePayment } from '@/lib/hooks/use-payments'

// Schema for Quick Pay
const quickPaymentSchema = z.object({
  payment_date: z.date({
    required_error: "Tanggal pembayaran harus diisi",
  }),
  payment_method: z.enum(['cash', 'transfer'], { // Updated to lowercase
    required_error: "Metode pembayaran harus dipilih",
  }),
  discount_amount: z.coerce.number().min(0).default(0),
  notes: z.string().optional(),
  book_fee_amount: z.coerce.number().min(0).default(0),
})

type QuickPaymentFormValues = z.infer<typeof quickPaymentSchema>

interface QuickPaymentFormProps {
  student: {
    id: string
    name: string
    enrollments?: any[]
  }
  month: number
  year: number
  isRegistration?: boolean
  isBookFee?: boolean
  existingPayment?: any
  existingPayments?: any[]
  onSuccess?: () => void
}

export function QuickPaymentForm({ student, month, year, isRegistration = false, isBookFee = false, existingPayment, existingPayments, onSuccess }: QuickPaymentFormProps) {
  const { mutate: createPayment, isPending: isCreating } = useCreatePayment()
  const { mutate: updatePayment, isPending: isUpdating } = useUpdatePayment()
  const isPending = isCreating || isUpdating
  
  const [openClassSelect, setOpenClassSelect] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  
  // Default to selecting all classes for convenience
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>(
    student.enrollments ? student.enrollments.map((e: any) => e.class_id) : []
  )

  const toggleClass = (classId: string) => {
    setSelectedClassIds(current =>
      current.includes(classId)
        ? current.filter(c => c !== classId)
        : [...current, classId]
    )
  }

  const form = useForm<QuickPaymentFormValues>({
    resolver: zodResolver(quickPaymentSchema),
    defaultValues: {
      discount_amount: existingPayment?.discount_amount || 0,
      book_fee_amount: existingPayment?.amount || 0,
      payment_date: existingPayment ? new Date(existingPayment.payment_date) : (() => {
        const now = new Date();
        if (isRegistration || isBookFee) return now;

        const targetDate = new Date(year, month, 1);
        const endOfMonth = new Date(year, month + 1, 0);

        // If current date is within the target month, use current date
        if (now.getMonth() === month && now.getFullYear() === year) {
          return now;
        }

        // If target month is in the past, default to end of that month
        if (now > endOfMonth) {
          return endOfMonth;
        }

        // If target month is in the future, default to start of that month
        return targetDate;
      })(),
      payment_method: existingPayment?.payment_method || 'cash',
      notes: existingPayment?.notes || '',
    },
  })

  const monthName = isRegistration ? 'Registration' : (isBookFee ? 'Book Fee' : format(new Date(year, month, 1), 'MMMM yyyy', { locale: idLocale }))

  // Kalkulasi Total
  const selectedEnrollments = student.enrollments?.filter(e => selectedClassIds.includes(e.class_id)) || [];
  const classesToPay = isRegistration || isBookFee ? [{ class_id: null, base_fee: 0 }] : selectedEnrollments;

  const watchedDiscount = form.watch('discount_amount') || 0
  const watchedBookFee = form.watch('book_fee_amount') || 0
  
  const baseFee = isRegistration
    ? 300000
    : isBookFee 
      ? watchedBookFee
      : (existingPayments && existingPayments.length > 0 ? existingPayments.reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0) : classesToPay.reduce((sum: number, enr: any) => sum + Number(enr.base_fee || 0), 0))

  const finalAmount = Math.max(0, baseFee - watchedDiscount);

  function onSubmit(data: QuickPaymentFormValues) {
    if (!isRegistration && !isBookFee && selectedClassIds.length === 0) {
       // Should select at least one class
       return;
    }

    // Determine how many payments to create based on selected classes
    // (We will submit one payment record per selected class to keep reporting accurate per program)
    const classesToPay = isRegistration || isBookFee ? [{ class_id: null, base_fee: baseFee }] : selectedEnrollments;

    if (existingPayment) {
      // Handle Edit
      const paymentsToUpdate = existingPayments && existingPayments.length > 0 ? existingPayments : [existingPayment];
      
      paymentsToUpdate.forEach((p, index) => {
        const paymentData = {
          amount: isRegistration ? p.amount : (isBookFee ? (data.book_fee_amount || p.amount) : p.amount),
          discount_amount: index === 0 ? data.discount_amount : 0,
          payment_date: format(data.payment_date, 'yyyy-MM-dd'),
          payment_method: data.payment_method,
          notes: data.notes || (isRegistration ? 'Biaya Registrasi' : isBookFee ? 'Uang Buku' : `Pembayaran SPP ${monthName}`),
        }
        updatePayment({ id: p.id, data: paymentData }, {
          onSuccess: () => {
            if (index === paymentsToUpdate.length - 1) {
              form.reset()
              if (onSuccess) onSuccess()
            }
          }
        })
      });
      return
    }

    classesToPay.forEach((enr: any, index: number) => {
      const paymentData = {
        student_id: student.id,
        amount: Math.max(0, (enr.base_fee || (isBookFee ? watchedBookFee : 300000)) - (index === 0 ? data.discount_amount : 0)),
        discount_amount: index === 0 ? data.discount_amount : 0, 
        payment_date: format(data.payment_date, 'yyyy-MM-dd'),
        payment_method: data.payment_method,
        month: (isRegistration || isBookFee) ? null : month,
        year: (isRegistration || isBookFee) ? data.payment_date.getFullYear() : year,
        category: isRegistration ? 'registration' : (isBookFee ? 'books' : 'tuition'),
        payment_status: 'completed',
        notes: data.notes || (isRegistration ? 'Biaya Registrasi' : isBookFee ? 'Uang Buku' : `Pembayaran SPP ${monthName} (${enr.class_name || ''})`),
        created_at: new Date().toISOString(),
      }

      createPayment(paymentData, {
        onSuccess: () => {
          if (index === classesToPay.length - 1) {
            form.reset()
            if (onSuccess) onSuccess()
          }
        },
      })
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        <div className="grid gap-4 py-4">
          {/* Info Section */}
          <div className="bg-slate-50 p-3 rounded-md border text-sm space-y-2">
             <div className="flex justify-between">
                <span className="text-muted-foreground">Siswa:</span>
                <span className="font-medium">{student.name}</span>
             </div>
             {!isRegistration && !isBookFee && (
               <div className="flex justify-between">
                  <span className="text-muted-foreground">Pembayaran Bulan:</span>
                  <span className="font-medium capitalize">{monthName}</span>
               </div>
             )}
             {(isRegistration || isBookFee) && (
               <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipe Pembayaran:</span>
                  <span className="font-medium capitalize">{isRegistration ? 'Registration' : 'Book Fee'}</span>
               </div>
             )}

             {!isRegistration && !isBookFee && student.enrollments && student.enrollments.length > 0 && (
               <div className="pt-2 border-t mt-2">
                 <p className="text-muted-foreground mb-2">Pilih Kelas yang Dibayar:</p>
                 <Popover open={openClassSelect} onOpenChange={setOpenClassSelect}>
                   <PopoverTrigger asChild>
                     <Button
                       variant="outline"
                       role="combobox"
                       aria-expanded={openClassSelect}
                       className="w-full justify-between bg-white font-normal"
                     >
                       {selectedClassIds.length === 0
                         ? "Pilih kelas..."
                         : `${selectedClassIds.length} Kelas Dipilih`}
                       <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                     </Button>
                   </PopoverTrigger>
                   <PopoverContent className="w-[400px] p-0" align="start">
                     <Command>
                       <CommandList>
                         <CommandGroup>
                           {student.enrollments.map((enr: any) => (
                             <CommandItem
                               key={enr.class_id}
                               value={enr.class_name}
                               onSelect={() => toggleClass(enr.class_id)}
                               className="flex items-center justify-between"
                             >
                               <div className="flex items-center">
                                 <Check
                                   className={cn(
                                     "mr-2 h-4 w-4",
                                     selectedClassIds.includes(enr.class_id) ? "opacity-100 text-primary" : "opacity-0"
                                   )}
                                 />
                                 <span>{enr.class_name}</span>
                               </div>
                               <span className="text-muted-foreground text-xs font-mono">
                                 {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(enr.base_fee)}
                               </span>
                             </CommandItem>
                           ))}
                         </CommandGroup>
                       </CommandList>
                     </Command>
                   </PopoverContent>
                 </Popover>
               </div>
             )}

             <div className="flex justify-between border-t pt-2 mt-2 items-center">
                <span className="text-muted-foreground">Nominal{isRegistration ? ' Registrasi' : isBookFee ? ' Uang Buku' : ' (SPP)'}:</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    maximumFractionDigits: 0
                  }).format(baseFee)}
                </span>
             </div>
          </div>

          {isBookFee && (
            <FormField
              control={form.control}
              name="book_fee_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nominal Uang Buku (Rp)</FormLabel>
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
          )}

          <FormField
            control={form.control}
            name="discount_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diskon / Potongan (Rp)</FormLabel>
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

          <div className="bg-primary/5 p-3 rounded-md border border-primary/20 flex justify-between items-center">
            <span className="font-semibold text-primary">Total Bayar:</span>
            <span className="font-bold text-lg text-primary">
               {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    maximumFractionDigits: 0
                  }).format(finalAmount)}
            </span>
          </div>

          <FormField
            control={form.control}
            name="payment_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal Pembayaran</FormLabel>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: idLocale })
                        ) : (
                          <span>Pilih tanggal</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date)
                        if (date) setIsCalendarOpen(false)
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="payment_method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Metode Pembayaran</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih metode" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="cash">Tunai (Cash)</SelectItem>
                    <SelectItem value="transfer">Transfer Bank</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catatan (Opsional)</FormLabel>
                <FormControl>
                  <Input placeholder="Tambahkan catatan pembayaran..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isPending || (!isRegistration && !isBookFee && selectedClassIds.length === 0)}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {existingPayment ? 'Simpan Perubahan' : 'Simpan Pembayaran'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
