'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { usePayroll } from '@/lib/hooks/use-payroll'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

const months = [
  { value: 1, label: 'Januari' },
  { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mei' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Desember' }
]

export default function PayrollPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString())
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

  const { data: payrollData, isLoading } = usePayroll(parseInt(selectedMonth), parseInt(selectedYear))

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Otomatisasi Penggajian</h1>
          <p className="text-muted-foreground mt-1">Kalkulasi honor guru otomatis berdasarkan log kehadiran kelas.</p>
        </div>

        <div className="flex gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {months.map(m => <SelectItem key={m.value} value={m.value.toString()}>{m.label}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {years.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6">
        {isLoading ? (
          <Card><CardContent className="p-8"><Skeleton className="h-40 w-full" /></CardContent></Card>
        ) : payrollData?.length === 0 ? (
          <Card><CardContent className="p-8 text-center text-muted-foreground">Tidak ada data pengajar aktif.</CardContent></Card>
        ) : (
          payrollData?.map(data => (
            <Card key={data.teacher.id} className="overflow-hidden">
              <CardHeader className="bg-slate-50 border-b pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{data.teacher.full_name || 'Tanpa Nama'}</CardTitle>
                    <CardDescription className="mt-1">{data.teacher.email}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Total Honor</div>
                    <div className="text-2xl font-bold text-slate-900">Rp {data.grandTotal.toLocaleString('id-ID')}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kelas Diajar</TableHead>
                      <TableHead className="text-center">Jml Pertemuan</TableHead>
                      <TableHead className="text-right">Honor / Pertemuan</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.values(data.classes).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6 text-muted-foreground italic">
                          Belum ada rekam kehadiran mengajar di bulan ini.
                        </TableCell>
                      </TableRow>
                    ) : (
                      Object.values(data.classes).map((c: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{c.className}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline">{c.sessionCount}x hadir</Badge>
                          </TableCell>
                          <TableCell className="text-right">Rp {c.feePerMeeting.toLocaleString('id-ID')}</TableCell>
                          <TableCell className="text-right font-medium">Rp {c.total.toLocaleString('id-ID')}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
