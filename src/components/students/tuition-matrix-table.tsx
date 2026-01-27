'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { useToast } from '@/lib/hooks/use-toast'

const MONTHS = [
  { value: 1, label: 'Jan', short: 'Jan' },
  { value: 2, label: 'Feb', short: 'Feb' },
  { value: 3, label: 'Mar', short: 'Mar' },
  { value: 4, label: 'Apr', short: 'Apr' },
  { value: 5, label: 'May', short: 'May' },
  { value: 6, label: 'Jun', short: 'Jun' },
  { value: 7, label: 'Jul', short: 'Jul' },
  { value: 8, label: 'Aug', short: 'Aug' },
  { value: 9, label: 'Sep', short: 'Sep' },
  { value: 10, label: 'Oct', short: 'Oct' },
  { value: 11, label: 'Nov', short: 'Nov' },
  { value: 12, label: 'Dec', short: 'Dec' },
]

interface PaymentRecord {
  student_id: string
  month: number
  year: number
  payment_date: string
  payment_method: string
  amount: number
}

interface StudentData {
  id: string
  name: string
  program_name?: string
  program_price?: number
  program_id?: string
}

interface TuitionMatrixTableProps {
  students?: StudentData[]
  isLoading?: boolean
}

export function TuitionMatrixTable({
  students = [],
  isLoading = false,
}: TuitionMatrixTableProps) {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [paymentDialog, setPaymentDialog] = useState<{
    open: boolean
    studentId?: string
    studentName?: string
    month?: number
    amount?: number
  }>({ open: false })
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    method: 'transfer',
  })

  const currentYear = new Date().getFullYear()

  // Fetch all payments for this year
  const { data: payments = [] } = useQuery({
    queryKey: ['payments', currentYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .gte('payment_date', `${currentYear}-01-01`)
        .lte('payment_date', `${currentYear}-12-31`)

      if (error) throw error
      return (data || []).filter(p => p.payment_date).map((p) => ({
        student_id: p.student_id,
        month: new Date(p.payment_date!).getMonth() + 1,
        year: new Date(p.payment_date!).getFullYear(),
        payment_date: p.payment_date!,
        payment_method: p.payment_method,
        amount: p.amount,
      }))
    },
  })

  // Record payment mutation
  const { mutate: recordPayment, isPending } = useMutation({
    mutationFn: async () => {
      if (!paymentDialog.studentId || !paymentDialog.month || !paymentForm.amount) {
        throw new Error('Missing required fields')
      }

      const amount = parseFloat(paymentForm.amount)
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Invalid payment amount')
      }

      const paymentDate = new Date(
        currentYear,
        paymentDialog.month - 1,
        1
      ).toISOString().split('T')[0]

      const { error } = await supabase.from('payments').insert([
        {
          student_id: paymentDialog.studentId,
          amount: amount,
          payment_date: paymentDate,
          payment_method: paymentForm.method,
          payment_status: 'completed',
        },
      ])

      if (error) throw error
    },
    onSuccess: () => {
      toast({
        title: 'Sukses',
        description: 'Pembayaran berhasil dicatat',
      })
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      setPaymentDialog({ open: false })
      setPaymentForm({ amount: '', method: 'transfer' })
    },
    onError: (error) => {
      console.error('Error recording payment:', error)
      toast({
        title: 'Error',
        description: 'Gagal mencatat pembayaran',
        variant: 'destructive',
      })
    },
  })

  const getPaymentBadge = (studentId: string, month: number) => {
    const payment = payments.find(
      (p) => p.student_id === studentId && p.month === month
    )

    if (payment) {
      const date = new Date(payment.payment_date!)
      const dateStr = `${date.getDate()} ${MONTHS[month - 1].short}`
      return (
        <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-2.5 py-1">
          ✓ {dateStr}
        </Badge>
      )
    }

    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-9 w-9 p-0 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        onClick={() =>
          setPaymentDialog({
            open: true,
            studentId,
            studentName: students.find((s) => s.id === studentId)?.name,
            month,
            amount: students.find((s) => s.id === studentId)?.program_price,
          })
        }
        title="Catat pembayaran"
      >
        <Plus className="h-4 w-4" />
      </Button>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block text-muted-foreground">Memuat data...</div>
      </div>
    )
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-base">Belum ada siswa. Silakan tambah siswa terlebih dahulu.</p>
      </div>
    )
  }

  return (
    <>
      <div className="border rounded-lg bg-white overflow-x-auto shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b bg-slate-50 hover:bg-slate-50">
              <TableHead className="min-w-40 font-semibold text-foreground">Nama Siswa</TableHead>
              <TableHead className="min-w-32 font-semibold text-foreground">Kelas</TableHead>
              {MONTHS.map((month) => (
                <TableHead
                  key={month.value}
                  className="min-w-20 text-center text-xs font-semibold text-foreground"
                >
                  {month.short}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student, idx) => (
              <TableRow
                key={student.id}
                className={`hover:bg-blue-50/50 transition-colors ${
                  idx !== students.length - 1 ? 'border-b' : ''
                }`}
              >
                <TableCell className="font-semibold text-foreground">{student.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {student.program_name || '—'}
                </TableCell>
                {MONTHS.map((month) => (
                  <TableCell
                    key={`${student.id}-${month.value}`}
                    className="text-center py-3"
                  >
                    {getPaymentBadge(student.id, month.value)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Payment Dialog */}
      <Dialog
        open={paymentDialog.open}
        onOpenChange={(open) => setPaymentDialog({ ...paymentDialog, open })}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Catat Pembayaran SPP</DialogTitle>
            <DialogDescription>
              {paymentDialog.studentName} - {MONTHS[paymentDialog.month! - 1]?.label || ''}
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              recordPayment()
            }}
            className="flex flex-col gap-4"
          >
            {/* Jumlah Pembayaran */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="amount">Jumlah Pembayaran (Rp) *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Contoh: 500000"
                value={paymentForm.amount}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, amount: e.target.value })
                }
                disabled={isPending}
              />
            </div>

            {/* Metode Pembayaran */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="method">Metode Pembayaran *</Label>
              <Select
                value={paymentForm.method}
                onValueChange={(value) =>
                  setPaymentForm({ ...paymentForm, method: value })
                }
                disabled={isPending}
              >
                <SelectTrigger id="method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transfer">Transfer Bank</SelectItem>
                  <SelectItem value="cash">Tunai</SelectItem>
                  <SelectItem value="check">Cek</SelectItem>
                  <SelectItem value="card">Kartu Kredit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPaymentDialog({ open: false })}
                disabled={isPending}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isPending || !paymentForm.amount}>
                {isPending ? 'Menyimpan...' : 'Simpan Pembayaran'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
