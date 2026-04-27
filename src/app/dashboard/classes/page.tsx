'use client'

import { useClasses } from '@/lib/hooks/use-classes'
import { ClassDialog } from '@/components/classes/class-dialog'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, Users } from 'lucide-react'
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

export default function ClassesPage() {
  const { data: classes, isLoading } = useClasses()
  const queryClient = useQueryClient()

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
          <p className="text-muted-foreground mt-1">Kelola data kelas, target pertemuan, dan guru pengajar.</p>
        </div>
        <ClassDialog />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Kelas</TableHead>
                  <TableHead>Target Pertemuan</TableHead>
                  <TableHead>Guru Pengajar</TableHead>
                  <TableHead>Jml Siswa</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="p-8"><Skeleton className="h-40 w-full" /></TableCell>
                  </TableRow>
                ) : classes?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center p-8 text-muted-foreground">Tidak ada data kelas.</TableCell>
                  </TableRow>
                ) : (
                  classes?.map(c => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>{c.target_meetings}</TableCell>
                      <TableCell>{c.teacher_name || <span className="text-muted-foreground text-sm italic">Belum ditentukan</span>}</TableCell>
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
