"use client";

import { useState } from "react";
import { format } from "date-fns";
import { 
  User, 
  School, 
  Pencil,
  Trash2,
  CalendarDays
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { StudentForm } from "./student-form";

interface StudentDetailDialogProps {
  student: any;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function StudentDetailDialog({ student, children, open: externalOpen, onOpenChange: externalOnOpenChange }: StudentDetailDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const open = externalOpen !== undefined ? externalOpen : internalOpen;

  const handleOpenChange = (val: boolean) => {
    if (externalOnOpenChange) {
      externalOnOpenChange(val);
    } else {
      setInternalOpen(val);
    }
    if (!val) setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      // Assuming 'INACTIVE' or similar is allowed, checking schema...
      // Schema says: ARRAY['ACTIVE', 'GRADUATED', 'DROPOUT', 'ON_LEAVE']
      // So 'DROPOUT' or 'ON_LEAVE' might be better for "Delete/Deactivate"
      // Or just DELETE row if you prefer hard delete. Let's use DROPOUT as soft delete for now.
      const { error } = await supabase
        .from("students")
        .update({ status: 'DROPOUT' })
        .eq("id", student.id);

      if (error) throw error;

      toast.success("Student deactivated successfully");
      handleOpenChange(false);
      router.refresh();
    } catch (error: any) {
      toast.error("Failed to delete student: " + error.message);
    }
  };

  const handleUpdateSuccess = () => {
    setIsEditing(false);
    router.refresh();
    toast.success("Updated successfully");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {externalOpen === undefined && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Student" : "Student Details"}</DialogTitle>
        </DialogHeader>

        {isEditing ? (
            <StudentForm 
                initialData={student} 
                onSuccess={handleUpdateSuccess} 
            />
        ) : (
            <div className="space-y-6">
                {/* Header Profile */}
                <div className="flex items-start gap-4">
                    <Avatar className="h-20 w-20 border-2 border-slate-100">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`} />
                        <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-slate-900">{student.name}</h3>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary">{student.nis || "No NIS"}</Badge>
                            <Badge variant={student.status === 'ACTIVE' ? 'default' : 'destructive'} className="capitalize">
                                {student.status.toLowerCase()}
                            </Badge>
                        </div>
                        <p className="text-sm text-slate-500 flex items-center gap-1">
                             <CalendarDays className="h-3 w-3" /> 
                             Enrolled: {format(new Date(student.created_at), 'dd MMM yyyy')}
                        </p>
                    </div>
                </div>

                <Separator />

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h4 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                            <User className="h-4 w-4" /> Personal Info
                        </h4>
                        <div className="space-y-3 text-sm">
                            <div className="grid grid-cols-[100px_1fr]">
                                <span className="text-slate-500">Email</span>
                                <span className="font-medium truncate">{student.email || "-"}</span>
                            </div>
                            <div className="grid grid-cols-[100px_1fr]">
                                <span className="text-slate-500">Phone</span>
                                <span className="font-medium">{student.phone_number || "-"}</span>
                            </div>
                            <div className="grid grid-cols-[100px_1fr]">
                                <span className="text-slate-500">Parent</span>
                                <span className="font-medium">{student.parent_name || "-"}</span>
                            </div>
                            <div className="grid grid-cols-[100px_1fr]">
                                <span className="text-slate-500">Parent Phone</span>
                                <span className="font-medium">{student.parent_phone || "-"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                            <School className="h-4 w-4" /> Academic & Finance
                        </h4>
                        <div className="space-y-3 text-sm">
                            <div className="grid grid-cols-[100px_1fr]">
                                <span className="text-slate-500">Class</span>
                                <span className="font-medium">{student.class_year || "-"}</span>
                            </div>
                            <div className="grid grid-cols-[100px_1fr]">
                                <span className="text-slate-500">Tuition Fee</span>
                                <span className="font-medium text-green-600">
                                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(student.base_fee)}
                                </span>
                            </div>
                             <div className="grid grid-cols-[100px_1fr]">
                                <span className="text-slate-500">Billing Date</span>
                                <span className="font-medium">Every {student.billing_cycle_date}th</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Actions Footer */}
                <div className="flex justify-end gap-2 pt-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action will mark the student as <strong>Dropout/Inactive</strong>.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                                    Deactivate Student
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    
                    <Button onClick={() => setIsEditing(true)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                </div>
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}