'use client'

import React, { useState } from "react"
import { useStudents } from "@/lib/hooks/use-students"
import { usePayments } from "@/lib/hooks/use-payments"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PlusCircle, Users, Wallet, AlertTriangle, TrendingUp } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { TuitionMatrixTable } from "@/components/finance/tuition-matrix-table"
import { toast } from "@/lib/hooks/use-toast"
import { formatRupiah, MONTHS_LIST } from "@/lib/utils"

export default function StudentsPage() {
  const { data: students, isLoading: isLoadingStudents, refetch: refetchStudents } = useStudents()
  const { data: payments, isLoading: isLoadingPayments } = usePayments()
  
  // Handler untuk aksi dari Matrix Table
  const handleEditStudent = (student: any) => {
    console.log("Editing student:", student)
    // TODO: Buka Dialog Edit
  }

  const handleDeleteStudent = async (id: string) => {
    // Simulasi delete (Integrasi ke hook mutation nantinya)
    toast({
      title: "Menghapus Siswa...",
      description: "Data sedang diproses di server.",
    })
    
    // await deleteStudentMutation(id)
    refetchStudents()
  }

  const handleAddPayment = (studentId: string, month: string) => {
    console.log(`Add payment for ${studentId} month ${month}`)
    // TODO: Buka PaymentEntryForm dengan pre-filled data
  }

  if (isLoadingStudents || isLoadingPayments) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-8 animate-pulse">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    )
  }

  // Transform payments data to include month property
  const transformedPayments = payments?.data?.map(payment => ({
    ...payment,
    month: payment.payment_date
      ? new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date(payment.payment_date))
      : '',
  })) || []

  // Kalkulasi Statistik Cepat
  const totalStudents = students?.length || 0
  const currentMonthName = new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date())

  const paidThisMonth = transformedPayments.filter((p: any) => p.month === currentMonthName).length || 0
  const overdueCount = students?.filter(s => {
    const hasPaid = transformedPayments.some((p: any) => p.student_id === s.id && p.month === currentMonthName)
    return !hasPaid && new Date().getDate() > 10
  }).length || 0

  const completionRate = totalStudents > 0 ? Math.round((paidThisMonth / totalStudents) * 100) : 0

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-bold tracking-tight text-balance">Manajemen Siswa & SPP</h1>
        <p className="text-muted-foreground text-balance">
          Monitor status pembayaran real-time dan kelola data murid sekolah Anda dengan efisien
        </p>
      </div>

      {/* Action Button */}
      <div className="flex gap-2">
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Tambah Siswa Baru
        </Button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Siswa Card */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 shadow-sm">
          <div className="absolute inset-0 opacity-10">
            <Users className="absolute -top-4 -right-4 h-32 w-32 text-blue-600" />
          </div>
          <CardHeader className="pb-2 relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">Total Siswa Aktif</CardTitle>
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{totalStudents}</div>
            <p className="text-xs text-blue-700/70 dark:text-blue-300/70 mt-1">Siswa terdaftar</p>
          </CardContent>
        </Card>

        {/* Paid This Month Card */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/30 shadow-sm">
          <div className="absolute inset-0 opacity-10">
            <Wallet className="absolute -top-4 -right-4 h-32 w-32 text-emerald-600" />
          </div>
          <CardHeader className="pb-2 relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Lunas</CardTitle>
              <div className="p-2 bg-emerald-600/20 rounded-lg">
                <Wallet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">{paidThisMonth}</div>
            <p className="text-xs text-emerald-700/70 dark:text-emerald-300/70 mt-1">{currentMonthName}</p>
          </CardContent>
        </Card>

        {/* Overdue Card */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/30 shadow-sm">
          <div className="absolute inset-0 opacity-10">
            <AlertTriangle className="absolute -top-4 -right-4 h-32 w-32 text-red-600" />
          </div>
          <CardHeader className="pb-2 relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-red-900 dark:text-red-100">Menunggak</CardTitle>
              <div className="p-2 bg-red-600/20 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-red-900 dark:text-red-100">{overdueCount}</div>
            <p className="text-xs text-red-700/70 dark:text-red-300/70 mt-1">Belum bayar tgl 10+</p>
          </CardContent>
        </Card>

        {/* Completion Rate Card */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30 shadow-sm">
          <div className="absolute inset-0 opacity-10">
            <TrendingUp className="absolute -top-4 -right-4 h-32 w-32 text-purple-600" />
          </div>
          <CardHeader className="pb-2 relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">Tingkat Penyelesaian</CardTitle>
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{completionRate}%</div>
            <p className="text-xs text-purple-700/70 dark:text-purple-300/70 mt-1">Bulan ini</p>
          </CardContent>
        </Card>
      </div>

      {/* Matrix Table Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Matriks Pembayaran SPP</CardTitle>
              <CardDescription className="mt-1">
                Visualisasi pembayaran bulanan per siswa. Klik icon untuk input pembayaran.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
              <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-950/50 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-emerald-900 dark:text-emerald-100">Lunas</span>
              </div>
              <div className="flex items-center gap-2 bg-red-100 dark:bg-red-950/50 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-red-900 dark:text-red-100">Menunggak</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 rounded-full bg-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">Pending</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto -mx-6">
            <div className="px-6">
              <TuitionMatrixTable
                students={(students || []) as any}
                payments={transformedPayments as any}
                onEdit={handleEditStudent}
                onDelete={handleDeleteStudent}
                onAddPayment={handleAddPayment}
              />
            </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
