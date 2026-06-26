'use client'

import { useClasses } from '@/lib/hooks/use-classes'
import { ClassDialog } from '@/components/classes/class-dialog'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useState, useMemo } from 'react'
import { Pencil, Trash2, Users, ArrowUpAZ, ArrowDownZA } from 'lucide-react'
import { deleteClass } from '@/actions/classes'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const SCHEDULE_LABEL: Record<string, string> = { 
  'Monday': 'Sen', 'Tuesday': 'Sel', 'Wednesday': 'Rab', 
  'Thursday': 'Kam', 'Friday': 'Jum', 'Saturday': 'Sab', 'Sunday': 'Min' 
}

export default function ClassesPage() {
  const { data: classes, isLoading } = useClasses()
  const queryClient = useQueryClient()
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const sortedClasses = useMemo(() => {
    if (!classes) return []
    return [...classes].sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else if (sortBy === 'teacher') {
        const tA = a.teachers?.map((t: any) => t.full_name).join(', ') || ''
        const tB = b.teachers?.map((t: any) => t.full_name).join(', ') || ''
        return sortOrder === 'asc' ? tA.localeCompare(tB) : tB.localeCompare(tA)
      } else if (sortBy === 'students') {
        const sA = a.enrolled_count || 0
        const sB = b.enrolled_count || 0
        return sortOrder === 'asc' ? sA - sB : sB - sA
      }
      return 0
    })
  }, [classes, sortBy, sortOrder])

  const handleDelete = async (id: string) => {
    const res = await deleteClass(id)
    if (res.error) {
       toast.error(res.error)
    } else {
       toast.success("Kelas berhasil dihapus")
       queryClient.invalidateQueries({ queryKey: ['classes'] })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Kelas</h1>
          <p className="text-muted-foreground mt-1">Kelola data kelas dan guru pengajar.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Urutkan berdasarkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nama Kelas</SelectItem>
              <SelectItem value="teacher">Guru Pengajar</SelectItem>
              <SelectItem value="students">Jumlah Siswa</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}>
            {sortOrder === 'asc' ? <ArrowUpAZ className="h-4 w-4" /> : <ArrowDownZA className="h-4 w-4" />}
          </Button>
          <ClassDialog />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="table-fixed min-w-[900px] [&_td]:whitespace-normal [&_th]:whitespace-normal break-words">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[20%]">Nama Kelas</TableHead>
                  <TableHead className="w-[15%]">Program</TableHead>
                  <TableHead className="w-[25%]">Jadwal Kelas</TableHead>
                  <TableHead className="w-[20%]">Guru Pengajar</TableHead>
                  <TableHead className="w-[10%]">Jml Siswa</TableHead>
                  <TableHead className="w-[10%] text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="p-8"><Skeleton className="h-40 w-full" /></TableCell>
                  </TableRow>
                ) : classes?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center p-8 text-muted-foreground">Tidak ada data kelas.</TableCell>
                  </TableRow>
                ) : (
                  sortedClasses.map(c => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>{c.programs?.name || <span className="text-muted-foreground text-sm italic">Belum ditentukan</span>}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                           {c.schedule_days && c.schedule_days.length > 0 ? (
                              c.schedule_days.map((d: string) => (
                                <span key={d} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                                  {SCHEDULE_LABEL[d] || d}
                                </span>
                              ))
                           ) : (
                              <span className="text-muted-foreground text-sm italic">Belum diatur</span>
                           )}
                        </div>
                      </TableCell>
                      <TableCell>{c.teachers && c.teachers.length > 0 ? c.teachers.map((t: any) => t.full_name).join(', ') : <span className="text-muted-foreground text-sm italic">Belum ditentukan</span>}</TableCell>
                      <TableCell>
                         <div className="flex items-center gap-2">
                           <Users className="h-4 w-4 text-muted-foreground" />
                           {c.enrolled_count}
                         </div>
                      </TableCell>
                      <TableCell className="text-right">
                         <div className="flex justify-end gap-2">
                           <ClassDialog classToEdit={c}>
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                               <Pencil className="h-4 w-4" />
                             </Button>
                           </ClassDialog>

                           <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus kelas ini?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Jika kelas dihapus, maka seluruh data enrollment siswa dan log absensi terkait kelas ini juga akan terhapus. Tindakan ini tidak dapat dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(c.id)} className="bg-red-600 hover:bg-red-700">
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                         </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
