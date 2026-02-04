'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, CheckCircle, Wallet } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'

/**
 * Memperbaiki path impor menggunakan alias @/ yang merupakan standar 
 * pada proyek ini (merujuk ke direktori src/).
 */
import { formatRupiah } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
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
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'

const paymentSchema = z.object({
  student_id: z.string().min(1),
  month: z.string().min(1),
  category: z.enum(['spp', 'registration', 'books', 'other']),
  amount: z.coerce.number().min(1000, "Minimal pembayaran Rp 1.000"),
  payment_method: z.string().default('cash'),
})

type PaymentValues = z.infer<typeof paymentSchema>

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  studentId: string
  studentName: string
  defaultMonth: string
  baseFee: number
}

export function PaymentDialog({ 
  open, 
  onOpenChange, 
  studentId, 
  studentName,
  defaultMonth,
  baseFee 
}: PaymentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()
  const supabase = createClient()

  const form = useForm<PaymentValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      student_id: studentId,
      month: defaultMonth,
      category: 'spp',
      amount: baseFee,
      payment_method: 'cash',
    },
  })

  // Memastikan form reset saat data studentId atau baseFee berubah
  useEffect(() => {
    if (open) {
      form.reset({
        student_id: studentId,
        month: defaultMonth,
        category: 'spp',
        amount: baseFee,
        payment_method: 'cash',
      })
    }
  }, [open, studentId, defaultMonth, baseFee, form])

  const selectedCategory = form.watch('category')
  useEffect(() => {
    if (selectedCategory === 'registration') {
      form.setValue('amount', 1500000)
    } else if (selectedCategory === 'spp') {
      form.setValue('amount', baseFee)
    }
  }, [selectedCategory, baseFee, form])

  async function onSubmit(values: PaymentValues) {
    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Sesi berakhir. Silakan login kembali.")

      const { error } = await supabase.from('payments').insert({
        student_id: values.student_id,
        month: values.month,
        amount: values.amount,
        payment_type: values.category,
        payment_date: new Date().toISOString(),
        payment_method: values.payment_method,
        created_by: user.id
      })

      if (error) throw error

      toast({
        title: "Pembayaran Dicatat",
        description: `Berhasil mencatat ${values.category.toUpperCase()} untuk ${studentName}`,
      })

      queryClient.invalidateQueries({ queryKey: ['payments'] })
      onOpenChange(false)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal Mencatat",
        description: error.message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Input Pembayaran
          </DialogTitle>
          <DialogDescription>
            Mencatat transaksi untuk <strong>{studentName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="bg-muted/50 p-3 rounded-md text-sm mb-4">
              Bulan Tagihan: <span className="font-bold">{defaultMonth}</span>
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori Pembayaran</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="spp">SPP Bulanan</SelectItem>
                      <SelectItem value="registration">Uang Pendaftaran</SelectItem>
                      <SelectItem value="books">Pembelian Buku</SelectItem>
                      <SelectItem value="other">Lain-lain</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nominal Pembayaran</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">Rp</span>
                      <Input type="number" className="pl-9" {...field} />
                    </div>
                  </FormControl>
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih metode pembayaran" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cash">Tunai</SelectItem>
                      <SelectItem value="transfer">Transfer Bank</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                Konfirmasi Pembayaran
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}