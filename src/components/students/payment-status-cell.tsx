"use client";

import { useState } from "react";
import { format } from "date-fns";
import { 
  Calendar, 
  CheckCircle2, 
  CreditCard, 
  Info, 
  Loader2 
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { PaymentEntryForm } from "@/components/finance/payment-entry-form";
import { useRouter } from "next/navigation";

// Define strict types for the props
interface Payment {
  id: string;
  amount: number;
  payment_date: string | Date;
  payment_method: string;
  invoice_number?: string;
  notes?: string;
  payment_status: string;
}

interface Student {
  id: string;
  name: string;
  base_fee?: number;
}

interface PaymentStatusCellProps {
  student: Student;
  month: string;
  payment?: Payment | null;
}

export function PaymentStatusCell({ student, month, payment }: PaymentStatusCellProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  // If payment exists and is completed/verified
  if (payment && payment.payment_status === 'completed') {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 hover:bg-green-50 text-green-600 hover:text-green-700"
          >
            <CheckCircle2 className="h-5 w-5" />
            <span className="sr-only">Paid {month}</span>
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
                Tuition for {month}
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
                  }).format(payment.amount)}
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
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  // Pending State
  if (payment && payment.payment_status === 'pending') {
    return (
      <div className="flex justify-center">
        <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          Pending
        </Badge>
      </div>
    );
  }

  // Not Paid State
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <Calendar className="h-4 w-4" />
          <span className="sr-only">Pay for {month}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            Enter tuition payment details for <strong>{student.name}</strong> for the month of <strong>{month}</strong>.
          </DialogDescription>
        </DialogHeader>
        
        {/* We use the existing PaymentEntryForm but pre-fill data */}
        <div className="mt-4">
          <PaymentEntryForm 
            prefillData={{
              studentId: student.id,
              month: month, // Assuming the form handles month mapping or string
              amount: student.base_fee || 0,
              category: 'tuition'
            }}
            onSuccess={() => {
              setIsDialogOpen(false);
              router.refresh(); // Refresh server data
            }}
            onCancel={() => setIsDialogOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}