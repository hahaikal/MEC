import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { StudentForm, StudentFormValues } from "./student-form"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

export function AddStudentDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (data: StudentFormValues) => {
    setIsLoading(true)
    try {
      // 1. Insert Data Siswa ke tabel 'students'
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .insert({
          name: data.name,
          email: data.email || null,
          phone_number: data.phone_number || null,
          parent_name: data.parent_name || null,
          parent_phone: data.parent_phone || null,
          address: data.address || null,
          date_of_birth: data.date_of_birth || null,
          status: data.status || "ACTIVE",
          class_id: data.class_id || null,
          base_fee: data.base_fee,
          billing_cycle_date: data.billing_cycle_date,
          nis: data.nis || null,
          // user_id pembuat akan dihandle oleh trigger/default di database atau RLS
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single()

      if (studentError) throw studentError

      // 2. Insert Data Program ke tabel 'student_programs' (Enrollment)
      if (data.program_id && studentData) {
        const { error: programError } = await supabase
          .from('student_programs')
          .insert({
            student_id: studentData.id,
            program_id: data.program_id,
            status: 'active',
            enrollment_date: new Date().toISOString()
          })

        if (programError) {
          console.error("Gagal menyimpan program:", programError)
          toast.error("Siswa tersimpan, tapi gagal menyimpan program.")
        }
      }

      toast.success("Siswa berhasil ditambahkan")
      setOpen(false)
      
      // Refresh state aplikasi
      queryClient.invalidateQueries({ queryKey: ["students"] }) // Refresh cache data
      router.refresh() // Refresh Server Components (Table)

    } catch (error: any) {
      console.error(error)
      toast.error("Gagal menambahkan siswa: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Siswa
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Tambah Siswa Baru</DialogTitle>
          <DialogDescription>
            Masukkan data siswa baru. Pastikan memilih Kelas dan Program yang sesuai.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <StudentForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </DialogContent>
    </Dialog>
  )
}