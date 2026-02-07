"use client";

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { StudentForm } from "./student-form"

interface AddStudentDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  studentToEdit?: any; // Adjust type as needed
}

export function AddStudentDialog({ open, onOpenChange, studentToEdit }: AddStudentDialogProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false)

  const isControlled = open !== undefined && onOpenChange !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange : setInternalOpen;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Tambah Siswa
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{studentToEdit ? 'Edit Siswa' : 'Tambah Siswa Baru'}</DialogTitle>
          <DialogDescription>
            {studentToEdit ? 'Edit data siswa di sini. Klik simpan setelah selesai.' : 'Masukkan data siswa baru di sini. Klik simpan setelah selesai.'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <StudentForm onSuccess={() => setDialogOpen?.(false)} studentToEdit={studentToEdit} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
