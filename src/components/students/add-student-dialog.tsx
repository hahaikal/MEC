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
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Siswa
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Siswa Baru</DialogTitle>
          <DialogDescription>
            Masukkan data siswa baru. NIS harus unik.
          </DialogDescription>
        </DialogHeader>
        <StudentForm onSubmit={handleSubmit} isLoading={isPending} />
      </DialogContent>
    </Dialog>
  );
}