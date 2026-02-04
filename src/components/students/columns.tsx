"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StudentForm } from "./student-form";
import { useUpdateStudent, useDeleteStudent } from "@/lib/hooks/use-students";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Definisikan tipe data untuk kolom agar sesuai dengan return dari getStudents
export type Student = {
  id: string;
  nis: string;
  name: string;
  status: string;
  parent_name: string;
  parent_phone: string;
  base_fee: number;
  email?: string | null;
  phone_number?: string | null;
  address?: string | null;
  date_of_birth?: string | null; // Supabase returns dates as strings
  classes?: {
    name: string;
  } | null;
  billing_cycle_date?: number | null;
  enrollment_date?: string | null;
  class_year?: string | null;
  class_id?: string | null;
};

const ActionCell = ({ student }: { student: Student }) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { mutateAsync: updateStudent, isPending: isUpdating } = useUpdateStudent();
  const { mutateAsync: deleteStudent, isPending: isDeleting } = useDeleteStudent();

  const handleUpdate = async (values: any) => {
    // Convert date string back to Date object for the form if needed,
    // but the form handles date objects. The validator expects dates.
    // values coming from form are already correct.
    await updateStudent({ id: student.id, data: values });
    setShowEditDialog(false);
  };

  const handleDelete = async () => {
    await deleteStudent(student.id);
    setShowDeleteDialog(false);
  };

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
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(student.nis)}>
            Salin NIS
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Pencil className="mr-2 h-4 w-4" /> Edit Data
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" /> Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Siswa: {student.name}</DialogTitle>
          </DialogHeader>
          <StudentForm
            defaultValues={{
              ...student,
              email: student.email || "",
              phone_number: student.phone_number || "",
              address: student.address || "",
              date_of_birth: student.date_of_birth ? new Date(student.date_of_birth) : undefined,
              enrollment_date: student.enrollment_date ? new Date(student.enrollment_date) : undefined,
              billing_cycle_date: student.billing_cycle_date || 10,
              base_fee: Number(student.base_fee),
              status: student.status as any,
              class_year: student.class_year ?? undefined,
            }}
            onSubmit={handleUpdate}
            isLoading={isUpdating}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data siswa <strong>{student.name}</strong> dan riwayat pembayarannya mungkin akan terpengaruh.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700" disabled={isDeleting}>
              {isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "nis",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          NIS
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "classes.name",
    header: "Kelas",
    cell: ({ row }) => {
        const className = row.original.classes?.name;
        return className || "-";
    }
  },
  {
    accessorKey: "parent_name",
    header: "Orang Tua",
  },
  {
    accessorKey: "parent_phone",
    header: "HP Ortu",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        ACTIVE: "default", // Hijau/Hitam
        GRADUATED: "secondary", // Abu/Biru muda
        DROPOUT: "destructive", // Merah
        ON_LEAVE: "outline", // Border
      };
      
      return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell student={row.original} />,
  },
];