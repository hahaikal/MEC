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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { deleteStudent } from "@/actions/students"; // Integrasi Server Action

// Update Tipe Data sesuai Schema Backend terbaru
export type Student = {
  id: string;
  nis: string;
  name: string; // Changed from full_name
  email?: string | null;
  phone_number?: string | null;
  status: "ACTIVE" | "GRADUATED" | "DROPOUT" | "ON_LEAVE";
  base_fee: number;
  created_at: string;
};

const ActionCell = ({ student }: { student: Student }) => {
  const [openAlert, setOpenAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteStudent(student.id);
      
      if (result.success) {
        toast({
            title: "Data Dihapus",
            description: result.message,
            variant: "default",
        });
      } else {
        toast({
            title: "Gagal Menghapus",
            description: result.message,
            variant: "destructive",
        });
      }
    } catch (error) {
        toast({
            title: "Error",
            description: "Terjadi kesalahan sistem.",
            variant: "destructive",
        });
    } finally {
        setIsDeleting(false);
        setOpenAlert(false);
    }
  };

  return (
    <>
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Menghapus siswa <strong>{student.name}</strong> akan menghapus riwayat pembayaran mereka secara permanen. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction 
                onClick={(e) => {
                    e.preventDefault();
                    handleDelete();
                }} 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isDeleting}
            >
              {isDeleting ? "Menghapus..." : "Hapus Permanen"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(student.nis)}
          >
            Copy NIS
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Pencil className="mr-2 h-4 w-4" /> Edit Data
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="text-destructive focus:text-destructive"
            onClick={() => setOpenAlert(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Hapus Siswa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
      );
    },
  },
  {
    accessorKey: "name", // Updated from full_name
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama Lengkap
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "base_fee",
    header: "Tagihan Dasar",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("base_fee"));
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      let variant: "default" | "secondary" | "destructive" | "outline" = "default";
      
      // Map colors based on new ENUM
      switch(status) {
        case "ACTIVE": variant = "default"; break;
        case "ON_LEAVE": variant = "secondary"; break;
        case "GRADUATED": variant = "outline"; break;
        case "DROPOUT": variant = "destructive"; break;
        default: variant = "outline";
      }
      
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell student={row.original} />
  },
];