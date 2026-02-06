import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { 
  User, 
  Calendar, 
  CreditCard, 
  Phone, 
  Mail, 
  MapPin 
} from "lucide-react";
import { StudentForm } from "./student-form"; 
import { useState } from "react";

interface StudentDetailDialogProps {
  student: any;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function StudentDetailDialog({
  student,
  children,
  open,
  onOpenChange,
}: StudentDetailDialogProps) {
  // Jika children tidak ada, kita bisa gunakan icon atau button default
  const trigger = children || (
    <Button variant="ghost" size="sm">Detail</Button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <span className="font-bold">{student.name}</span>
            <span className={`text-xs px-2 py-1 rounded-full border ${
                student.status === 'ACTIVE' || student.status === 'active' 
                ? 'bg-green-100 text-green-700 border-green-200' 
                : 'bg-gray-100 text-gray-700 border-gray-200'
            }`}>
                {student.status}
            </span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="history">Riwayat Bayar</TabsTrigger>
            <TabsTrigger value="billing">Tagihan & SPP</TabsTrigger>
          </TabsList>

          {/* TAB 1: PROFIL & EDIT */}
          <TabsContent value="profile" className="space-y-4 py-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Kontak Siswa</h3>
                    <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{student.email || "-"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{student.phone_number || "-"}</span>
                    </div>
                     <div className="flex items-center gap-3 text-sm">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{student.address || "-"}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Orang Tua / Wali</h3>
                     <div className="flex items-center gap-3 text-sm">
                        <User className="w-4 h-4 text-gray-500" />
                        <span>{student.parent_name || "-"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{student.parent_phone || "-"}</span>
                    </div>
                </div>
             </div>
             
             <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">Edit Data</h3>
                {/* FIX: Mengganti 'studentToEdit' menjadi 'initialData'. 
                    Standard prop untuk form edit biasanya adalah initialData.
                */}
                <StudentForm initialData={student} onSuccess={() => onOpenChange?.(false)} />
             </div>
          </TabsContent>

          {/* TAB 2: RIWAYAT TABLE */}
          <TabsContent value="history" className="py-4">
             <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Riwayat Transaksi Terakhir
             </h3>
             
             {student.payments && student.payments.length > 0 ? (
                 <div className="rounded-md border">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="p-3 font-medium">Tanggal</th>
                                <th className="p-3 font-medium">Kategori</th>
                                <th className="p-3 font-medium">Jumlah</th>
                                <th className="p-3 font-medium text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {student.payments.map((p: any, idx: number) => (
                                <tr key={idx} className="border-t hover:bg-muted/50">
                                    <td className="p-3">
                                        {p.payment_date ? format(new Date(p.payment_date), "dd MMM yyyy", { locale: id }) : "-"}
                                    </td>
                                    <td className="p-3 capitalize">{p.category}</td>
                                    <td className="p-3">
                                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(p.amount)}
                                    </td>
                                    <td className="p-3 text-right">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                            {p.payment_status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
             ) : (
                 <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                    Belum ada riwayat pembayaran.
                 </div>
             )}
          </TabsContent>

          {/* TAB 3: BILLING / TAGIHAN */}
          <TabsContent value="billing" className="py-4">
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-slate-50">
                <div className="p-3 bg-white border rounded-full shadow-sm">
                    <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">SPP Bulanan (Base Fee)</p>
                    <p className="text-2xl font-bold">
                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(student.base_fee || 0)}
                    </p>
                </div>
                <div className="ml-auto">
                    <Button size="sm">Buat Tagihan Manual</Button>
                </div>
            </div>
            
            <div className="mt-6">
                <h4 className="font-medium mb-2 text-sm">Jadwal Tagihan Berikutnya</h4>
                <div className="p-4 border border-dashed rounded-lg text-sm text-muted-foreground">
                    Sistem tagihan otomatis akan muncul di sini. Saat ini tagihan dikelola via Matrix.
                </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}