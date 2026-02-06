import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, AlertCircle, Banknote } from "lucide-react";

interface StudentStatsProps {
  students: any[];
}

export function StudentStats({ students }: StudentStatsProps) {
  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === "ACTIVE" || s.status === "active").length;

  // Hitung pembayaran bulan ini (Logic sederhana berdasarkan payment_date)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const totalCollectedThisMonth = students.reduce((acc, student) => {
    const monthPayments = student.payments?.filter((p: any) => {
      if (!p.payment_date) return false;
      const d = new Date(p.payment_date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear && p.payment_status === 'completed';
    }) || [];
    
    const sum = monthPayments.reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0);
    return acc + sum;
  }, 0);

  // Estimasi siswa menunggak (Sederhana: Status Active tapi belum ada payment bulan ini untuk 'tuition')
  const studentsWithArrears = students.filter(student => {
    if (student.status !== 'ACTIVE' && student.status !== 'active') return false;
    
    const hasPaidTuitionThisMonth = student.payments?.some((p: any) => {
      if (!p.payment_date) return false;
      const d = new Date(p.payment_date);
      return d.getMonth() === currentMonth && 
             d.getFullYear() === currentYear && 
             p.category === 'tuition';
    });
    
    return !hasPaidTuitionThisMonth;
  }).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStudents}</div>
          <p className="text-xs text-muted-foreground">
            {activeStudents} siswa aktif
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Menunggak Bulan Ini</CardTitle>
          <AlertCircle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{studentsWithArrears}</div>
          <p className="text-xs text-muted-foreground">
             Belum bayar SPP {new Date().toLocaleString('id-ID', { month: 'long' })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Penerimaan Bulan Ini</CardTitle>
          <Banknote className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            }).format(totalCollectedThisMonth)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total masuk dari semua kategori
          </p>
        </CardContent>
      </Card>

       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status Data</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Updated</div>
          <p className="text-xs text-muted-foreground">
            Realtime sync active
          </p>
        </CardContent>
      </Card>
    </div>
  );
}