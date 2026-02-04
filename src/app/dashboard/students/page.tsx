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
import { PlusCircle, Users, Wallet, AlertTriangle } from "lucide-react"
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
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-[400px] w-full" />
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

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Siswa & SPP</h1>
          <p className="text-muted-foreground">
            Monitor status pembayaran real-time dan kelola data murid.
          </p>
        </div>
        <div className="flex gap-2">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Siswa Baru
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Siswa Aktif</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Siswa terdaftar</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lunas ({currentMonthName})</CardTitle>
            <Wallet className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{paidThisMonth}</div>
            <p className="text-xs text-muted-foreground">Telah melakukan pembayaran</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menunggak</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{overdueCount}</div>
            <p className="text-xs text-muted-foreground">Belum bayar setelah tanggal 10</p>
          </CardContent>
        </Card>
      </div>

      {/* Matrix Table Section */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tuition Matrix View</CardTitle>
              <CardDescription>
                Visualisasi pembayaran bulanan. Klik icon jam untuk input pembayaran.
              </CardDescription>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500" /> Lunas
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive" /> Menunggak
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-muted-foreground/30" /> Belum Waktunya
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TuitionMatrixTable
            students={(students || []) as any}
            payments={transformedPayments as any}
            onEdit={handleEditStudent}
            onDelete={handleDeleteStudent}
            onAddPayment={handleAddPayment}
          />
        </CardContent>
      </Card>
    </div>
  )
}