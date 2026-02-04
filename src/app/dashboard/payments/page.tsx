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
import { Plus, Download, Eye, CheckCircle2, Clock, XCircle } from "lucide-react"
import { formatRupiah } from "@/lib/utils"

// Mock payment data
const mockPayments = [
  {
    id: '1',
    student: 'Ahmad Ridho Pratama',
    month: 'Januari 2024',
    amount: 500000,
    date: '2024-01-08',
    method: 'Bank Transfer',
    status: 'Completed',
  },
  {
    id: '2',
    student: 'Siti Nurhaliza',
    month: 'Januari 2024',
    amount: 500000,
    date: '2024-01-09',
    method: 'Cash',
    status: 'Completed',
  },
  {
    id: '3',
    student: 'Budi Santoso',
    month: 'Januari 2024',
    amount: 500000,
    date: '2024-01-10',
    method: 'E-Wallet',
    status: 'Completed',
  },
  {
    id: '4',
    student: 'Rina Wijaya',
    month: 'Januari 2024',
    amount: 500000,
    date: '2024-01-12',
    method: 'Bank Transfer',
    status: 'Completed',
  },
  {
    id: '5',
    student: 'Doni Hermawan',
    month: 'Januari 2024',
    amount: 500000,
    date: '2024-01-15',
    method: 'Cash',
    status: 'Completed',
  },
  {
    id: '6',
    student: 'Eka Putri Lestari',
    month: 'Februari 2024',
    amount: 500000,
    date: '2024-02-02',
    method: 'Bank Transfer',
    status: 'Pending',
  },
  {
    id: '7',
    student: 'Fajar Malik',
    month: 'Februari 2024',
    amount: 500000,
    date: null,
    method: '-',
    status: 'Failed',
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Completed':
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
    case 'Pending':
      return <Clock className="h-4 w-4 text-amber-500" />
    case 'Failed':
      return <XCircle className="h-4 w-4 text-red-500" />
    default:
      return null
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'bg-emerald-100 text-emerald-800'
    case 'Pending':
      return 'bg-amber-100 text-amber-800'
    case 'Failed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function PaymentsPage() {
  const [payments] = useState(mockPayments)

  // Calculate statistics
  const totalPayments = payments.length
  const completedPayments = payments.filter(p => p.status === 'Completed').length
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0)
  const completedAmount = payments
    .filter(p => p.status === 'Completed')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-bold tracking-tight text-balance">Riwayat Pembayaran</h1>
        <p className="text-muted-foreground text-balance">
          Kelola dan monitor semua transaksi pembayaran SPP siswa secara real-time
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Catat Pembayaran Baru
        </Button>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Transactions */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 shadow-sm">
          <div className="absolute inset-0 opacity-10">
            <Plus className="absolute -top-4 -right-4 h-32 w-32 text-blue-600" />
          </div>
          <CardHeader className="pb-2 relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">Total Transaksi</CardTitle>
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{totalPayments}</div>
            <p className="text-xs text-blue-700/70 dark:text-blue-300/70 mt-1">Semua transaksi</p>
          </CardContent>
        </Card>

        {/* Completed Payments */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/30 shadow-sm">
          <div className="absolute inset-0 opacity-10">
            <CheckCircle2 className="absolute -top-4 -right-4 h-32 w-32 text-emerald-600" />
          </div>
          <CardHeader className="pb-2 relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Berhasil</CardTitle>
              <div className="p-2 bg-emerald-600/20 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">{completedPayments}</div>
            <p className="text-xs text-emerald-700/70 dark:text-emerald-300/70 mt-1">Status terselesaikan</p>
          </CardContent>
        </Card>

        {/* Total Amount */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30 shadow-sm">
          <div className="absolute inset-0 opacity-10">
            <Download className="absolute -top-4 -right-4 h-32 w-32 text-purple-600" />
          </div>
          <CardHeader className="pb-2 relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">Total Diterima</CardTitle>
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <Download className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{formatRupiah(completedAmount)}</div>
            <p className="text-xs text-purple-700/70 dark:text-purple-300/70 mt-1">Yang berhasil</p>
          </CardContent>
        </Card>

        {/* Success Rate */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/30 shadow-sm">
          <div className="absolute inset-0 opacity-10">
            <Eye className="absolute -top-4 -right-4 h-32 w-32 text-amber-600" />
          </div>
          <CardHeader className="pb-2 relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-amber-900 dark:text-amber-100">Tingkat Sukses</CardTitle>
              <div className="p-2 bg-amber-600/20 rounded-lg">
                <Eye className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">
              {totalPayments > 0 ? Math.round((completedPayments / totalPayments) * 100) : 0}%
            </div>
            <p className="text-xs text-amber-700/70 dark:text-amber-300/70 mt-1">Kesuksesan pembayaran</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment History Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4 border-b">
          <div>
            <CardTitle className="text-xl">Riwayat Pembayaran Detail</CardTitle>
            <CardDescription className="mt-1">
              Daftar lengkap semua transaksi pembayaran SPP siswa
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto -mx-6">
            <div className="px-6">
              <Table className="w-full">
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="px-6 font-semibold">Siswa</TableHead>
                  <TableHead className="font-semibold">Bulan</TableHead>
                  <TableHead className="text-right font-semibold">Nominal</TableHead>
                  <TableHead className="font-semibold">Metode</TableHead>
                  <TableHead className="font-semibold">Tanggal</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right pr-6 font-semibold">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="px-6 font-medium">{payment.student}</TableCell>
                    <TableCell className="text-sm">{payment.month}</TableCell>
                    <TableCell className="text-right font-semibold text-emerald-600">
                      {formatRupiah(payment.amount)}
                    </TableCell>
                    <TableCell className="text-sm">{payment.method}</TableCell>
                    <TableCell className="text-sm">
                      {payment.date ? new Date(payment.date).toLocaleDateString('id-ID') : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(payment.status)}
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
