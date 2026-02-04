'use client'

import React from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { 
  MoreHorizontal, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Trash2, 
  Edit 
} from "lucide-react"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
// Memastikan import dari path yang benar
import { formatRupiah, MONTHS_LIST } from "@/lib/utils"

interface PaymentRecord {
  id: string
  student_id: string
  month: string
  amount: number
  payment_date: string
}

interface Student {
  id: string
  name: string
  email?: string
  class_year: string
  status: 'active' | 'inactive' | 'graduated'
  base_fee: number
}

interface TuitionMatrixProps {
  students: Student[]
  payments: PaymentRecord[]
  onEdit: (student: Student) => void
  onDelete: (id: string) => void
  onAddPayment: (studentId: string, month: string) => void
}

export function TuitionMatrixTable({ 
  students, 
  payments, 
  onEdit, 
  onDelete,
  onAddPayment 
}: TuitionMatrixProps) {
  
  const today = new Date()
  const currentDay = today.getDate()
  const currentMonthIdx = today.getMonth() // 0-11

  // Helper untuk mengecek status pembayaran per siswa per bulan
  const getPaymentStatus = (studentId: string, month: string, monthIdx: number) => {
    const payment = payments.find(p => p.student_id === studentId && p.month === month)
    
    if (payment) return "PAID"
    
    // Logika PM: Jika bulan sudah lewat atau bulan ini sudah lewat tanggal 10
    if (monthIdx < currentMonthIdx || (monthIdx === currentMonthIdx && currentDay > 10)) {
      return "OVERDUE"
    }
    
    return "PENDING"
  }

  return (
    <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-muted/50 to-muted/25 hover:bg-gradient-to-r hover:from-muted/50 hover:to-muted/25">
              <TableHead className="sticky left-0 bg-gradient-to-r from-muted/50 to-muted/25 z-10 min-w-[220px] border-r font-bold">Data Siswa</TableHead>
              {MONTHS_LIST.map((month) => (
                <TableHead key={month} className="text-center min-w-[100px] font-semibold">{month.substring(0, 3)}</TableHead>
              ))}
              <TableHead className="text-right sticky right-0 bg-gradient-to-r from-muted/25 to-muted/50 z-10 border-l font-bold">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={MONTHS_LIST.length + 2} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Users className="h-8 w-8 text-muted-foreground/30" />
                    <span className="text-muted-foreground">Belum ada data siswa yang terdaftar.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              students.map((student, idx) => (
                <TableRow 
                  key={student.id} 
                  className="group hover:bg-muted/30 transition-colors border-b border-border/50 last:border-b-0"
                >
                  <TableCell className="sticky left-0 bg-background group-hover:bg-muted/20 font-medium border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] z-10">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/30 to-primary/10">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="truncate text-sm font-semibold">{student.name}</span>
                        <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">
                          Angkatan {student.class_year}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  
                  {MONTHS_LIST.map((month, idx) => {
                    const status = getPaymentStatus(student.id, month, idx)
                    return (
                      <TableCell key={month} className="text-center p-0">
                        <button 
                          onClick={() => status !== "PAID" && onAddPayment(student.id, month)}
                          className="w-full h-14 flex items-center justify-center transition-all duration-200 hover:bg-muted/50 active:scale-95"
                          title={`${month}: ${status}`}
                          disabled={status === "PAID"}
                        >
                          {status === "PAID" ? (
                            <div className="flex items-center justify-center">
                              <CheckCircle2 className="h-5 w-5 text-emerald-500 drop-shadow-sm" />
                            </div>
                          ) : status === "OVERDUE" ? (
                            <div className="flex items-center justify-center">
                              <div className="relative">
                                <AlertCircle className="h-5 w-5 text-destructive animate-pulse" />
                                <div className="absolute inset-0 text-destructive/20 animate-ping">
                                  <AlertCircle className="h-5 w-5" />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <Clock className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary/60 transition-colors" />
                          )}
                        </button>
                      </TableCell>
                    )
                  })}

                  <TableCell className="text-right sticky right-0 bg-background group-hover:bg-muted/20 border-l shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] z-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted/50">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Opsi Siswa</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(student)} className="gap-2">
                          <Edit className="h-4 w-4" /> 
                          <span>Edit Data</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-destructive/20 hover:text-destructive data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-destructive gap-2">
                              <Trash2 className="h-4 w-4" /> 
                              <span>Hapus Siswa</span>
                            </div>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus <strong>{student.name}</strong>? Seluruh data tunggakan dan histori pembayaran akan dihapus permanen.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => onDelete(student.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Ya, Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
  )
}
