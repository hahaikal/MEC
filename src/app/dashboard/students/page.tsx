import { TuitionMatrixTable } from "@/components/students/tuition-matrix-table";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Data Siswa & SPP | Dashboard",
  description: "Kelola data siswa dan status pembayaran SPP bulanan.",
};

export default function StudentsPage() {
  return (
    <div className="flex flex-col h-full space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Siswa & SPP</h2>
          <p className="text-muted-foreground">
            Pantau status pembayaran SPP bulanan siswa secara real-time.
          </p>
        </div>
      </div>
      <Separator />
      <div className="flex-1 overflow-hidden rounded-md border bg-card shadow-sm">
        <TuitionMatrixTable />
      </div>
    </div>
  );
}