import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

interface ReportFilters {
  year: number
  programIds?: string[]
  months?: string[] // e.g. ["1", "2"] for Jan, Feb
}

export function useFinancialReports(filters: ReportFilters) {
  const { year, programIds = [], months = [] } = filters
  const supabase = createClient()

  return useQuery({
    queryKey: ['reports', 'finance', year, programIds, months],
    queryFn: async () => {
      // 1. Get Income (from completed payments)
      let paymentsQuery = supabase
        .from('payments')
        .select('amount, payment_date, program_id, students(student_programs(program_id), class_enrollments(classes(program_id)))')
        .eq('payment_status', 'completed')
        .gte('payment_date', `${year}-01-01`)
        .lte('payment_date', `${year}-12-31`)

      const { data: rawPayments, error: payError } = await paymentsQuery
      if (payError) throw payError

      const payments = rawPayments?.filter(p => {
        if (programIds.length === 0) return true;
        
        // 1. Check direct program_id on payment
        if (p.program_id && programIds.includes(p.program_id)) return true;
        
        // 2. Check student's enrolled programs
        const sp = p.students?.student_programs;
        if (sp && sp.some((prog: any) => programIds.includes(prog.program_id))) return true;

        // 3. Check student's class enrollments
        const ce = p.students?.class_enrollments;
        if (ce && ce.some((enroll: any) => enroll.classes?.program_id && programIds.includes(enroll.classes.program_id))) return true;

        return false;
      })

      // 2. Get Expenses
      const { data: expenses, error: expError } = await supabase
        .from('expenses')
        .select('amount, date')
        .gte('date', `${year}-01-01`)
        .lte('date', `${year}-12-31`)

      if (expError) throw expError

      // Aggregate by month
      const monthlyData = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        income: 0,
        expense: 0,
        net: 0
      }))

      payments?.forEach(p => {
        const d = new Date(p.payment_date)
        const monthIndex = d.getMonth()
        monthlyData[monthIndex].income += Number(p.amount)
      })

      expenses?.forEach(e => {
        const d = new Date(e.date)
        const monthIndex = d.getMonth()
        monthlyData[monthIndex].expense += Number(e.amount)
      })

      monthlyData.forEach(m => {
        m.net = m.income - m.expense
      })
      
      if (months.length > 0) {
         const activeMonthsNum = months.map(m => parseInt(m))
         return monthlyData.filter(m => activeMonthsNum.includes(m.month))
      }

      return monthlyData
    },
    enabled: !!year
  })
}


import { getDashboardStats } from "@/actions/reports";

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats-students'],
    queryFn: async () => {
      const stats = await getDashboardStats();
      return stats;
    }
  });
}
