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
import { Download, TrendingUp, TrendingDown, Percent, Loader2 } from "lucide-react"
import { formatRupiah } from "@/lib/utils"
import { useReports } from "@/lib/hooks/use-reports"

export default function ReportsPage() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const { data, isLoading } = useReports(selectedYear);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const reports = data?.monthlyReports || [];
  const expenseBreakdown = data?.expenseBreakdown || [];
  const revenueSources = data?.revenueSources || [];
  const summary = data?.summary || { totalRevenue: 0, totalExpenses: 0, totalProfit: 0, avgProfitMargin: 0 };

  // Current month data (approximation: last available report or current month)
  const currentMonthIndex = new Date().getMonth();
  const currentMonthReport = reports[currentMonthIndex] || { profitMargin: 0 };

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
            <div className="text-2xl font-bold text-green-600">{formatRupiah(summary.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Tahun {selectedYear}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatRupiah(summary.totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">Tahun {selectedYear}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Keuntungan</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatRupiah(summary.totalProfit)}</div>
            <p className="text-xs text-muted-foreground">Margin: {Number(summary.avgProfitMargin).toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bulan Ini</CardTitle>
            <Percent className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{Number(currentMonthReport.profitMargin || 0).toFixed(1)}%</div>
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
                {reports.map((report: any, idx: number) => (
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
                        {Number(report.profitMargin).toFixed(1)}%
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
          <CardTitle>Rincian Pengeluaran</CardTitle>
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
                {expenseBreakdown.length === 0 ? (
                   <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">Belum ada data pengeluaran</TableCell>
                   </TableRow>
                ) : (
                  expenseBreakdown.map((expense: any, idx: number) => (
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
                )))}
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
                {revenueSources.length === 0 ? (
                   <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">Belum ada data pendapatan</TableCell>
                   </TableRow>
                ) : (
                  revenueSources.map((revenue: any, idx: number) => (
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
                )))}
              </TableBody>
            </Table>
            </div>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
