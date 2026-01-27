'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle, Users, TrendingUp } from 'lucide-react'
import { AddStudentDialog } from '@/components/students/add-student-dialog'
import { TuitionMatrixTable } from '@/components/students/tuition-matrix-table'

export default function StudentsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const supabase = createClient()

  // Fetch students with their program info
  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('status', 'active')
        .order('name')

      if (error) throw error
      return data || []
    },
  })

  // Fetch student programs to get class/program info
  const { data: studentPrograms = [] } = useQuery({
    queryKey: ['student-programs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_programs')
        .select('student_id, program_id, programs(*)')
        .eq('status', 'active')

      if (error) throw error
      return data || []
    },
  })

  // Combine student and program data
  const enrichedStudents = students.map((student) => {
    const enrollment = studentPrograms.find(
      (sp) => sp.student_id === student.id
    )
    const program = enrollment?.programs as any

    return {
      id: student.id,
      name: student.name,
      program_name: program?.name || 'Tidak ada kelas',
      program_price: program?.price || 0,
    }
  })

  const stats = {
    totalStudents: students.length,
    activeEnrollments: studentPrograms.length,
    monthlyRevenue: studentPrograms.reduce(
      (sum, sp) => sum + ((sp.programs as any)?.price || 0),
      0
    ),
  }

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Data Siswa</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Kelola data siswa dan pantau status pembayaran SPP setiap bulannya dengan mudah
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="w-full md:w-auto h-11 gap-2 bg-primary hover:bg-primary/90"
          size="lg"
        >
          <PlusCircle className="h-5 w-5" />
          Tambah Siswa Baru
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Total Siswa</CardTitle>
            <div className="p-2.5 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalStudents}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Siswa aktif di sistem
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Pendaftaran Aktif
            </CardTitle>
            <div className="p-2.5 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.activeEnrollments}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Enrollment saat ini
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Potensi Bulanan</CardTitle>
            <div className="p-2.5 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {formatRupiah(stats.monthlyRevenue)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Jika semua membayar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tuition Matrix Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b bg-slate-50 rounded-t-lg">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-xl">Matriks SPP Siswa</CardTitle>
            <CardDescription className="text-base">
              Pantau status pembayaran SPP bulanan. Klik ikon (+) untuk catat pembayaran baru
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <TuitionMatrixTable
            students={enrichedStudents}
            isLoading={studentsLoading}
          />
        </CardContent>
      </Card>

      {/* Add Student Dialog */}
      <AddStudentDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
