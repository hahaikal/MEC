"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle2, Calendar, CreditCard, User, Receipt } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

type Student = {
  id: string;
  name: string;
  nis: string | null;
};

type Payment = {
  id: string;
  amount: number;
  payment_date: string;
  invoice_number: string | null;
  payment_method?: string; // Add this if available in your type or ignore for display if not needed
};

interface PaymentActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student;
  month: string;
  year: string;
  existingPayment?: Payment;
  onSuccess: () => void;
}

export function PaymentActionDialog({
  open,
  onOpenChange,
  student,
  month,
  year,
  existingPayment,
  onSuccess,
}: PaymentActionDialogProps) {
  const { toast } = useToast();
  const supabase = createClient();
  const [loading, setLoading] = React.useState(false);

  // Form States
  const [amount, setAmount] = React.useState("150000"); // Default fee, can be made dynamic later
  const [paymentMethod, setPaymentMethod] = React.useState("cash");
  const [notes, setNotes] = React.useState("");

  // Mode: "view" if paid, "add" if unpaid
  const isViewMode = !!existingPayment;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Get the current user for received_by
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // 2. Need to find an active program for the student to link the payment
      const { data: programData, error: programError } = await supabase
        .from('student_programs')
        .select('program_id')
        .eq('student_id', student.id)
        .eq('status', 'active')
        .limit(1)
        .single();

      // If no active program, we might default to a generic one or throw error
      // For now, let's assume one exists or proceed carefully. 
      // If no program found, we can't insert into `payments` due to FK constraint typically.
      const programId = programData?.program_id;

      if (!programId) {
         throw new Error("Siswa tidak memiliki program aktif. Harap daftarkan siswa ke program terlebih dahulu.");
      }

      const invoiceNum = `INV/${format(new Date(), "yyyyMMdd")}/${Math.floor(Math.random() * 10000)}`;

      // 3. Insert Payment
      const { error } = await supabase.from("payments").insert({
        student_id: student.id,
        program_id: programId,
        amount: parseFloat(amount),
        payment_date: new Date().toISOString(), // Or use a selected date
        payment_method: paymentMethod,
        payment_status: "completed",
        category: "tuition",
        payment_for_month: month, // The key linkage
        received_by: user.id,
        invoice_number: invoiceNum,
        notes: notes || `Pembayaran SPP Bulan ${month} ${year}`,
      });

      if (error) throw error;

      toast({
        title: "Pembayaran Berhasil",
        description: `SPP ${month} untuk ${student.name} telah dicatat.`,
      });

      onSuccess();
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Gagal Menyimpan",
        description: error.message || "Terjadi kesalahan saat menyimpan pembayaran.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset form when opening for a new unsaved cell
  React.useEffect(() => {
    if (open && !existingPayment) {
      setAmount("150000"); // Reset to default
      setPaymentMethod("cash");
      setNotes("");
    }
  }, [open, existingPayment]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isViewMode ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Detail Pembayaran
              </>
            ) : (
              <>
                <Receipt className="h-5 w-5 text-primary" />
                Input Pembayaran SPP
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isViewMode
              ? "Informasi pembayaran yang telah tercatat."
              : `Masukkan data pembayaran untuk bulan ${month} ${year}.`}
          </DialogDescription>
        </DialogHeader>

        {isViewMode ? (
          // --- VIEW MODE ---
          <div className="grid gap-4 py-4">
            <div className="bg-muted/30 p-4 rounded-lg space-y-3 border">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="text-muted-foreground">Siswa:</span>
                <span className="col-span-2 font-medium">{student.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="text-muted-foreground">Bulan:</span>
                <span className="col-span-2 font-medium">{month} {year}</span>
              </div>
              <Separator />
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="text-muted-foreground">Jumlah:</span>
                <span className="col-span-2 font-bold text-green-600">
                  Rp {existingPayment?.amount?.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="text-muted-foreground">Tanggal:</span>
                <span className="col-span-2">
                  {existingPayment?.payment_date ? format(new Date(existingPayment.payment_date), "dd MMMM yyyy") : "-"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="text-muted-foreground">Invoice:</span>
                <span className="col-span-2 font-mono text-xs">{existingPayment?.invoice_number || "-"}</span>
              </div>
            </div>
            
            <div className="flex justify-end">
               <Button variant="outline" onClick={() => onOpenChange(false)}>Tutup</Button>
            </div>
          </div>
        ) : (
          // --- ADD MODE ---
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Siswa</Label>
              <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{student.name}</span>
                {student.nis && <span className="text-muted-foreground text-xs">({student.nis})</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="grid gap-2">
                  <Label>Bulan</Label>
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{month} {year}</span>
                  </div>
               </div>
               <div className="grid gap-2">
                  <Label htmlFor="method">Metode</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger id="method">
                      <SelectValue placeholder="Pilih" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Tunai</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                      <SelectItem value="card">Kartu</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Jumlah Pembayaran (Rp)</Label>
              <div className="relative">
                 <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">Rp</span>
                 <Input
                    id="amount"
                    type="number"
                    className="pl-9 font-bold"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="1"
                  />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Catatan (Opsional)</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Titipan orang tua"
              />
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Pembayaran
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}