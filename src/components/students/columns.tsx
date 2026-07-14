'use client'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, ArrowUpDown, Pencil, Trash2 } from 'lucide-react'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
} from '@/components/ui/alert-dialog'
import { useState } from 'react'
import { StudentDetailDialog } from './StudentDetailDialog'

export type Student = {
  id: string
  name: string
  enrollments: any[]
  class_name: string | null
  phone_number: string | null
  enrollment_date: string | null
  created_at: string

  place_of_birth?: string | null
  date_of_birth?: string | null
  gender?: string | null
  religion?: string | null
  school_origin?: string | null
  joined_since_class?: string | null
  father_name?: string | null
  mother_name?: string | null
  father_occupation?: string | null
  mother_occupation?: string | null
  address?: string | null
  parent_phone?: string | null
  photo_url?: string | null

  nis?: string | null
  status?: string | null

  registration_sort?: number;
  book_fee_sort?: number;
  januari_sort?: number;
  februari_sort?: number;
  maret_sort?: number;
  april_sort?: number;
  mei_sort?: number;
  juni_sort?: number;
  juli_sort?: number;
  agustus_sort?: number;
  september_sort?: number;
  oktober_sort?: number;
  november_sort?: number;
  desember_sort?: number;
}

const SortableHeader = ({ column, title }: { column: any, title: string }) => (
  <Button
    variant="ghost"
    className="px-0 w-20 justify-center h-8 text-xs font-medium"
    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  >
    {title}
    <ArrowUpDown className="ml-1 h-3 w-3" />
  </Button>
)

export const columns: ColumnDef<Student>[] = [
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
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setShowDetailDialog(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Lihat Detail & Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600"
                onClick={() => setShowDeleteAlert(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Nonaktifkan Siswa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                <AlertDialogDescription>
                  Data siswa ini akan dinonaktifkan. Data siswa dan riwayat pembayarannya tetap tersimpan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => deleteStudent.mutate(student.id)}
                >
                  Nonaktifkan
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
           <AddStudentDialog 
             open={showDetailDialog} 
             onOpenChange={setShowDetailDialog}
             studentToEdit={student} 
           />
        </>
      )
    },
  },
  {
    id: 'index',
    header: () => <div className="w-8 text-center text-xs font-medium">No</div>,
    size: 40,
    cell: ({ row, table }) => <div className="text-center text-xs text-muted-foreground">{table.getSortedRowModel().flatRows.indexOf(row) + 1}</div>,
  },
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
    cell: ({ row }) => {
      const [showDetail, setShowDetail] = useState(false)
      const student = row.original

      return (
        <>
          <div
            className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 p-1 rounded transition-colors"
            onClick={() => setShowDetail(true)}
          >
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={student.photo_url || undefined} alt={student.name} className="object-cover" />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {student.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-primary hover:underline">{row.getValue('name')}</span>
              <span className="text-xs text-muted-foreground">{student.nis || '-'}</span>
            </div>
          </div>
          <StudentDetailDialog
             open={showDetail}
             onOpenChange={setShowDetail}
             student={student}
           />
        </>
      )
    },
  },
  {
    accessorKey: 'enrollments',
    header: 'Kelas',
    cell: ({ row }) => {
      const enrollments = row.getValue('enrollments') as any[]
      if (!enrollments || enrollments.length === 0) return <span className="text-muted-foreground">-</span>
      return (
        <div className="flex flex-wrap gap-1">
          {enrollments.map((enr: any, i: number) => (
            <Badge key={i} variant="outline">{enr.class_name}</Badge>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: 'registration_sort',
    header: ({ column }) => <SortableHeader column={column} title="Reg" />,
    size: 80,
    cell: ({ row }) => <PaymentStatusCell student={row.original} isRegistration={true} month={-1} />,
  },
  {
    accessorKey: 'book_fee_sort',
    header: ({ column }) => <SortableHeader column={column} title="Book" />,
    size: 80,
    cell: ({ row }) => <PaymentStatusCell student={row.original} isBookFee={true} month={-2} />,
  },
  {
    accessorKey: 'januari_sort',
    header: ({ column }) => <SortableHeader column={column} title="Jan" />,
    size: 80,
    cell: ({ row }) => <PaymentStatusCell student={row.original} month={0} />,
  },
  {
    accessorKey: 'februari_sort',
    header: ({ column }) => <SortableHeader column={column} title="Feb" />,
    size: 80,
    cell: ({ row }) => <PaymentStatusCell student={row.original} month={1} />,
  },
  {
    accessorKey: 'maret_sort',
    header: ({ column }) => <SortableHeader column={column} title="Mar" />,
    size: 80,
    cell: ({ row }) => <PaymentStatusCell student={row.original} month={2} />,
  },
  {
    accessorKey: 'april_sort',
    header: ({ column }) => <SortableHeader column={column} title="Apr" />,
    size: 80,
    cell: ({ row }) => <PaymentStatusCell student={row.original} month={3} />,
  },
  {
    accessorKey: 'mei_sort',
    header: ({ column }) => <SortableHeader column={column} title="Mei" />,
    size: 80,
    cell: ({ row }) => <PaymentStatusCell student={row.original} month={4} />,
  },
  {
    accessorKey: 'juni_sort',
    header: ({ column }) => <SortableHeader column={column} title="Jun" />,
    size: 80,
    cell: ({ row }) => <PaymentStatusCell student={row.original} month={5} />,
  },
  {
    accessorKey: 'juli_sort',
    header: ({ column }) => <SortableHeader column={column} title="Jul" />,
    size: 80,
    cell: ({ row }) => <PaymentStatusCell student={row.original} month={6} />,
  },
  {
    accessorKey: 'agustus_sort',
    header: ({ column }) => <SortableHeader column={column} title="Ags" />,
    size: 80,
    cell: ({ row }) => <PaymentStatusCell student={row.original} month={7} />,
  },
  {
    accessorKey: 'september_sort',
    header: ({ column }) => <SortableHeader column={column} title="Sep" />,
    size: 80,
    cell: ({ row }) => <PaymentStatusCell student={row.original} month={8} />,
  },
  {
    accessorKey: 'oktober_sort',
    header: ({ column }) => <SortableHeader column={column} title="Okt" />,
    size: 80,
    cell: ({ row }) => <PaymentStatusCell student={row.original} month={9} />,
  },
  {
    accessorKey: 'november_sort',
    header: ({ column }) => <SortableHeader column={column} title="Nov" />,
    size: 80,
    cell: ({ row }) => <PaymentStatusCell student={row.original} month={10} />,
  },
  {
    accessorKey: 'desember_sort',
    header: ({ column }) => <SortableHeader column={column} title="Des" />,
    size: 80,
    cell: ({ row }) => <PaymentStatusCell student={row.original} month={11} />,
  },
]
