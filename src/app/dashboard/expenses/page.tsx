'use client'

import { ExpensesList } from './_components/expenses-list'
import { AddExpenseDialog } from './_components/add-expense-dialog'

export default function ExpensesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Pengeluaran</h1>
          <p className="text-muted-foreground">
            Catat dan pantau pengeluaran operasional sekolah.
          </p>
        </div>
        <AddExpenseDialog />
      </div>

      <ExpensesList />
    </div>
  )
}
