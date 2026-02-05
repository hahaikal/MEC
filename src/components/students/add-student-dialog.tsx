"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { StudentForm } from "./student-form";
import { useCreateStudent } from "@/lib/hooks/use-students";
import { StudentFormValues } from "@/lib/validators/student";

export function AddStudentDialog() {
  const [open, setOpen] = useState(false);
  const { mutateAsync: createStudent, isPending } = useCreateStudent();

  const handleSubmit = async (values: StudentFormValues) => {
    try {
      await createStudent(values);
      setOpen(false);
    } catch (error) {
      // Error handled by mutation hook toaster
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Tambah Siswa
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Tambah Siswa Baru</DialogTitle>
          <DialogDescription>
            Lengkapi form berikut untuk mendaftarkan siswa baru. Pastikan NIS yang diinput belum terdaftar.
          </DialogDescription>
        </DialogHeader>
        <StudentForm onSubmit={handleSubmit} isLoading={isPending} />
      </DialogContent>
    </Dialog>
  );
}
