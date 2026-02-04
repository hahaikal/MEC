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
import { Download, TrendingUp, TrendingDown, Percent } from "lucide-react"
import { formatRupiah } from "@/lib/utils"

// Mock data for monthly reports
const mockMonthlyReports = [
  {
    month: 'Januari 2024',
    revenue: 45000000,
    expenses: 35000000,
    profit: 10000000,
    students: 120,
    profitMargin: 22.2,
  },
  {
    month: 'Februari 2024',
    revenue: 50000000,
    expenses: 36000000,
    profit: 14000000,
    students: 125,
    profitMargin: 28,
  },
  {
    month: 'Maret 2024',
    revenue: 48000000,
    expenses: 38000000,
    profit: 10000000,
    students: 122,
    profitMargin: 20.8,
  },
  {
    month: 'April 2024',
    revenue: 52000000,
    expenses: 37000000,
    profit: 15000000,
    students: 128,
    profitMargin: 28.8,
  },
  {
    month: 'Mei 2024',
    revenue: 55000000,
    expenses: 39000000,
    profit: 16000000,
    students: 132,
    profitMargin: 29.1,
  },
  {
    month: 'Juni 2024',
    revenue: 58000000,
    expenses: 40000000,
    profit: 18000000,
    students: 135,
    profitMargin: 31,
  },
]

// Mock data for expense breakdown
const mockExpenseBreakdown = [
  { category: 'Gaji & Tunjangan', amount: 120000000, percentage: 45 },
  { category: 'Operasional', amount: 45000000, percentage: 17 },
  { category: 'Utilities (Listrik, Air, Gas)', amount: 30000000, percentage: 11 },
  { category: 'Maintenance & Repair', amount: 25000000, percentage: 10 },
  { category: 'IT & Software', amount: 20000000, percentage: 8 },
  { category: 'Pendidikan & Training', amount: 15000000, percentage: 6 },
  { category: 'Asuransi', amount: 10000000, percentage: 4 },
]

// Mock data for revenue sources
const mockRevenueSources = [
  { source: 'SPP (Tuition Fee)', amount: 200000000, percentage: 70 },
  { source: 'Daftar Ulang', amount: 30000000, percentage: 10 },
  { source: 'Aktivitas Ekstrakurikuler', amount: 25000000, percentage: 9 },
  { source: 'Kerjasama & Sponsor', amount: 20000000, percentage: 7 },
  { source: 'Penjualan Merchandise', amount: 10000000, percentage: 4 },
]

export default function ReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState('June 2024')

  // Calculate totals
  const totalRevenue = mockMonthlyReports.reduce((sum, r) => sum + r.revenue, 0)
  const totalExpenses = mockMonthlyReports.reduce((sum, r) => sum + r.expenses, 0)
  const totalProfit = totalRevenue - totalExpenses
  const avgProfitMargin = (totalProfit / totalRevenue * 100).toFixed(1)

  // Current month data
  const currentMonth = mockMonthlyReports[mockMonthlyReports.length - 1]

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laporan Keuangan</h1>
          <p className="text-muted-foreground">
            Analisis keuangan komprehensif dan performa operasional institusi
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatRupiah(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">6 bulan terakhir</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatRupiah(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">6 bulan terakhir</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Keuntungan</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatRupiah(totalProfit)}</div>
            <p className="text-xs text-muted-foreground">Margin: {avgProfitMargin}%</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bulan Ini</CardTitle>
            <Percent className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{currentMonth.profitMargin.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Profit Margin</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Performance Table */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Performa Bulanan</CardTitle>
          <CardDescription>
            Ringkasan pendapatan, pengeluaran, dan keuntungan per bulan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6">
            <div className="px-6">
              <Table className="w-full text-sm">
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="w-40">Bulan</TableHead>
                  <TableHead className="text-right w-32">Pendapatan</TableHead>
                  <TableHead className="text-right w-32">Pengeluaran</TableHead>
                  <TableHead className="text-right w-32">Keuntungan</TableHead>
                  <TableHead className="text-right w-24">Margin</TableHead>
                  <TableHead className="text-right w-24">Siswa Aktif</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockMonthlyReports.map((report, idx) => (
                  <TableRow key={idx} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{report.month}</TableCell>
                    <TableCell className="text-right text-green-600 font-semibold">
                      {formatRupiah(report.revenue)}
                    </TableCell>
                    <TableCell className="text-right text-red-600 font-semibold">
                      {formatRupiah(report.expenses)}
                    </TableCell>
                    <TableCell className="text-right text-blue-600 font-semibold">
                      {formatRupiah(report.profit)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                        {report.profitMargin.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{report.students}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
            </div>
        </CardContent>
      </Card>

      {/* Expense Breakdown */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Rincian Pengeluaran (6 Bulan Terakhir)</CardTitle>
          <CardDescription>
            Analisis kategori pengeluaran dan proporsi masing-masing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6">
            <div className="px-6">
              <Table className="w-full text-sm">
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="w-48">Kategori</TableHead>
                  <TableHead className="text-right w-32">Total Pengeluaran</TableHead>
                  <TableHead className="text-right w-24">Persentase</TableHead>
                  <TableHead className="w-48">Visualisasi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockExpenseBreakdown.map((expense, idx) => (
                  <TableRow key={idx} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{expense.category}</TableCell>
                    <TableCell className="text-right text-red-600 font-semibold">
                      {formatRupiah(expense.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800">
                        {expense.percentage}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{ width: `${expense.percentage}%` }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
            </div>
        </CardContent>
      </Card>

      {/* Revenue Sources */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Sumber Pendapatan</CardTitle>
          <CardDescription>
            Distribusi pendapatan dari berbagai sumber
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6">
            <div className="px-6">
              <Table className="w-full text-sm">
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="w-48">Sumber Pendapatan</TableHead>
                  <TableHead className="text-right w-32">Total Pendapatan</TableHead>
                  <TableHead className="text-right w-24">Persentase</TableHead>
                  <TableHead className="w-48">Visualisasi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRevenueSources.map((revenue, idx) => (
                  <TableRow key={idx} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{revenue.source}</TableCell>
                    <TableCell className="text-right text-green-600 font-semibold">
                      {formatRupiah(revenue.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
                        {revenue.percentage}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${revenue.percentage}%` }}
                        />
                      </div>
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
