'use client'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { PaymentStatusCell } from './payment-status-cell'
import { AddStudentDialog } from './add-student-dialog'
import { useDeleteStudent } from '@/lib/hooks/use-mutations'
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
} from '@/components/ui/alert-dialog'
import { useState } from 'react'
import { StudentDetailDialog } from './StudentDetailDialog'

// Sesuaikan tipe data dengan hasil query dari Supabase
export type Student = {
  id: string
  name: string
  nis: string | null
  email: string | null
  class_name: string | null // Update ini
  class_year: string | null
  status: 'ACTIVE' | 'GRADUATED' | 'DROPOUT' | 'ON_LEAVE'
  parent_name: string | null
  phone_number: string | null
  enrollment_date: string | null
  base_fee: number
  created_at: string
}

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nama Siswa
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.getValue('name')}</span>
        <span className="text-xs text-muted-foreground">{row.original.nis || '-'}</span>
      </div>
    ),
  },
  {
    accessorKey: 'class_name',
    header: 'Kelas',
    cell: ({ row }) => {
      const className = row.getValue('class_name') as string
      return className ? <Badge variant="outline">{className}</Badge> : <span className="text-muted-foreground">-</span>
    },
  },
  {
    id: 'januari',
    header: () => <div className="w-20 text-center text-xs font-medium">Jan</div>,
    size: 80,
    cell: ({ row }) => <PaymentStatusCell student={row.original} month={0} />,
  },
  {
    id: 'februari',
    header: () => <div className="w-20 text-center text-xs font-medium">Feb</div>,
    size: 80,
    cell: ({ row }) => <PaymentStatusCell student={row.original} month={1} />,
  },
  {
    id: 'maret',
    header: () => <div className="w-20 text-center text-xs font-medium">Mar</div>,
    size: 80,
    cell: ({ row }) => <PaymentStatusCell student={row.original} month={2} />,
  },
  {
    id: 'april',
    header: () => <div className="w-20 text-center text-xs font-medium">Apr</div>,
    size: 80,
    cell: ({ row }) => <PaymentStatusCell student={row.original} month={3} />,
  },
  {
    id: 'mei',
    header: () => <div className="w-20 text-center text-xs font-medium">Mei</div>,
    size: 80,
    cell: ({ row }) => <PaymentStatusCell student={row.original} month={4} />,
  },
  {
    id: 'juni',
    header: () => <div className="w-20 text-center text-xs font-medium">Jun</div>,
    size: 80,
    cell: ({ row }) => <PaymentStatusCell student={row.original} month={5} />,
  },
  {
    id: 'juli',
    header: () => <div className="w-20 text-center text-xs font-medium">Jul</div>,
    size: 80,
    cell: ({ row }) => <PaymentStatusCell student={row.original} month={6} />,
  },
  {
    id: 'agustus',
    header: () => <div className="w-20 text-center text-xs font-medium">Ags</div>,
    size: 80,
    cell: ({ row }) => <PaymentStatusCell student={row.original} month={7} />,
  },
  {
    id: 'september',
    header: () => <div className="w-20 text-center text-xs font-medium">Sep</div>,
    size: 80,
    cell: ({ row }) => <PaymentStatusCell student={row.original} month={8} />,
  },
  {
    id: 'oktober',
    header: () => <div className="w-20 text-center text-xs font-medium">Okt</div>,
    size: 80,
    cell: ({ row }) => <PaymentStatusCell student={row.original} month={9} />,
  },
  {
    id: 'november',
    header: () => <div className="w-20 text-center text-xs font-medium">Nov</div>,
    size: 80,
    cell: ({ row }) => <PaymentStatusCell student={row.original} month={10} />,
  },
  {
    id: 'desember',
    header: () => <div className="w-20 text-center text-xs font-medium">Des</div>,
    size: 80,
    cell: ({ row }) => <PaymentStatusCell student={row.original} month={11} />,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const student = row.original
      const deleteStudent = useDeleteStudent()
      const [showDeleteAlert, setShowDeleteAlert] = useState(false)
      const [showDetailDialog, setShowDetailDialog] = useState(false)

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setShowDetailDialog(true)}>
                Lihat Detail & Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600"
                onClick={() => setShowDeleteAlert(true)}
              >
                Hapus Siswa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini tidak dapat dibatalkan. Data siswa beserta riwayat pembayarannya akan dihapus permanen.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => deleteStudent.mutate(student.id)}
                >
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
           {/* Dialog Edit/Detail menggunakan form yang sama, di wrap component wrapper */}
           {/* Catatan: Untuk simplifikasi, logic edit biasanya digabung dengan AddStudentDialog atau dialog terpisah yang memanggil StudentForm */}
           <AddStudentDialog 
             open={showDetailDialog} 
             onOpenChange={setShowDetailDialog}
             studentToEdit={student} 
           />
        </>
      )
    },
  },
]