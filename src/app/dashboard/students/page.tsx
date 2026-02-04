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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PlusCircle, Users, Wallet, AlertTriangle, TrendingUp, Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { TuitionMatrixTable } from "@/components/finance/tuition-matrix-table"
import { toast } from "@/lib/hooks/use-toast"
import { formatRupiah, MONTHS_LIST } from "@/lib/utils"

export default function StudentsPage() {
  const { data: students, isLoading: isLoadingStudents, refetch: refetchStudents } = useStudents()
  const { data: payments, isLoading: isLoadingPayments } = usePayments()
  const [openAddStudent, setOpenAddStudent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    class_year: '2024',
    base_fee: '',
  })

  // Handler untuk tambah siswa baru
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.base_fee) {
      toast({
        title: "Error",
        description: "Semua field harus diisi",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // TODO: Integrasi dengan API untuk tambah siswa
      console.log("Adding student:", formData)
      
      toast({
        title: "Sukses",
        description: `Siswa ${formData.name} berhasil ditambahkan`,
      })
      
      setFormData({
        name: '',
        email: '',
        class_year: '2024',
        base_fee: '',
      })
      setOpenAddStudent(false)
      refetchStudents()
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menambahkan siswa",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
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
      <div className="flex flex-col gap-6 animate-pulse">
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
    <div className="flex flex-col gap-8">
      {/* Header Section - Sleek and Modern */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Manajemen Siswa</h1>
          <p className="text-sm lg:text-base text-muted-foreground max-w-2xl">
            Kelola seluruh data siswa, monitor pembayaran SPP bulanan, dan lacak status finansial setiap siswa dengan mudah
          </p>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <Dialog open={openAddStudent} onOpenChange={setOpenAddStudent}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Tambah Siswa
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Tambah Siswa Baru</DialogTitle>
                <DialogDescription>
                  Masukkan informasi lengkap siswa baru ke dalam sistem
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddStudent} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Nama Lengkap</Label>
                  <Input
                    id="name"
                    placeholder="Masukkan nama siswa"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={isSubmitting}
                    className="h-9"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="siswa@sekolah.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={isSubmitting}
                    className="h-9"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="class_year" className="text-sm font-medium">Angkatan</Label>
                    <Select value={formData.class_year} onValueChange={(value) => setFormData({ ...formData, class_year: value })}>
                      <SelectTrigger id="class_year" disabled={isSubmitting} className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="base_fee" className="text-sm font-medium">SPP Bulanan (Rp)</Label>
                    <Input
                      id="base_fee"
                      type="number"
                      placeholder="500000"
                      value={formData.base_fee}
                      onChange={(e) => setFormData({ ...formData, base_fee: e.target.value })}
                      disabled={isSubmitting}
                      className="h-9"
                    />
                  </div>
                </div>

                <DialogFooter className="gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpenAddStudent(false)}
                    disabled={isSubmitting}
                    size="sm"
                  >
                    Batal
                  </Button>
                  <Button type="submit" disabled={isSubmitting} size="sm" className="gap-2">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Menyimpan
                      </>
                    ) : (
                      <>
                        <PlusCircle className="h-4 w-4" />
                        Tambah
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Key Metrics - Clean and Minimal */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Siswa */}
        <Card className="border border-border/50 hover:border-border transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardDescription className="text-xs font-medium mb-1">Total Siswa</CardDescription>
                <CardTitle className="text-2xl lg:text-3xl">{totalStudents}</CardTitle>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Siswa aktif terdaftar</p>
          </CardContent>
        </Card>

        {/* Lunas */}
        <Card className="border border-border/50 hover:border-border transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardDescription className="text-xs font-medium mb-1">Lunas Bulan Ini</CardDescription>
                <CardTitle className="text-2xl lg:text-3xl">{paidThisMonth}</CardTitle>
              </div>
              <div className="p-2 bg-emerald-100 dark:bg-emerald-950 rounded-lg">
                <Wallet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">{currentMonthName}</p>
          </CardContent>
        </Card>

        {/* Menunggak */}
        <Card className="border border-border/50 hover:border-border transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardDescription className="text-xs font-medium mb-1">Menunggak</CardDescription>
                <CardTitle className="text-2xl lg:text-3xl text-red-600">{overdueCount}</CardTitle>
              </div>
              <div className="p-2 bg-red-100 dark:bg-red-950 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Belum bayar setelah tgl 10</p>
          </CardContent>
        </Card>

        {/* Persentase */}
        <Card className="border border-border/50 hover:border-border transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardDescription className="text-xs font-medium mb-1">Tingkat Pembayaran</CardDescription>
                <CardTitle className="text-2xl lg:text-3xl">{completionRate}%</CardTitle>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg">
                <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Siswa yang sudah membayar</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Matrix Table */}
      <Card className="border border-border/50">
        <CardHeader className="pb-4 border-b border-border/50">
          <div className="flex flex-col gap-4">
            <div>
              <CardTitle className="text-lg">Matriks Pembayaran SPP</CardTitle>
              <CardDescription className="mt-1">
                Kelola dan monitor status pembayaran setiap siswa per bulan
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Lunas</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-xs font-medium text-red-700 dark:text-red-300">Menunggak</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="w-2 h-2 rounded-full bg-gray-400" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Pending</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto -mx-6">
            <div className="px-6 py-4">
              <TuitionMatrixTable
                students={(students || []) as any}
                payments={transformedPayments as any}
                onEdit={handleEditStudent}
                onDelete={handleDeleteStudent}
                onAddPayment={handleAddPayment}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
