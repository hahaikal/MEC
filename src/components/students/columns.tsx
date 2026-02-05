"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, Pencil, Trash2, Calendar } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

// Payment Record Dialog Component
const PaymentRecordDialog = ({ 
  studentName, 
  monthName, 
  isOpen, 
  onOpenChange 
}: { 
  studentName: string;
  monthName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [paymentDate, setPaymentDate] = useState("");
  const [amount, setAmount] = useState("0");
  const [hasDiscount, setHasDiscount] = useState(false);
  const [discountAmount, setDiscountAmount] = useState("0");

  const handleSubmit = () => {
    // TODO: Save payment record to database
    console.log({
      studentName,
      monthName,
      paymentDate,
      amount,
      hasDiscount,
      discountAmount,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pencatatan Pembayaran</DialogTitle>
          <DialogDescription>
            {studentName} - {monthName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Tanggal Pembayaran</Label>
            <Input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Jumlah Pembayaran</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled
              className="bg-gray-100"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="discount"
                checked={hasDiscount}
                onCheckedChange={(checked) => setHasDiscount(checked as boolean)}
              />
              <Label htmlFor="discount" className="cursor-pointer">Aplikasikan Diskon</Label>
            </div>
          </div>

          {hasDiscount && (
            <div className="space-y-2">
              <Label>Jumlah Diskon (Rp)</Label>
              <Input
                type="number"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                placeholder="0"
              />
            </div>
          )}

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit}>
              Simpan Pembayaran
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Month Button Cell Component
const MonthButtonCell = ({ studentName, monthName }: { studentName: string; monthName: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="h-8 px-2"
      >
        <Calendar className="h-4 w-4" />
      </Button>
      <PaymentRecordDialog
        studentName={studentName}
        monthName={monthName}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      />
    </>
  );
};

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
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <span className="sr-only">Menu aksi</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Hapus
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

const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-left"
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
  // Month columns - January to December
  ...monthNames.map((month, index) => ({
    id: `month-${index}`,
    header: month,
    cell: ({ row }: { row: any }) => (
      <MonthButtonCell 
        studentName={row.original.name}
        monthName={month}
      />
    ),
  })),
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => <ActionCell student={row.original} />,
  },
];
