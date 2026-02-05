"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
  DollarSign,
  User,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";
import { useUpdateStudent, useDeleteStudent } from "@/lib/hooks/use-students";
import { StudentForm } from "./student-form";
import { Student } from "./columns";

interface StudentPaymentCardProps {
  student: Student;
}

export function StudentPaymentCard({ student }: StudentPaymentCardProps) {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const [hasDiscount, setHasDiscount] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentDate, setPaymentDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );

  const { mutateAsync: updateStudent, isPending: isUpdating } = useUpdateStudent();
  const { mutateAsync: deleteStudent, isPending: isDeleting } = useDeleteStudent();

  const currentMonth = new Date().toLocaleString("id-ID", { month: "long" });
  const nextBillingDate = student.billing_cycle_date || 10;

  const handleEdit = async (values: any) => {
    await updateStudent({ id: student.id, data: values });
    setShowEditDialog(false);
  };

  const handleDelete = async () => {
    await deleteStudent(student.id);
    setShowDeleteDialog(false);
  };

  const statusColor = {
    ACTIVE: "bg-green-100 text-green-800",
    GRADUATED: "bg-blue-100 text-blue-800",
    DROPOUT: "bg-red-100 text-red-800",
    ON_LEAVE: "bg-yellow-100 text-yellow-800",
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{student.name}</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">NIS: {student.nis}</p>
            </div>
            <Badge className={statusColor[student.status as keyof typeof statusColor]}>
              {student.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Informasi Dasar */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{student.parent_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground truncate">{student.parent_phone}</span>
            </div>
            {student.date_of_birth && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {format(new Date(student.date_of_birth), "dd MMM yyyy", { locale: id })}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground font-semibold">
                Rp {student.base_fee?.toLocaleString("id-ID") || 0}
              </span>
            </div>
          </div>

          {/* Tombol Bulan dan Aksi */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPaymentDialog(true)}
              className="flex-1 justify-between"
            >
              <span className="capitalize">{currentMonth}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowProfileDialog(true)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              Lihat Profil
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEditDialog(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pencatatan Pembayaran</DialogTitle>
            <DialogDescription>
              {student.name} - Bulan {currentMonth}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Tanggal Pembayaran */}
            <div className="space-y-2">
              <Label htmlFor="payment-date">Tanggal Pembayaran</Label>
              <Input
                id="payment-date"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
            </div>

            {/* Jumlah Pembayaran (Disabled) */}
            <div className="space-y-2">
              <Label htmlFor="amount">Jumlah (Rp)</Label>
              <Input
                id="amount"
                type="text"
                disabled
                value={`Rp ${(student.base_fee - (hasDiscount ? discountAmount : 0))?.toLocaleString("id-ID") || 0}`}
                className="bg-muted"
              />
            </div>

            {/* Checkbox Diskon */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="discount"
                checked={hasDiscount}
                onCheckedChange={(checked) => {
                  setHasDiscount(checked as boolean);
                  if (!checked) setDiscountAmount(0);
                }}
              />
              <Label htmlFor="discount" className="font-normal cursor-pointer">
                Aplikasikan Diskon
              </Label>
            </div>

            {/* Input Diskon (Aktif jika checkbox dicentang) */}
            {hasDiscount && (
              <div className="space-y-2">
                <Label htmlFor="discount-amount">Nominal Diskon (Rp)</Label>
                <Input
                  id="discount-amount"
                  type="number"
                  min="0"
                  max={student.base_fee || 0}
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  placeholder="0"
                />
              </div>
            )}

            {/* Aksi Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowPaymentDialog(false)}
                className="flex-1"
              >
                Batal
              </Button>
              <Button onClick={() => setShowPaymentDialog(false)} className="flex-1">
                Simpan Pembayaran
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Profil Siswa</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <h3 className="text-2xl font-bold">{student.name}</h3>
                <p className="text-muted-foreground">NIS: {student.nis}</p>
              </div>
              <Badge className={statusColor[student.status as keyof typeof statusColor]}>
                {student.status}
              </Badge>
            </div>

            {/* Data Siswa */}
            <div>
              <h4 className="font-semibold text-sm mb-3 text-muted-foreground">DATA SISWA</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {student.email && (
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{student.email}</p>
                  </div>
                )}
                {student.phone_number && (
                  <div>
                    <p className="text-muted-foreground">No. Telepon</p>
                    <p className="font-medium">{student.phone_number}</p>
                  </div>
                )}
                {student.date_of_birth && (
                  <div>
                    <p className="text-muted-foreground">Tanggal Lahir</p>
                    <p className="font-medium">
                      {format(new Date(student.date_of_birth), "dd MMMM yyyy", { locale: id })}
                    </p>
                  </div>
                )}
                {student.classes?.name && (
                  <div>
                    <p className="text-muted-foreground">Kelas</p>
                    <p className="font-medium">{student.classes.name}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Data Orang Tua */}
            <div>
              <h4 className="font-semibold text-sm mb-3 text-muted-foreground">DATA ORANG TUA</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Nama</p>
                  <p className="font-medium">{student.parent_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">No. Telepon</p>
                  <p className="font-medium">{student.parent_phone}</p>
                </div>
              </div>
            </div>

            {/* Data Pembayaran */}
            <div>
              <h4 className="font-semibold text-sm mb-3 text-muted-foreground">DATA PEMBAYARAN</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Biaya Dasar</p>
                  <p className="font-medium">
                    Rp {student.base_fee?.toLocaleString("id-ID") || 0}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tanggal Tagihan</p>
                  <p className="font-medium">Hari ke-{student.billing_cycle_date || 10}</p>
                </div>
              </div>
            </div>

            {/* Alamat */}
            {student.address && (
              <div>
                <h4 className="font-semibold text-sm mb-3 text-muted-foreground">ALAMAT</h4>
                <p className="text-sm">{student.address}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Data Siswa: {student.name}</DialogTitle>
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
            onSubmit={handleEdit}
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
              Tindakan ini tidak dapat dibatalkan. Data siswa <strong>{student.name}</strong> dan riwayat pembayarannya akan dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
