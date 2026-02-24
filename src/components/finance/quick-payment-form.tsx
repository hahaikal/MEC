'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { Loader2, CalendarIcon, Check } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
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
import { useCreatePayment } from '@/lib/hooks/use-payments'

// Schema for Quick Pay
const quickPaymentSchema = z.object({
  payment_date: z.date({
    required_error: "Tanggal pembayaran harus diisi",
  }),
  payment_method: z.enum(['CASH', 'TRANSFER'], {
    required_error: "Metode pembayaran harus dipilih",
  }),
  discount_amount: z.coerce.number().min(0).default(0),
})

type QuickPaymentFormValues = z.infer<typeof quickPaymentSchema>

interface QuickPaymentFormProps {
  student: {
    id: string
    name: string
    base_fee?: number
  }
  month: number
  year: number
  onSuccess?: () => void
}

export function QuickPaymentForm({ student, month, year, onSuccess }: QuickPaymentFormProps) {
  const { mutate: createPayment, isPending } = useCreatePayment()

  const form = useForm<QuickPaymentFormValues>({
    resolver: zodResolver(quickPaymentSchema),
    defaultValues: {
      discount_amount: 0,
      payment_date: (() => {
        const now = new Date();
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
      payment_method: 'CASH',
    },
  })

  const monthName = format(new Date(year, month, 1), 'MMMM yyyy', { locale: idLocale })

  // Kalkulasi Total
  const discount = form.watch("discount_amount") || 0;
  const baseFee = student.base_fee || 0;
  const finalAmount = Math.max(0, baseFee - discount);

  function onSubmit(data: QuickPaymentFormValues) {
    // Construct payment object
    const paymentData = {
      student_id: student.id,
      amount: finalAmount, // Final amount after discount
      discount_amount: data.discount_amount, // Store discount for record
      payment_date: data.payment_date.toISOString(),
      payment_method: data.payment_method,
      month: month, // Store target month
      year: year,   // Store target year
      payment_status: 'completed',
      notes: `Pembayaran SPP ${monthName}`,
      created_at: new Date().toISOString(),
    }

    createPayment(paymentData, {
      onSuccess: () => {
        form.reset()
        if (onSuccess) onSuccess()
      },
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
             <div className="flex justify-between">
                <span className="text-muted-foreground">Pembayaran Bulan:</span>
                <span className="font-medium capitalize">{monthName}</span>
             </div>
             <div className="flex justify-between border-t pt-2 mt-2">
                <span className="text-muted-foreground">Nominal (SPP):</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    maximumFractionDigits: 0
                  }).format(baseFee)}
                </span>
             </div>
          </div>

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
                <Popover>
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
                      onSelect={field.onChange}
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
                    <SelectItem value="CASH">Tunai (Cash)</SelectItem>
                    <SelectItem value="TRANSFER">Transfer Bank</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Pembayaran
          </Button>
        </div>
      </form>
    </Form>
  )
}
