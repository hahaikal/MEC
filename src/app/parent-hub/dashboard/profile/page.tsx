"use client";

import { useState, useEffect } from "react";
import { User, CheckCircle, AlertCircle, FileText, CalendarDays, MapPin, Phone, Users, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";

export default function StudentProfilePage() {
  const [session, setSession] = useState<any>(null);
  const [studentData, setStudentData] = useState<any>(null);
  const [attendance, setAttendance] = useState({ present: 0, absent: 0, total: 0, percentage: 0 });
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const raw = sessionStorage.getItem("parent-hub-session");
    if (raw) {
      try { setSession(JSON.parse(raw)); } catch {}
    }
  }, []);

  useEffect(() => {
    if (!session) return;
    
    if (session.type !== 'student' || !session.studentId) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      // Fetch Student
      const { data: st } = await supabase.from('students').select('*').eq('id', session.studentId).single();
      if (st) setStudentData(st);

      // Fetch Attendance
      const { data: att } = await supabase.from('attendance_logs').select('status').eq('student_id', session.studentId);
      if (att) {
         const present = att.filter((a:any) => a.status?.toLowerCase() === 'present' || a.status?.toLowerCase() === 'hadir').length;
         const absent = att.filter((a:any) => a.status?.toLowerCase() === 'absent' || a.status?.toLowerCase() === 'alpha' || a.status?.toLowerCase() === 'sick' || a.status?.toLowerCase() === 'leave' || a.status?.toLowerCase() === 'sakit' || a.status?.toLowerCase() === 'izin').length;
         const total = present + absent;
         setAttendance({
           present, absent, total,
           percentage: total > 0 ? Math.round((present / total) * 100) : 0
         });
      }

      // Fetch Payments
      const { data: pays } = await supabase.from('payments')
        .select('*')
        .eq('student_id', session.studentId)
        .order('payment_date', { ascending: false });
      
      if (pays) setPayments(pays);
      
      setIsLoading(false);
    };

    loadData();
  }, [session]);

  if (isLoading) {
    return <div className="flex justify-center p-12 text-neutral-500">Loading profile data...</div>;
  }

  if (session?.type === 'staff') {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-3xl bg-white p-12 text-center shadow-card">
        <Users className="mb-4 h-12 w-12 text-neutral-300" />
        <h2 className="font-display text-xl font-bold text-[#111111]">Staff Account</h2>
        <p className="text-neutral-500">This profile page is designated for student and parent accounts.</p>
      </div>
    );
  }

  if (!studentData) {
    return <div className="p-12 text-center text-neutral-500">Student data not found.</div>;
  }

  const programName = session.enrollments?.[0]?.program_name || "Enrolled Program";
  const className = session.enrollments?.[0]?.class_name || "Assigned Class";

  const currentInvoices = payments.slice(0, 3); // latest 3 payments

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Profile Card */}
      <section className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-card md:p-10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-mec-blue/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-mec-yellow/10 blur-3xl" />
        
        <div className="relative flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-10">
          <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-lg md:h-40 md:w-40 bg-neutral-100 flex items-center justify-center">
            {studentData.photo_url ? (
               <img src={studentData.photo_url} alt={studentData.name} className="h-full w-full object-cover" />
            ) : (
               <User className="h-16 w-16 text-neutral-300" />
            )}
            <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/10" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-mec-yellow px-3 py-1 text-xs font-bold uppercase tracking-widest text-mec-ink mb-3">
              <User className="h-3 w-3" /> Student Profile
            </div>
            <h1 className="font-display text-3xl font-extrabold text-[#111111] md:text-4xl">
              {studentData.name}
            </h1>
            <p className="mt-2 text-lg font-medium text-neutral-600">{className}</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-neutral-500 md:justify-start">
              <span className="flex items-center gap-1.5 bg-[#F2F2F2] px-3 py-1.5 rounded-lg">
                <FileText className="h-4 w-4 text-mec-blue" /> ID: {studentData.student_id_code || studentData.nis || "N/A"}
              </span>
              <span className="flex items-center gap-1.5 bg-[#F2F2F2] px-3 py-1.5 rounded-lg">
                <CalendarDays className="h-4 w-4 text-mec-blue" /> {programName}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Biodata Section */}
      <section className="rounded-3xl bg-white p-6 shadow-card md:p-8">
        <h2 className="font-display text-xl font-bold text-[#111111] mb-6">Student Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1 flex items-center gap-1.5">
                <User className="h-3 w-3" /> Full Name
              </div>
              <div className="font-medium text-[#111111]">{studentData.name}</div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1 flex items-center gap-1.5">
                <Calendar className="h-3 w-3" /> Date of Birth
              </div>
              <div className="font-medium text-[#111111]">
                {studentData.date_of_birth ? format(new Date(studentData.date_of_birth), 'MMMM d, yyyy') : '-'}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1 flex items-center gap-1.5">
                <User className="h-3 w-3" /> Gender
              </div>
              <div className="font-medium text-[#111111] capitalize">{studentData.gender || '-'}</div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1 flex items-center gap-1.5">
                <Users className="h-3 w-3" /> Parent's Name
              </div>
              <div className="font-medium text-[#111111]">
                {studentData.father_name ? `${studentData.father_name} (Father)` : studentData.mother_name ? `${studentData.mother_name} (Mother)` : '-'}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1 flex items-center gap-1.5">
                <Phone className="h-3 w-3" /> Parent Phone
              </div>
              <div className="font-medium text-[#111111]">{studentData.parent_phone || studentData.phone_number || '-'}</div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1 flex items-center gap-1.5">
                <MapPin className="h-3 w-3" /> Address
              </div>
              <div className="font-medium text-[#111111]">{studentData.address || '-'}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Attendance Summary */}
        <section className="col-span-1 rounded-3xl bg-white p-6 shadow-card md:p-8">
          <h2 className="font-display text-xl font-bold text-[#111111] mb-6">Attendance Summary</h2>
          <div className="flex flex-col items-center justify-center">
            {/* Circular Progress */}
            <div className="relative flex h-40 w-40 items-center justify-center">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#F2F2F2"
                  strokeWidth="12"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#1D75C0"
                  strokeWidth="12"
                  strokeDasharray={`${(attendance.percentage * 251.2) / 100} 251.2`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute text-center">
                <span className="block font-display text-3xl font-bold text-[#111111]">{attendance.percentage}%</span>
                <span className="text-xs font-medium text-neutral-500">Present</span>
              </div>
            </div>
            
            <div className="mt-8 grid w-full grid-cols-2 gap-4">
              <div className="rounded-2xl bg-green-50 p-4 text-center">
                <span className="block text-2xl font-bold text-green-600">{attendance.present}</span>
                <span className="text-xs font-medium text-green-700 uppercase tracking-wider">Attended</span>
              </div>
              <div className="rounded-2xl bg-red-50 p-4 text-center">
                <span className="block text-2xl font-bold text-[#E11D2A]">{attendance.absent}</span>
                <span className="text-xs font-medium text-red-700 uppercase tracking-wider">Absent</span>
              </div>
            </div>
          </div>
        </section>

        {/* Finance Section */}
        <section className="col-span-1 md:col-span-2 space-y-6">
          {/* Invoices / Recent */}
          <div className="rounded-3xl bg-white p-6 shadow-card md:p-8">
            <h2 className="font-display text-xl font-bold text-[#111111] mb-6">Current / Recent Payments</h2>
            <div className="space-y-4">
              {currentInvoices.length === 0 ? (
                <div className="text-sm text-neutral-500 text-center py-4">No recent payments found.</div>
              ) : (
                currentInvoices.map((inv) => (
                  <div key={inv.id} className="flex flex-col gap-4 rounded-2xl border border-neutral-100 bg-[#F2F2F2]/50 p-4 transition-colors hover:bg-[#F2F2F2] sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${inv.payment_status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-mec-yellow/20 text-mec-yellow'}`}>
                        {inv.payment_status === 'Paid' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#111111]">{inv.category || 'Tuition Fee'}</h4>
                        <p className="text-sm font-medium text-neutral-500">{inv.invoice_number || 'No Invoice'} &bull; {inv.payment_date ? format(new Date(inv.payment_date), 'MMM d, yyyy') : '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:items-end sm:gap-1">
                      <span className="font-display text-lg font-bold text-[#111111]">{formatCurrency(inv.amount)}</span>
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                        inv.payment_status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-mec-yellow text-mec-ink'
                      }`}>
                        {inv.payment_status || 'Pending'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Payment History */}
          <div className="rounded-3xl bg-white p-6 shadow-card md:p-8">
            <h2 className="font-display text-xl font-bold text-[#111111] mb-6">Payment History</h2>
            {payments.length === 0 ? (
               <div className="text-sm text-neutral-500 text-center py-4">No payment history found.</div>
            ) : (
              <div className="relative border-l-2 border-neutral-100 ml-4 space-y-8">
                {payments.map((pay) => (
                  <div key={pay.id} className="relative pl-6">
                    <span className="absolute -left-[9px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-mec-blue ring-4 ring-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                      <div>
                        <h4 className="font-bold text-[#111111]">{pay.category || 'Tuition Fee'}</h4>
                        <p className="text-sm text-neutral-500">{pay.invoice_number || 'Payment'} &bull; {pay.payment_method}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="block font-bold text-green-600">{formatCurrency(pay.amount)}</span>
                        <span className="text-xs font-medium text-neutral-400">{pay.payment_date ? format(new Date(pay.payment_date), 'MMM d, yyyy') : '-'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
