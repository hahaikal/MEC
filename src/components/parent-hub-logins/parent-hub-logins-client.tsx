"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { User, ShieldAlert, MonitorPlay } from "lucide-react";
import { getParentHubLoginLogs } from "@/actions/parent-hub-auth";
import { Button } from "@/components/ui/button";

interface LogProps {
  initialLogs: any[];
  totalLogs: number;
  currentPage: number;
  itemsPerPage: number;
}

export function ParentHubLoginsClient({ initialLogs, totalLogs, currentPage, itemsPerPage }: LogProps) {
  const [logs, setLogs] = useState(initialLogs);
  const [total, setTotal] = useState(totalLogs);
  const [page, setPage] = useState(currentPage);
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState<string>("");

  const totalPages = Math.ceil(total / itemsPerPage) || 1;

  const fetchLogs = async (newPage: number, date?: string) => {
    setLoading(true);
    try {
      const res = await getParentHubLoginLogs(newPage, itemsPerPage, date, date);
      setLogs(res.logs);
      setTotal(res.total);
      setPage(newPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDateFilter(val);
    fetchLogs(1, val);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <div className="flex-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
            Filter Tanggal
          </label>
          <input
            type="date"
            value={dateFilter}
            onChange={handleDateChange}
            className="h-10 w-full sm:w-64 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        {dateFilter && (
          <div className="flex items-end self-stretch pb-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDateFilter("");
                fetchLogs(1, "");
              }}
            >
              Reset
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium text-slate-500">User / Siswa</th>
                <th className="px-6 py-4 font-medium text-slate-500">Tipe Akses</th>
                <th className="px-6 py-4 font-medium text-slate-500">Kelas</th>
                <th className="px-6 py-4 font-medium text-slate-500">Waktu Login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground animate-pulse">
                    Memuat data...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                    Belum ada data login yang tercatat.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const isStaff = log.login_type === "staff";
                  const photoUrl = isStaff ? null : log.students?.photo_url;
                  const name = isStaff ? log.student_name : log.students?.name || log.student_name;
                  
                  // Extract class names if student
                  const classNames = !isStaff && log.students?.class_enrollments
                    ? log.students.class_enrollments.map((e: any) => e.classes?.name).join(", ")
                    : "-";

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                            {photoUrl ? (
                              <img src={photoUrl} alt={name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                                <User className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isStaff ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 border border-amber-200">
                            <ShieldAlert className="h-3.5 w-3.5" />
                            Staff (Full Access)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800 border border-blue-200">
                            <MonitorPlay className="h-3.5 w-3.5" />
                            Student Portal
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {isStaff ? <span className="text-slate-400 italic">All Classes</span> : classNames}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {format(new Date(log.logged_in_at), "dd MMM yyyy, HH:mm", { locale: id })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between border-t px-6 py-4 bg-slate-50/50">
          <p className="text-sm text-slate-500">
            Halaman <span className="font-medium text-slate-900">{page}</span> dari{" "}
            <span className="font-medium text-slate-900">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1 || loading}
              onClick={() => fetchLogs(page - 1, dateFilter)}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages || loading || totalPages === 0}
              onClick={() => fetchLogs(page + 1, dateFilter)}
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
