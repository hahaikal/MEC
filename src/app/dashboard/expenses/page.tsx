'use client'

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Trash2, Edit2, TrendingDown, Calendar } from "lucide-react"
import { formatRupiah } from "@/lib/utils"

// Mock data for expenses
const mockExpenses = [
  {
    id: '1',
    description: 'Gaji Guru Bulan Januari',
    category: 'Gaji',
    amount: 25000000,
    date: '2024-01-10',
    status: 'Paid',
  },
  {
    id: '2',
    description: 'Pembelian Alat Tulis Kantor',
    category: 'Operasional',
    amount: 2500000,
    date: '2024-01-15',
    status: 'Paid',
  },
  {
    id: '3',
    description: 'Pemeliharaan Gedung',
    category: 'Maintenance',
    amount: 5000000,
    date: '2024-01-20',
    status: 'Pending',
  },
  {
    id: '4',
    description: 'Listrik & Air Bulanan',
    category: 'Utilitas',
    amount: 3500000,
    date: '2024-01-25',
    status: 'Paid',
  },
  {
    id: '5',
    description: 'Upgrade Sistem Informasi',
    category: 'IT',
    amount: 10000000,
    date: '2024-01-28',
    status: 'Pending',
  },
  {
    id: '6',
    description: 'Honorarium Konsultan Akademik',
    category: 'Konsultasi',
    amount: 4000000,
    date: '2024-02-05',
    status: 'Paid',
  },
  {
    id: '7',
    description: 'Pengadaan Buku Perpustakaan',
    category: 'Pendidikan',
    amount: 7500000,
    date: '2024-02-10',
    status: 'Pending',
  },
  {
    id: '8',
    description: 'Asuransi Kendaraan',
    category: 'Asuransi',
    amount: 1800000,
    date: '2024-02-15',
    status: 'Paid',
  },
]

const categories = [
  'Gaji',
  'Operasional',
  'Maintenance',
  'Utilitas',
  'IT',
  'Konsultasi',
  'Pendidikan',
  'Asuransi',
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Paid':
      return 'bg-green-100 text-green-800'
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'Cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Gaji': 'bg-blue-50',
    'Operasional': 'bg-purple-50',
    'Maintenance': 'bg-orange-50',
    'Utilitas': 'bg-green-50',
    'IT': 'bg-pink-50',
    'Konsultasi': 'bg-indigo-50',
    'Pendidikan': 'bg-yellow-50',
    'Asuransi': 'bg-red-50',
  }
  return colors[category] || 'bg-gray-50'
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState(mockExpenses)

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const totalPaid = expenses
    .filter(exp => exp.status === 'Paid')
    .reduce((sum, exp) => sum + exp.amount, 0)
  const totalPending = expenses
    .filter(exp => exp.status === 'Pending')
    .reduce((sum, exp) => sum + exp.amount, 0)

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id))
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pengeluaran Institusi</h1>
          <p className="text-muted-foreground">
            Catat dan monitor arus kas keluar (Expenses) untuk operasional sekolah.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Catat Pengeluaran Baru
        </Button>
      </div>

      {/* Stats Summary Area */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-destructive shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRupiah(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">{expenses.length} transaksi</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sudah Dibayar</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatRupiah(totalPaid)}</div>
            <p className="text-xs text-muted-foreground">Status: Paid</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menunggu Proses</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatRupiah(totalPending)}</div>
            <p className="text-xs text-muted-foreground">Status: Pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Daftar Pengeluaran</CardTitle>
          <CardDescription>
            Kelola dan monitor semua transaksi pengeluaran institusi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-[1200px]">
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[200px]">Deskripsi</TableHead>
                  <TableHead className="w-[120px]">Kategori</TableHead>
                  <TableHead className="text-right w-[150px]">Nominal</TableHead>
                  <TableHead className="w-[120px]">Tanggal</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="text-right w-[100px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow
                    key={expense.id}
                    className={`${getCategoryColor(expense.category)} hover:opacity-75 transition-opacity`}
                  >
                    <TableCell className="font-medium">{expense.description}</TableCell>
                    <TableCell>
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-white border border-gray-200">
                        {expense.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-900">
                      {formatRupiah(expense.amount)}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {new Date(expense.date).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getStatusColor(expense.status)}`}>
                        {expense.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="Edit pengeluaran"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(expense.id)}
                          title="Hapus pengeluaran"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
