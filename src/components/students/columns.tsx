"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Student } from "@/lib/validators/student";
import { PaymentStatusCell } from "./payment-status-cell";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StudentDetailDialog } from "./StudentDetailDialog";

// Extended Student type to include the payment map
export type StudentTuitionRow = Student & {
  paymentMap: Record<string, any>;
};

const months = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

export const columns: ColumnDef<StudentTuitionRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
    maxSize: 40,
  },
  {
    accessorKey: "name",
    header: "Student Name",
    size: 250,
    minSize: 200,
    enablePinning: true,
    cell: ({ row }) => {
      const student = row.original;
      return (
        <StudentDetailDialog student={student}>
            <button className="flex w-full text-left items-center gap-3 cursor-pointer group hover:bg-slate-50 p-1 rounded-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`} />
                    <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-medium text-sm group-hover:text-primary transition-colors">{student.name}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                    {student.nis || "No ID"}
                    </span>
                </div>
            </button>
        </StudentDetailDialog>
      );
    },
  },
  {
    accessorKey: "class_year",
    header: "Class",
    size: 80,
    cell: ({ row }) => (
      <div className="text-xs font-medium text-muted-foreground">
        {row.getValue("class_year") || "-"}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 100,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge 
          variant={status === "active" || status === "ACTIVE" ? "default" : "secondary"}
          className="capitalize text-[10px] px-2 h-5"
        >
          {status.toLowerCase()}
        </Badge>
      );
    },
  },
  // Generate columns for each month
  ...months.map((month) => ({
    accessorKey: `paymentMap.${month}`,
    id: month.toLowerCase(),
    header: () => <span className="text-xs font-semibold text-muted-foreground">{month.slice(0, 3)}</span>,
    size: 60, // Fixed width for month columns
    cell: ({ row }: { row: any }) => {
      const student = row.original;
      // Access the specific payment for this month from the map
      const payment = student.paymentMap?.[month];
      
      return (
        <div className="flex justify-center">
          <PaymentStatusCell 
            student={student} 
            month={month} 
            payment={payment} 
          />
        </div>
      );
    },
  })),
];