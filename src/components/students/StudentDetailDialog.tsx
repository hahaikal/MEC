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
  MapPin,
} from "lucide-react";
import { AvatarUpload } from "./avatar-upload";
import { useStudentPayments } from "@/lib/hooks/use-payments";

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
  const { data: payments, isLoading } = useStudentPayments(open ? student?.id : null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-50">
        <DialogHeader className="mb-4">
          <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-white rounded-xl shadow-sm border">
             {/* Avatar Upload Area */}
             <AvatarUpload
               studentId={student.id}
               studentName={student.name}
               currentPhotoUrl={student.photo_url}
               size="lg"
             />

             <div className="text-center md:text-left space-y-2">
                <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
                  {student.name}
                </DialogTitle>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium border ${
                      student.status === 'ACTIVE' || student.status === 'active'
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                      {student.status || 'UNKNOWN'}
                  </span>
                  {student.class_name && (
                    <span className="text-xs px-3 py-1 rounded-full font-medium bg-blue-100 text-blue-700 border border-blue-200">
                       {student.class_name}
                    </span>
                  )}
                  {student.nis && (
                     <span className="text-xs px-3 py-1 rounded-full font-medium bg-purple-100 text-purple-700 border border-purple-200">
                        NIS: {student.nis}
                     </span>
                  )}
                </div>
             </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-3 bg-slate-200/50 p-1 rounded-lg mb-6">
            <TabsTrigger value="profile" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Profil Lengkap</TabsTrigger>
            <TabsTrigger value="history" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Riwayat Bayar</TabsTrigger>
            <TabsTrigger value="billing" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Tagihan & SPP</TabsTrigger>
          </TabsList>

          {/* TAB 1: PROFIL READ-ONLY (CV Style) */}
          <TabsContent value="profile" className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Biodata Card */}
                <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
                    <h3 className="font-semibold text-sm text-primary flex items-center gap-2 pb-2 border-b">
                       <User className="w-4 h-4" />
                       Biodata Pribadi
                    </h3>
                    <div className="space-y-3">
                        <div className="flex flex-col">
                           <span className="text-xs text-muted-foreground">Tempat, Tanggal Lahir</span>
                           <span className="text-sm font-medium">
                              {student.place_of_birth || "-"}, {student.date_of_birth ? format(new Date(student.date_of_birth), "dd MMMM yyyy", { locale: id }) : "-"}
                           </span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-xs text-muted-foreground">Jenis Kelamin</span>
                           <span className="text-sm font-medium capitalize">
                              {student.gender?.toLowerCase() || "-"}
                           </span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-xs text-muted-foreground">Agama</span>
                           <span className="text-sm font-medium capitalize">
                              {student.religion?.toLowerCase() || "-"}
                           </span>
                        </div>
                    </div>
                </div>

                {/* Kontak Card */}
                <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
                    <h3 className="font-semibold text-sm text-primary flex items-center gap-2 pb-2 border-b">
                       <Phone className="w-4 h-4" />
                       Informasi Kontak
                    </h3>
                    <div className="space-y-3">
                        <div className="flex flex-col">
                           <span className="text-xs text-muted-foreground">No. Handphone</span>
                           <span className="text-sm font-medium">
                             {student.phone_number || "-"}
                           </span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-xs text-muted-foreground">Alamat Lengkap</span>
                           <span className="text-sm font-medium leading-relaxed">
                             {student.address || "-"}
                           </span>
                        </div>
                    </div>
                </div>

                {/* Orang Tua Card */}
                <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
                    <h3 className="font-semibold text-sm text-primary flex items-center gap-2 pb-2 border-b">
                       <User className="w-4 h-4" />
                       Data Orang Tua / Wali
                    </h3>
                    <div className="space-y-3">
                        <div className="flex flex-col">
                           <span className="text-xs text-muted-foreground">Nama Ayah</span>
                           <span className="text-sm font-medium">
                             {student.father_name || "-"} {student.father_occupation ? `(${student.father_occupation})` : ''}
                           </span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-xs text-muted-foreground">Nama Ibu</span>
                           <span className="text-sm font-medium">
                             {student.mother_name || "-"} {student.mother_occupation ? `(${student.mother_occupation})` : ''}
                           </span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-xs text-muted-foreground">No. Handphone Darurat</span>
                           <span className="text-sm font-medium">
                             {student.parent_phone || "-"}
                           </span>
                        </div>
                    </div>
                </div>

                {/* Akademik Card */}
                <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
                    <h3 className="font-semibold text-sm text-primary flex items-center gap-2 pb-2 border-b">
                       <Calendar className="w-4 h-4" />
                       Riwayat Akademik
                    </h3>
                    <div className="space-y-3">
                        <div className="flex flex-col">
                           <span className="text-xs text-muted-foreground">Sekolah Asal</span>
                           <span className="text-sm font-medium">
                             {student.school_origin || "-"}
                           </span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-xs text-muted-foreground">Tanggal Bergabung</span>
                           <span className="text-sm font-medium">
                             {student.enrollment_date ? format(new Date(student.enrollment_date), "dd MMMM yyyy", { locale: id }) : "-"}
                           </span>
                        </div>
                    </div>
                </div>

             </div>
          </TabsContent>

          {/* TAB 2: RIWAYAT TABLE */}
          <TabsContent value="history">
             <div className="bg-white rounded-xl border shadow-sm p-5">
                 <h3 className="font-semibold mb-4 flex items-center gap-2 text-primary">
                    <Calendar className="w-4 h-4" />
                    Riwayat Transaksi Terakhir
                 </h3>

                 {isLoading ? (
                     <div className="text-center py-10 text-muted-foreground bg-slate-50 rounded-lg border border-dashed animate-pulse">
                        Memuat riwayat pembayaran...
                     </div>
                 ) : payments && payments.length > 0 ? (
                     <div className="rounded-md border overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-600 border-b">
                                <tr>
                                    <th className="p-3 font-medium">Tanggal</th>
                                    <th className="p-3 font-medium">Kategori</th>
                                    <th className="p-3 font-medium text-right">Jumlah</th>
                                    <th className="p-3 font-medium text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {payments.map((p: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-3 text-slate-600">
                                            {p.payment_date ? format(new Date(p.payment_date), "dd MMM yyyy", { locale: id }) : "-"}
                                        </td>
                                        <td className="p-3 capitalize font-medium text-slate-700">{p.category}</td>
                                        <td className="p-3 text-right font-medium">
                                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(p.amount)}
                                        </td>
                                        <td className="p-3 text-right">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {p.payment_status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                 ) : (
                     <div className="text-center py-10 text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
                        Belum ada riwayat pembayaran yang tercatat.
                     </div>
                 )}
             </div>
          </TabsContent>

          {/* TAB 3: BILLING / TAGIHAN */}
          <TabsContent value="billing">
            <div className="space-y-4">
                <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl shadow-sm">
                    <div className="p-3 bg-white border border-blue-100 rounded-full shadow-sm">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-blue-600/80 mb-1">SPP Bulanan (Base Fee)</p>
                        <p className="text-2xl font-bold text-slate-900">
                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(student.base_fee || 0)}
                        </p>
                    </div>
                    <div className="ml-auto">
                        <Button size="sm" variant="outline" className="bg-white hover:bg-slate-50">Buat Tagihan Manual</Button>
                    </div>
                </div>

                <div className="bg-white p-5 border rounded-xl shadow-sm">
                    <h4 className="font-semibold text-primary mb-3">Informasi Tagihan</h4>
                    <div className="p-6 border border-dashed rounded-lg text-sm text-slate-500 text-center bg-slate-50">
                        Sistem tagihan otomatis akan muncul di sini. Saat ini tagihan dikelola secara manual via Matrix.
                    </div>
                </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
