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
import { Plus, Download, Eye, CheckCircle2, Clock, XCircle, Loader2, ChevronDown, ChevronRight } from "lucide-react"
import { formatCurrency, formatRupiah } from "@/lib/utils"
import { usePayments } from "@/lib/hooks/use-payments"
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { DateRange } from "react-day-picker"
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"

const getStatusIcon = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
    case 'pending':
      return <Clock className="h-4 w-4 text-amber-500" />
    case 'failed':
      return <XCircle className="h-4 w-4 text-red-500" />
    default:
      return null
  }
}

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'bg-emerald-100 text-emerald-800'
    case 'pending':
      return 'bg-amber-100 text-amber-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function PaymentsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({})
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({})

  // Format dates for Supabase
  const startDate = dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined
  const endDate = dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined

  const { data, isLoading } = usePayments({ startDate, endDate })
  const payments = data?.data || []

  // Group payments by Month and then by Day
  const groupedPayments = React.useMemo(() => {
    const grouped: Record<string, Record<string, any[]>> = {}

    payments.forEach((payment: any) => {
      if (!payment.payment_date) return

      const dateObj = new Date(payment.payment_date)
      // Gunakan local timezone untuk konsistensi di UI
      const monthKey = format(dateObj, 'yyyy-MM', { locale: idLocale })
      const dayKey = format(dateObj, 'yyyy-MM-dd', { locale: idLocale })

      if (!grouped[monthKey]) {
        grouped[monthKey] = {}
      }
      if (!grouped[monthKey][dayKey]) {
        grouped[monthKey][dayKey] = []
      }

      grouped[monthKey][dayKey].push(payment)
    })

    return grouped
  }, [payments])

  const toggleMonth = (monthKey: string) => {
    setExpandedMonths(prev => ({ ...prev, [monthKey]: !prev[monthKey] }))
  }

  const toggleDay = (dayKey: string) => {
    setExpandedDays(prev => ({ ...prev, [dayKey]: !prev[dayKey] }))
  }

  // Calculate statistics
  const totalPayments = payments.length
  const completedPayments = payments.filter((p: any) => p.payment_status === 'completed').length
  const totalAmount = payments.reduce((sum: number, p: any) => sum + Number(p.amount), 0)
  const completedAmount = payments
    .filter((p: any) => p.payment_status === 'completed')
    .reduce((sum: number, p: any) => sum + Number(p.amount), 0)

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-bold tracking-tight text-balance">Riwayat Pembayaran</h1>
        <p className="text-muted-foreground text-balance">
          Kelola dan monitor semua transaksi pembayaran SPP siswa secara real-time
        </p>
      </div>

      {/* Action Buttons & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white dark:bg-slate-900 p-4 rounded-lg border shadow-sm">
        <div className="flex items-center gap-2">
           <DatePickerWithRange date={dateRange} setDate={setDateRange} />
           {(dateRange?.from || dateRange?.to) && (
             <Button variant="ghost" onClick={() => setDateRange(undefined)} size="sm">
               Reset Filter
             </Button>
           )}
        </div>
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
              <Table className="w-full text-sm">
                <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="w-40 font-semibold">Siswa</TableHead>
                  <TableHead className="w-32 font-semibold">Bulan</TableHead>
                  <TableHead className="text-right w-28 font-semibold">Nominal</TableHead>
                  <TableHead className="w-28 font-semibold">Metode</TableHead>
                  <TableHead className="w-24 font-semibold">Tanggal</TableHead>
                  <TableHead className="w-24 font-semibold">Status</TableHead>
                  <TableHead className="text-right w-20 font-semibold">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        <span className="text-muted-foreground">Memuat data...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : Object.keys(groupedPayments).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      Belum ada data pembayaran
                    </TableCell>
                  </TableRow>
                ) : (
                  Object.entries(groupedPayments)
                    .sort(([a], [b]) => b.localeCompare(a)) // Sort months descending
                    .map(([monthKey, daysMap]) => {
                      const monthDate = new Date(`${monthKey}-01`);
                      const monthDisplay = format(monthDate, 'MMMM yyyy', { locale: idLocale });
                      const isMonthExpanded = expandedMonths[monthKey] ?? true; // Default expanded
                      const monthlyTotal = Object.values(daysMap).flat().reduce((sum, p) => sum + Number(p.amount), 0);

                      return (
                        <React.Fragment key={monthKey}>
                          {/* Month Header Row */}
                          <TableRow className="bg-slate-100/80 dark:bg-slate-800/50 hover:bg-slate-100/80">
                            <TableCell colSpan={7} className="p-0">
                              <Button
                                variant="ghost"
                                className="w-full justify-between rounded-none h-12 px-6 font-semibold hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                                onClick={() => toggleMonth(monthKey)}
                              >
                                <div className="flex items-center gap-2">
                                  {isMonthExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                  <span className="text-base">{monthDisplay}</span>
                                </div>
                                <div className="text-emerald-600 font-bold">
                                  {formatRupiah(monthlyTotal)}
                                </div>
                              </Button>
                            </TableCell>
                          </TableRow>

                          {/* Day Rows (if month is expanded) */}
                          {isMonthExpanded && Object.entries(daysMap)
                            .sort(([a], [b]) => b.localeCompare(a)) // Sort days descending
                            .map(([dayKey, dailyPayments]) => {
                              const dayDate = new Date(dayKey);
                              const dayDisplay = format(dayDate, 'EEEE, dd MMMM yyyy', { locale: idLocale });
                              const isDayExpanded = expandedDays[dayKey] ?? true; // Default expanded
                              const dailyTotal = dailyPayments.reduce((sum, p) => sum + Number(p.amount), 0);

                              return (
                                <React.Fragment key={dayKey}>
                                  {/* Day Header Row */}
                                  <TableRow className="bg-slate-50 dark:bg-slate-900/30">
                                    <TableCell colSpan={7} className="p-0">
                                      <Button
                                        variant="ghost"
                                        className="w-full justify-between rounded-none h-10 px-6 pl-12 text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800/50"
                                        onClick={() => toggleDay(dayKey)}
                                      >
                                        <div className="flex items-center gap-2">
                                          {isDayExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                                          <span className="text-sm font-medium">{dayDisplay}</span>
                                          <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full ml-2">
                                            {dailyPayments.length} trx
                                          </span>
                                        </div>
                                        <div className="text-sm font-semibold">
                                          {formatRupiah(dailyTotal)}
                                        </div>
                                      </Button>
                                    </TableCell>
                                  </TableRow>

                                  {/* Transaction Rows (if day is expanded) */}
                                  {isDayExpanded && dailyPayments.map((payment: any) => {
                                    const paymentMonthName = payment.category === 'registration'
                                      ? 'Registrasi'
                                      : (payment.month != null ? format(new Date(payment.year, payment.month, 1), 'MMMM yyyy', { locale: idLocale }) : '-');

                                    return (
                                      <TableRow key={payment.id} className="hover:bg-muted/30 transition-colors group">
                                        <TableCell className="px-6 pl-14 font-medium">
                                          <div className="flex flex-col">
                                            <span>{payment.students?.name || 'Unknown'}</span>
                                            <span className="text-xs text-muted-foreground">{payment.students?.email}</span>
                                          </div>
                                        </TableCell>
                                        <TableCell className="text-sm capitalize">{paymentMonthName}</TableCell>
                                        <TableCell className="text-right font-semibold text-emerald-600">
                                          {formatRupiah(Number(payment.amount))}
                                          {payment.discount_amount > 0 && (
                                             <div className="text-xs text-muted-foreground line-through decoration-red-400">
                                               Disc: {formatRupiah(Number(payment.discount_amount))}
                                             </div>
                                          )}
                                        </TableCell>
                                        <TableCell className="text-sm capitalize">{payment.payment_method?.replace('_', ' ')}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                          {payment.payment_date ? format(new Date(payment.payment_date), 'HH:mm') : '-'}
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex items-center gap-2">
                                            {getStatusIcon(payment.payment_status)}
                                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded capitalize ${getStatusColor(payment.payment_status)}`}>
                                              {payment.payment_status}
                                            </span>
                                          </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Eye className="h-4 w-4" />
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    )
                                  })}
                                </React.Fragment>
                              )
                            })
                          }
                        </React.Fragment>
                      )
                    })
                )}
              </TableBody>
            </Table>
            </div>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
