"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, CheckCircle2, Search, FilterX, Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PaymentActionDialog } from "./payment-action-dialog";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// --- Types ---
type Student = {
  id: string;
  name: string;
  status: string;
  nis: string | null;
  class_year: string | null;
};

type Payment = {
  id: string;
  student_id: string;
  amount: number;
  payment_date: string;
  payment_for_month: string; // e.g., "January", "February"
  payment_status: string;
  invoice_number: string | null;
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export function TuitionMatrixTable() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedYear, setSelectedYear] = React.useState<string>(new Date().getFullYear().toString());
  const [students, setStudents] = React.useState<Student[]>([]);
  const [payments, setPayments] = React.useState<Payment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedCell, setSelectedCell] = React.useState<{
    student: Student;
    month: string;
    existingPayment?: Payment;
  } | null>(null);

  const supabase = createClient();

  // --- Data Fetching ---
  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch Students (Active only usually, but let's get all for history)
      const { data: studentsData, error: studentsError } = await supabase
        .from("students")
        .select("id, name, status, nis, class_year")
        .order("name");

      if (studentsError) throw studentsError;

      // 2. Fetch Payments for the selected year
      // Note: We need to filter payments by date range of the selected year
      const startOfYear = `${selectedYear}-01-01`;
      const endOfYear = `${selectedYear}-12-31`;

      const { data: paymentsData, error: paymentsError } = await supabase
        .from("payments")
        .select("id, student_id, amount, payment_date, payment_for_month, payment_status, invoice_number")
        .eq("category", "tuition") // Only fetch Tuition payments for the matrix
        .gte("payment_date", startOfYear)
        .lte("payment_date", endOfYear);

      if (paymentsError) throw paymentsError;

      setStudents(studentsData || []);
      // Cast the result to Payment[] to resolve the type mismatch with Supabase generated types
      setPayments((paymentsData as unknown as Payment[]) || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      // In a real app, use toast here
    } finally {
      setLoading(false);
    }
  }, [supabase, selectedYear]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Filtering ---
  const filteredStudents = React.useMemo(() => {
    return students.filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.nis && student.nis.includes(searchTerm))
    );
  }, [students, searchTerm]);

  // --- Helpers ---
  const getPaymentForCell = (studentId: string, monthIndex: number) => {
    const monthName = MONTHS[monthIndex];
    // Find payment for this student, this month (case insensitive check usually safer)
    return payments.find(
      (p) =>
        p.student_id === studentId &&
        p.payment_for_month?.toLowerCase() === monthName.toLowerCase() &&
        p.payment_status === 'completed'
    );
  };

  const handleCellClick = (student: Student, monthIndex: number) => {
    const monthName = MONTHS[monthIndex];
    const existingPayment = getPaymentForCell(student.id, monthIndex);
    
    setSelectedCell({
      student,
      month: monthName,
      existingPayment,
    });
    setDialogOpen(true);
  };

  const handlePaymentSaved = () => {
    setDialogOpen(false);
    fetchData(); // Refresh data to show checkmark
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b gap-4">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari siswa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[120px] h-9">
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - 2 + i;
                return (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Matrix Table with Native Scroll */}
      <div className="flex-1 overflow-hidden">
         <div className="h-full w-full overflow-x-auto overflow-y-auto">
            <Table className="w-full border-collapse text-sm">
              <TableHeader className="sticky top-0 z-20 bg-background shadow-sm">
                <TableRow className="hover:bg-transparent">
                  {/* Sticky Corner Header */}
                  <TableHead className="w-[250px] font-bold pl-4 sticky left-0 z-30 bg-background shadow-[1px_0_0_0_rgba(0,0,0,0.1)] border-b h-12">
                    Nama Siswa
                  </TableHead>
                  {SHORT_MONTHS.map((month) => (
                    <TableHead key={month} className="text-center w-[80px] font-semibold text-xs uppercase text-muted-foreground bg-muted/30 border-b h-12">
                      {month}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={13} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                          <Loader2 className="h-6 w-6 animate-spin" />
                          <span className="text-xs">Memuat data pembayaran...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={13} className="h-24 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                         <FilterX className="h-8 w-8 opacity-20" />
                         <p>Tidak ada siswa ditemukan.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id} className="group hover:bg-muted/50">
                      {/* Sticky Student Name Column */}
                      <TableCell className="font-medium sticky left-0 bg-background group-hover:bg-muted/50 z-10 shadow-[1px_0_0_0_rgba(0,0,0,0.1)] pl-4 py-2 border-b">
                        <div className="flex flex-col">
                          <span className="truncate max-w-[200px]" title={student.name}>{student.name}</span>
                          <span className="text-[10px] text-muted-foreground">{student.nis || "No NIS"} • {student.class_year || "N/A"}</span>
                        </div>
                      </TableCell>

                      {/* Month Cells */}
                      {MONTHS.map((month, index) => {
                        const payment = getPaymentForCell(student.id, index);
                        const isPaid = !!payment;

                        return (
                          <TableCell key={month} className="text-center p-1 border-b">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "h-8 w-8 p-0 rounded-full transition-all duration-200",
                                isPaid
                                  ? "bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                  : "text-muted-foreground/20 hover:text-primary hover:bg-primary/10"
                              )}
                              onClick={() => handleCellClick(student, index)}
                              title={isPaid ? `Lunas: ${month}` : `Input: ${month}`}
                            >
                              {isPaid ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                <CalendarDays className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
         </div>
      </div>

      {/* Action Dialog */}
      {selectedCell && (
        <PaymentActionDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          student={selectedCell.student}
          month={selectedCell.month}
          year={selectedYear}
          existingPayment={selectedCell.existingPayment}
          onSuccess={handlePaymentSaved}
        />
      )}
    </div>
  );
}
