"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Calendar,
  CheckCircle2,
  CreditCard,
  Info,
  Loader2,
  Edit,
  Trash
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
// import { PaymentEntryForm } from "@/components/finance/payment-entry-form";
import { QuickPaymentForm } from "@/components/finance/quick-payment-form";
import { useRouter } from "next/navigation";
import { useStudentPaymentsYearly, useDeletePayment } from "@/lib/hooks/use-payments";

// Define strict types for the props
interface Payment {
  id: string;
  amount: number;
  payment_date: string | Date;
  payment_method: string;
  invoice_number?: string;
  notes?: string;
  payment_status: string;
  month?: number;
}

interface Student {
  id: string;
  name: string;
  base_fee?: number;
}

interface PaymentStatusCellProps {
  student: Student;
  month?: number; // 0-11, or -1 for Registration
  year?: number;
  isRegistration?: boolean;
}

export function PaymentStatusCell({ student, month, year, isRegistration = false, isBookFee = false }: PaymentStatusCellProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  
  const { mutate: deletePayment } = useDeletePayment();

  // Use provided month/year or default to current
  const currentDate = new Date();
  const targetMonth = month ?? currentDate.getMonth();
  const targetYear = year ?? currentDate.getFullYear();

  const targetDate = isRegistration || isBookFee ? currentDate : new Date(targetYear, targetMonth, 1);
  const monthName = isRegistration ? 'Registration' : isBookFee ? 'Book Fee' : format(targetDate, 'MMMM yyyy');

  // OPTIMIZATION: Fetch ALL payments for the year at once.
  // React Query will dedupe this call across all cells for the same student/year.
  const { data: yearlyPayments, isLoading } = useStudentPaymentsYearly(student.id, targetYear);

  // Find payment for this specific month in the cached yearly data
  // We check if the payment 'month' matches OR if the payment_date falls in the month
  const paymentsForCell = yearlyPayments?.filter((p: any) => {
      if (isRegistration) {
          // Check if category is registration (case insensitive usually better)
          return p.category === 'registration';
      }
      if (isBookFee) {
          return p.category === 'books';
      }

      // 1. Check explicit 'month' column if available (preferred)
      if (p.month !== null && p.month !== undefined) {
          return p.month === targetMonth && p.year === targetYear && p.category === 'tuition';
      }
      
      // 2. Fallback: Check payment_date only if month is not explicitly set
      const pDate = new Date(p.payment_date);
      return pDate.getMonth() === targetMonth && pDate.getFullYear() === targetYear && p.category === 'tuition';
  }) || [];

  const payment = paymentsForCell[0];
  const totalAmount = paymentsForCell.reduce((sum: number, p: any) => sum + Number(p.amount), 0);

  if (isLoading) {
      return <div className="h-8 w-8 rounded-full bg-slate-100 animate-pulse mx-auto" />;
  }

  // If payment exists and is completed/verified
  if (payment && payment.payment_status === 'completed') {
    return (
      <div className="flex justify-center w-full">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-green-50 text-green-600 hover:text-green-700"
            >
              <CheckCircle2 className="h-5 w-5" />
            <span className="sr-only">Paid {monthName}</span>
            </Button>
          </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="center">
          <div className="flex flex-col">
            <div className="bg-green-50 p-4 border-b border-green-100">
              <div className="flex items-center gap-2 text-green-700 font-medium mb-1">
                <CheckCircle2 className="h-4 w-4" />
                <span>Payment Completed</span>
              </div>
              <p className="text-xs text-green-600">
                {isRegistration ? 'Registration Fee' : `Tuition for ${monthName}`}
              </p>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Amount</div>
                <div className="font-semibold text-right">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(totalAmount)}
                </div>

                <div className="text-muted-foreground">Date</div>
                <div className="text-right">
                  {format(new Date(payment.payment_date), "dd MMM yyyy")}
                </div>

                <div className="text-muted-foreground">Method</div>
                <div className="text-right capitalize">
                  {payment.payment_method.replace('_', ' ')}
                </div>

                {payment.invoice_number && (
                  <>
                    <div className="text-muted-foreground">Invoice</div>
                    <div className="text-right font-mono text-xs pt-1">
                      {payment.invoice_number}
                    </div>
                  </>
                )}
              </div>

                {payment.notes && (
                  <>
                    <Separator />
                    <div className="text-xs text-muted-foreground italic">
                      "{payment.notes}"
                    </div>
                  </>
                )}

                <div className="pt-2 border-t flex justify-end gap-2">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="h-8" 
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash className="h-3 w-3 mr-1" /> Hapus
                  </Button>
                  <Button variant="outline" size="sm" className="h-8" onClick={() => setIsEditDialogOpen(true)}>
                    <Edit className="h-3 w-3 mr-1" /> Edit
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Data Pembayaran?</AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini tidak dapat dibatalkan. Ini akan menghapus riwayat pembayaran secara permanen dari server.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                disabled={isDeleting}
                onClick={(e) => {
                  e.preventDefault();
                  setIsDeleting(true);
                  paymentsForCell.forEach((p: any, idx: number) => {
                    deletePayment(p.id, {
                      onSuccess: () => {
                        if (idx === paymentsForCell.length - 1) {
                          setIsDeleting(false);
                          setIsDeleteDialogOpen(false);
                        }
                      },
                      onError: () => {
                        setIsDeleting(false);
                        setIsDeleteDialogOpen(false);
                      }
                    });
                  });
                }}
              >
                {isDeleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash className="h-4 w-4 mr-2" />}
                Ya, Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Payment</DialogTitle>
              <DialogDescription>
                Edit payment details for <strong>{student.name}</strong>.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <QuickPaymentForm
                student={student}
                month={targetMonth}
                year={targetYear}
                isRegistration={isRegistration}
                isBookFee={isBookFee}
                existingPayment={payment}
                existingPayments={paymentsForCell}
                onSuccess={() => setIsEditDialogOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Pending State
  if (payment && payment.payment_status === 'pending') {
    return (
      <div className="flex justify-center w-full">
        <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          Pending
        </Badge>
      </div>
    );
  }

  // Not Paid State
  return (
    <div className="flex justify-center w-full">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <Calendar className="h-4 w-4" />
            <span className="sr-only">Pay for {monthName}</span>
          </Button>
        </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isRegistration ? 'Record Registration Payment' : 'Record Payment'}</DialogTitle>
          <DialogDescription>
            Enter {isRegistration ? 'registration' : 'tuition'} payment details for <strong>{student.name}</strong>{isRegistration ? '.' : ` for the month of `}<strong>{!isRegistration && monthName}</strong>.
          </DialogDescription>
        </DialogHeader>
        
          {/* We use the simplified QuickPaymentForm */}
          <div className="mt-4">
            <QuickPaymentForm
              student={student}
              month={targetMonth}
              year={targetYear}
              isRegistration={isRegistration}
              isBookFee={isBookFee}
              onSuccess={() => setIsDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
