'use client'

import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { Trash2 } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { useExpenses, useDeleteExpense } from '@/lib/hooks/use-expenses'

const CATEGORY_LABELS: Record<string, string> = {
  operational: 'Operasional',
  salary: 'Gaji',
  asset: 'Aset',
  maintenance: 'Maintenance',
  marketing: 'Marketing',
  other: 'Lainnya',
}

const CATEGORY_COLORS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  operational: 'default',
  salary: 'secondary',
  asset: 'outline',
  maintenance: 'outline',
  marketing: 'secondary',
  other: 'secondary',
}

interface ExpensesListProps {
  filters?: {
    startDate?: string
    endDate?: string
    category?: string
  }
}

export function ExpensesList({ filters }: ExpensesListProps) {
  const { data: expenses, isLoading } = useExpenses(filters)
  const { mutate: deleteExpense } = useDeleteExpense()

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Memuat data pengeluaran...</div>
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-slate-50/50 border-dashed">
        <p className="text-muted-foreground">Belum ada data pengeluaran.</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead className="text-right">Jumlah</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className="font-medium whitespace-nowrap">
                {format(new Date(expense.date), 'dd MMMM yyyy', { locale: idLocale })}
              </TableCell>
              <TableCell>{expense.description}</TableCell>
              <TableCell>
                <Badge variant={CATEGORY_COLORS[expense.category] || 'outline'}>
                  {CATEGORY_LABELS[expense.category] || expense.category}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-medium">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  maximumFractionDigits: 0,
                }).format(expense.amount)}
              </TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus Pengeluaran?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini tidak dapat dibatalkan. Data pengeluaran akan dihapus permanen.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => deleteExpense(expense.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
