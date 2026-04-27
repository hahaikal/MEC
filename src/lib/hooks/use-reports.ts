import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useFinancialReports(year: number) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['reports', 'finance', year],
    queryFn: async () => {
      // 1. Get Income (from completed payments)
      const { data: payments, error: payError } = await supabase
        .from('payments')
        .select('amount, payment_date')
        .eq('payment_status', 'completed')
        .gte('payment_date', `${year}-01-01`)
        .lte('payment_date', `${year}-12-31`)

      if (payError) throw payError

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

      return monthlyData
    },
    enabled: !!year
  })
}


import { getDashboardStats } from "@/actions/reports";

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const stats = await getDashboardStats();
      return stats;
    }
  });
}
