import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { PlusCircle, User, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function StudentsPage() {
  const supabase = await createClient()

  // 1. Fetch data siswa dari Supabase
  // Kita mengambil semua kolom (*) untuk ditampilkan di tabel
  const { data: students, error } = await supabase
    .from("students")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return <div className="p-8 text-red-500">Error loading students: {error.message}</div>
  }

  // Helper untuk format Rupiah agar terlihat profesional
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Data Siswa</h1>
          <p className="text-muted-foreground">
            Kelola data siswa dan atur biaya dasar SPP (Base Fee).
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Siswa Baru
        </Button>
      </div>

      {/* Stats Cards - Ringkasan cepat di atas tabel */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Terdaftar di sistem</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabel Data Siswa */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Siswa Aktif</CardTitle>
          <CardDescription>
            Menampilkan data siswa beserta Base Fee mereka.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Lengkap</TableHead>
                  <TableHead>Angkatan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>SPP Dasar (Base Fee)</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Belum ada data siswa. Silahkan tambah siswa baru.
                    </TableCell>
                  </TableRow>
                ) : (
                  students?.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex flex-col">
                            <span>{student.name}</span>
                            <span className="text-xs text-muted-foreground">{student.email || "-"}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.class_year || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">
                        {formatRupiah(student.base_fee || 0)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
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