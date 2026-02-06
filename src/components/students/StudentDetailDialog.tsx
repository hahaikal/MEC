import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  School, 
  CreditCard
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Pencil, Save, X } from "lucide-react"
import { StudentForm } from "./student-form"
import { useState } from "react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

interface StudentDetail {
  id: string
  name: string
  nis?: string
  email?: string
  phone_number?: string
  address?: string
  date_of_birth?: string
  status: string
  parent_name?: string
  parent_phone?: string
  enrollment_date?: string
  base_fee: number
  billing_cycle_date?: number
  // Relasi (bisa single object atau array tergantung query supabase)
  classes?: { name: string } | null
  student_programs?: { programs: { name: string } }[]
}

interface StudentDetailDialogProps {
  student: StudentDetail | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StudentDetailDialog({
  student,
  open,
  onOpenChange
}: StudentDetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false)
  const queryClient = useQueryClient()

  if (!student) return null

  // Helper untuk mengambil nama program dengan aman
  const programNames = student.student_programs && student.student_programs.length > 0
    ? student.student_programs.map(sp => sp.programs?.name).filter(Boolean).join(", ")
    : "Belum ada program"

  const handleEditSuccess = () => {
    setIsEditing(false)
    toast.success("Student updated successfully")
    queryClient.invalidateQueries({ queryKey: ["students"] })
  }

  const handleEditCancel = () => {
    setIsEditing(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <User className="h-5 w-5" />
              {isEditing ? "Edit Student" : student.name}
            </DialogTitle>
            {!isEditing && (
              <Badge variant={student.status === 'ACTIVE' ? 'default' : 'secondary'}>
                {student.status}
              </Badge>
            )}
          </div>
          {student.nis && !isEditing && (
            <p className="text-sm text-muted-foreground">NIS: {student.nis}</p>
          )}
        </DialogHeader>

        {isEditing ? (
          <StudentForm
            defaultValues={{
              name: student.name,
              nis: student.nis || "",
              email: student.email || "",
              phone_number: student.phone_number || "",
              parent_name: student.parent_name || "",
              parent_phone: student.parent_phone || "",
              address: student.address || "",
              date_of_birth: student.date_of_birth || "",
              status: student.status,
              class_id: student.classes?.id || undefined,
              program_id: student.student_programs?.[0]?.programs?.id || "",
              base_fee: student.base_fee,
              billing_cycle_date: student.billing_cycle_date || 10,
            }}
            onSubmit={handleEditSuccess}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              {/* Info Akademik */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-primary flex items-center gap-2">
                  <School className="h-4 w-4" /> Informasi Akademik
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground">Kelas</span>
                    <span className="col-span-2 font-medium">
                      {student.classes?.name || "-"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground">Program</span>
                    <span className="col-span-2 font-medium">
                      {programNames}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground">Tgl Masuk</span>
                    <span className="col-span-2">
                      {student.enrollment_date
                        ? new Date(student.enrollment_date).toLocaleDateString('id-ID')
                        : "-"
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Info Keuangan */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-primary flex items-center gap-2">
                  <CreditCard className="h-4 w-4" /> Informasi Keuangan
                </h3>
                <div className="space-y-3 text-sm">
                   <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground">SPP Bulanan</span>
                    <span className="col-span-2 font-bold text-green-600">
                      {formatCurrency(student.base_fee)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground">Jatuh Tempo</span>
                    <span className="col-span-2">
                      Tanggal {student.billing_cycle_date || 10} setiap bulan
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              {/* Info Kontak */}
              <div className="space-y-4">
                 <h3 className="font-semibold text-sm text-primary flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Kontak Siswa
                </h3>
                 <div className="space-y-2 text-sm">
                   <div className="flex items-center gap-2">
                     <Mail className="h-3 w-3 text-muted-foreground" />
                     <span>{student.email || "-"}</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <Phone className="h-3 w-3 text-muted-foreground" />
                     <span>{student.phone_number || "-"}</span>
                   </div>
                   <div className="flex items-start gap-2">
                     <MapPin className="h-3 w-3 text-muted-foreground mt-1" />
                     <span>{student.address || "-"}</span>
                   </div>
                 </div>
              </div>

              {/* Info Orang Tua */}
              <div className="space-y-4">
                 <h3 className="font-semibold text-sm text-primary flex items-center gap-2">
                  <User className="h-4 w-4" /> Orang Tua / Wali
                </h3>
                 <div className="space-y-2 text-sm">
                   <div className="grid grid-cols-3 gap-2">
                     <span className="text-muted-foreground">Nama</span>
                     <span className="col-span-2 font-medium">{student.parent_name || "-"}</span>
                   </div>
                   <div className="grid grid-cols-3 gap-2">
                     <span className="text-muted-foreground">Telepon</span>
                     <span className="col-span-2">{student.parent_phone || "-"}</span>
                   </div>
                 </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Student
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}