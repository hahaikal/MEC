"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
// Import Schema yang baru
import { studentSchema, StudentFormValues } from "@/lib/validators/student";
import { createStudent } from "@/actions/students"; // Import Server Action
import { useToast } from "@/components/ui/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddStudentDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      nis: "",
      email: "",
      phone_number: "",
      base_fee: 0,
      status: "ACTIVE",
    },
  });

  const isPending = form.formState.isSubmitting;

  const onSubmit = async (data: StudentFormValues) => {
    try {
      const result = await createStudent(data);

      if (result.success) {
        toast({
            title: "Berhasil",
            description: result.message,
            variant: "default",
        });
        setOpen(false);
        form.reset();
      } else {
         // Handle validasi error dari server jika ada
         if (result.errors) {
            Object.keys(result.errors).forEach((key) => {
                form.setError(key as keyof StudentFormValues, {
                    message: result.errors?.[key]?.[0]
                });
            });
         }
         
         toast({
            title: "Gagal Menyimpan",
            description: result.message,
            variant: "destructive",
         });
      }

    } catch (error) {
      toast({
        title: "Error Sistem",
        description: "Terjadi kesalahan yang tidak terduga.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Tambah Siswa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Tambah Siswa Baru</DialogTitle>
          <DialogDescription>
            Masukkan data siswa sesuai dokumen pendaftaran.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="nis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NIS</FormLabel>
                        <FormControl>
                          <Input placeholder="2024001" {...field} disabled={isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                 <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Status Akademik</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Status" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="ACTIVE">Aktif</SelectItem>
                            <SelectItem value="ON_LEAVE">Cuti</SelectItem>
                            <SelectItem value="GRADUATED">Lulus</SelectItem>
                            <SelectItem value="DROPOUT">Keluar / DO</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama siswa..." {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (Opsional)</FormLabel>
                      <FormControl>
                        <Input placeholder="email@contoh.com" {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No. HP (Opsional)</FormLabel>
                      <FormControl>
                        <Input placeholder="0812..." {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <FormField
                control={form.control}
                name="base_fee"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Biaya SPP Dasar</FormLabel>
                    <FormControl>
                    <Input 
                        type="number" 
                        placeholder="0" 
                        {...field} 
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        disabled={isPending} 
                    />
                    </FormControl>
                    <FormDescription>
                        Nominal tagihan bulanan default untuk siswa ini.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />

            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Menyimpan..." : "Simpan Data"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}