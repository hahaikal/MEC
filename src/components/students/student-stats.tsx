'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, AlertCircle, Banknote, Loader2 } from "lucide-react";
import { useDashboardStats } from "@/lib/hooks/use-reports";

interface StudentStatsProps {
  students: any[]; // Kept for prop compatibility, but not used for calculation anymore
}

export function StudentStats({ students }: StudentStatsProps) {
  // Use dedicated hook for stats (Server-side aggregation)
  // This is more efficient than client-side calculation on full student list
  const { data: stats, isLoading } = useDashboardStats();

  // Loading State (Skeleton)
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
              <div className="h-4 w-4 bg-slate-100 rounded-full animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-slate-100 rounded animate-pulse mb-1" />
              <div className="h-3 w-32 bg-slate-100 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const currentMonthName = new Date().toLocaleString('id-ID', { month: 'long' });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Siswa Aktif</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.activeStudents || 0}</div>
          <p className="text-xs text-muted-foreground">
            Siswa terdaftar aktif
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Menunggak Bulan Ini</CardTitle>
          <AlertCircle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{stats?.outstandingCount || 0}</div>
          <p className="text-xs text-muted-foreground">
             Belum bayar SPP {currentMonthName}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Penerimaan Bulan Ini ({currentMonthName})</CardTitle>
          <Banknote className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            }).format(stats?.totalIncome || 0)}
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
