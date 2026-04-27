'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useFinancialReports } from '@/lib/hooks/use-reports'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts'

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export default function ReportsPage() {
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

  const { data: reportData, isLoading } = useFinancialReports(parseInt(selectedYear))

  const totalIncome = reportData?.reduce((sum, item) => sum + item.income, 0) || 0
  const totalExpense = reportData?.reduce((sum, item) => sum + item.expense, 0) || 0
  const totalNet = totalIncome - totalExpense

  const chartData = reportData?.map(d => ({
    name: monthNames[d.month - 1],
    Pemasukan: d.income,
    Pengeluaran: d.expense
  })) || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laporan Keuangan</h1>
          <p className="text-muted-foreground mt-1">Pantau arus kas masuk dan keluar secara real-time.</p>
        </div>

        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {years.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Rp {totalIncome.toLocaleString('id-ID')}</div>
                <p className="text-xs text-muted-foreground mt-1">Dari pembayaran SPP & lain-lain</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">Rp {totalExpense.toLocaleString('id-ID')}</div>
                <p className="text-xs text-muted-foreground mt-1">Dari operasional & gaji</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Profit / Laba Bersih</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${totalNet >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  Rp {totalNet.toLocaleString('id-ID')}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Selisih pemasukan dan pengeluaran</p>
              </CardContent>
            </Card>
          </div>

          <Card className="pt-6">
            <CardHeader>
              <CardTitle>Grafik Arus Kas Bulanan</CardTitle>
              <CardDescription>Perbandingan Pemasukan dan Pengeluaran Tahun {selectedYear}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(0)}M`} />
                    <RechartsTooltip formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`} />
                    <Legend />
                    <Bar dataKey="Pemasukan" fill="#16a34a" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Pengeluaran" fill="#dc2626" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
