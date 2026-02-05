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
import { CheckCircle2, User } from "lucide-react";
import { useCreatePayment } from "@/lib/hooks/use-payments";
import { format, parseISO } from "date-fns";
import { id as idLocale } from "date-fns/locale";

// Payment Record Dialog Component
const PaymentRecordDialog = ({ 
  studentId,
  studentName, 
  monthName, 
  isOpen, 
  onOpenChange,
  existingPayment,
  baseFee,
}: { 
  studentId: string;
  studentName: string;
  monthName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  existingPayment?: Payment;
  baseFee?: number;
}) => {
  const [paymentDate, setPaymentDate] = useState(existingPayment?.payment_date || "");
  const [amount, setAmount] = useState(existingPayment?.amount.toString() || baseFee?.toString() || "0");
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: createPayment } = useCreatePayment();

  const handleSubmit = async () => {
    if (!paymentDate) {
      alert("Tanggal pembayaran harus diisi");
      return;
    }

    setIsLoading(true);
    try {
      // Generate a temporary program_id - ideally this should come from student's program enrollment
      const tempProgramId = "00000000-0000-0000-0000-000000000000";
      
      await createPayment({
        student_id: studentId,
        payment_date: paymentDate,
        amount: parseInt(amount) || 0,
        payment_method: "CASH",
        payment_status: "PAID",
        program_id: tempProgramId,
        notes: `Pembayaran ${monthName}`,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving payment:", error);
    } finally {
      setIsLoading(false);
    }
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
              placeholder="0"
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan Pembayaran"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Payment View Dialog Component
const PaymentViewDialog = ({ 
  payment,
  isOpen,
  onOpenChange,
}: {
  payment: Payment;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detail Pembayaran</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Tanggal Pembayaran</p>
              <p className="font-semibold">
                {payment.payment_date ? format(parseISO(payment.payment_date), "dd MMMM yyyy", { locale: idLocale }) : "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Jumlah</p>
              <p className="font-semibold">Rp {payment.amount.toLocaleString("id-ID")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Metode Pembayaran</p>
              <p className="font-semibold">{payment.payment_method}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-semibold">{payment.payment_status}</p>
            </div>
          </div>
          {payment.notes && (
            <div>
              <p className="text-sm text-muted-foreground">Catatan</p>
              <p className="text-sm">{payment.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Month Button Cell Component
const MonthButtonCell = ({ 
  studentId,
  studentName, 
  monthName,
  monthIndex,
  payments,
  baseFee,
}: { 
  studentId: string;
  studentName: string;
  monthName: string;
  monthIndex: number;
  payments?: Payment[];
  baseFee?: number;
}) => {
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Find payment for this month
  const monthPayment = payments?.find(p => {
    if (!p.payment_date) return false;
    const paymentDate = parseISO(p.payment_date);
    return paymentDate.getMonth() === monthIndex;
  });

  if (monthPayment) {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsViewOpen(true)}
          className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
        >
          <CheckCircle2 className="h-4 w-4" />
        </Button>
        <PaymentViewDialog
          payment={monthPayment}
          isOpen={isViewOpen}
          onOpenChange={setIsViewOpen}
        />
      </>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsRecordOpen(true)}
        className="h-8 px-2"
      >
        <Calendar className="h-4 w-4" />
      </Button>
      <PaymentRecordDialog
        studentId={studentId}
        studentName={studentName}
        monthName={monthName}
        baseFee={baseFee}
        isOpen={isRecordOpen}
        onOpenChange={setIsRecordOpen}
      />
    </>
  );
};

// Definisikan tipe data untuk kolom agar sesuai dengan return dari getStudents
export type Payment = {
  id: string;
  student_id: string;
  payment_date: string | null;
  amount: number;
  payment_method: string;
  payment_status: string;
  program_id: string;
  notes?: string | null;
  invoice_number?: string | null;
  received_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

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
  payments?: Payment[];
};

// Student Profile Dialog Component
const StudentProfileDialog = ({ 
  student,
  isOpen,
  onOpenChange,
}: {
  student: Student;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const calculateAge = (dateOfBirth?: string | null) => {
    if (!dateOfBirth) return "-";
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Biodata Siswa
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Data Siswa */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm border-b pb-2">Data Siswa</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nama</p>
                <p className="font-semibold">{student.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">NIS</p>
                <p className="font-semibold">{student.nis}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kelas</p>
                <p className="font-semibold">{student.classes?.name || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-semibold">{student.status}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tanggal Lahir</p>
                <p className="font-semibold">
                  {student.date_of_birth 
                    ? format(parseISO(student.date_of_birth), "dd MMMM yyyy", { locale: idLocale })
                    : "-"
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Umur</p>
                <p className="font-semibold">{calculateAge(student.date_of_birth)} tahun</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold text-sm">{student.email || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">No. Telepon</p>
                <p className="font-semibold">{student.phone_number || "-"}</p>
              </div>
            </div>
            {student.address && (
              <div>
                <p className="text-sm text-muted-foreground">Alamat</p>
                <p className="text-sm">{student.address}</p>
              </div>
            )}
          </div>

          {/* Data Orang Tua */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm border-b pb-2">Data Orang Tua</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nama Orang Tua</p>
                <p className="font-semibold">{student.parent_name || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">No. Telepon</p>
                <p className="font-semibold">{student.parent_phone || "-"}</p>
              </div>
            </div>
          </div>

          {/* Data Pembayaran */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm border-b pb-2">Data Pembayaran</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Biaya Dasar</p>
                <p className="font-semibold">Rp {student.base_fee.toLocaleString("id-ID")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tanggal Tagihan</p>
                <p className="font-semibold">{student.billing_cycle_date ? `Tanggal ${student.billing_cycle_date}` : "-"}</p>
              </div>
            </div>
          </div>

          {/* Data Pendaftaran */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm border-b pb-2">Data Pendaftaran</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Tanggal Pendaftaran</p>
                <p className="font-semibold">
                  {student.enrollment_date 
                    ? format(parseISO(student.enrollment_date), "dd MMMM yyyy", { locale: idLocale })
                    : "-"
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tahun Akademik</p>
                <p className="font-semibold">{student.class_year || "-"}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ActionCell = ({ student }: { student: Student }) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
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
          <DropdownMenuItem onClick={() => setShowProfileDialog(true)}>
            <User className="mr-2 h-4 w-4" />
            Lihat Biodata
          </DropdownMenuItem>
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

      {/* Profile Dialog */}
      <StudentProfileDialog
        student={student}
        isOpen={showProfileDialog}
        onOpenChange={setShowProfileDialog}
      />

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
        studentId={row.original.id}
        studentName={row.original.name}
        monthName={month}
        monthIndex={index}
        payments={row.original.payments}
        baseFee={row.original.base_fee}
      />
    ),
  })),
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => <ActionCell student={row.original} />,
  },
];
