'use client'

import React from 'react'
// Memperbaiki path impor dengan menghapus 'src/' karena alias @ merujuk ke folder src
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle, Receipt, TrendingDown, Calendar } from 'lucide-react'

export default function ExpensesPage() {
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
        <Button variant="destructive">
          <PlusCircle className="mr-2 h-4 w-4" />
          Catat Pengeluaran Baru
        </Button>
      </div>

      {/* Stats Summary Area */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-destructive shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengeluaran (Bulan Ini)</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 0</div>
            <p className="text-xs text-muted-foreground">Belum ada data pengeluaran tercatat</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimasi Biaya Operasional</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">--</div>
            <p className="text-xs text-muted-foreground">Berdasarkan rata-rata bulanan</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <Card className="bg-muted/20 border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center h-[450px] text-center p-6">
          <div className="p-4 bg-background rounded-full mb-4 shadow-sm">
            <Receipt className="h-10 w-10 text-muted-foreground opacity-40" />
          </div>
          <h3 className="font-bold text-xl mb-2">Modul Pengeluaran Sedang Disiapkan</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Tim Backend sedang memigrasi skema tabel <code className="bg-muted px-1 rounded">expenses</code> ke database produksi. 
            Halaman ini akan segera terhubung secara otomatis untuk menampilkan daftar transaksi pengeluaran dan laporan laba-rugi.
          </p>
          <div className="mt-8 flex gap-3">
            <Button variant="outline" disabled>Lihat Laporan</Button>
            <Button variant="outline" disabled>Ekspor CSV</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}