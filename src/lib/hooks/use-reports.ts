import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

// Dashboard Stats Hook
export function useDashboardStats() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() // 0-11
      
      const startOfMonth = new Date(year, month, 1).toISOString()
      const endOfMonth = new Date(year, month + 1, 0).toISOString()

      // 1. Get Active Students Count
      const { count: activeStudentsCount, error: activeError } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .or('status.eq.active,status.eq.ACTIVE')

      if (activeError) throw activeError

      // 2. Get Payments This Month
      // We need both the sum (Total Income) AND unique student IDs (for Paid Count)
      // This query is much lighter than fetching all students + joined payments
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('amount, student_id, category')
        .gte('payment_date', startOfMonth)
        .lte('payment_date', endOfMonth)
        .eq('payment_status', 'completed')

      if (paymentsError) throw paymentsError

      // Total Income (All Categories)
      const totalIncome = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
      
      // Paid Count (Tuition Only for 'Outstanding' logic)
      // Assuming 'Outstanding' refers to Tuition (SPP) specifically
      const uniquePaidTuitionIds = new Set(
        payments
          .filter(p => p.category === 'tuition' || !p.category) // Default to tuition if null? Or strict?
          .map(p => p.student_id)
      )
      const paidCount = uniquePaidTuitionIds.size

      // Outstanding = Active Students - Unique Paid Students (Tuition)
      // Note: This is an estimation. 
      const outstandingCount = Math.max(0, (activeStudentsCount || 0) - paidCount)

      return {
        activeStudents: activeStudentsCount || 0,
        totalIncome,
        outstandingCount,
        paidCount
      }
    },
    // Keep data fresh for 1 minute, but refetch on mount/window focus
    staleTime: 1000 * 60, 
  })
}

// Transaction Summary Hook (Example existing hook if any, kept for context)
export function useTransactionSummary(startDate: string, endDate: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['transaction-summary', startDate, endDate],
    queryFn: async () => {
        // ... existing logic implementation or placeholder
        return []
    }
  })
}

export function useReports(year: number) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['reports', year],
    queryFn: async () => {
      const startDate = `${year}-01-01`
      const endDate = `${year}-12-31`

      // 1. Fetch Monthly Summary from View
      const { data: monthlyData, error: monthlyError } = await supabase
        .from('v_monthly_summary')
        .select('*')
        .gte('report_month', startDate)
        .lte('report_month', endDate)
        .order('report_month', { ascending: true })

      if (monthlyError) throw monthlyError

      // 2. Fetch Expenses for Breakdown
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('category, amount')
        .gte('date', startDate)
        .lte('date', endDate)

      if (expensesError) throw expensesError

      // 3. Fetch Revenue Sources (Payments)
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('category, amount')
        .eq('payment_status', 'completed')
        .gte('payment_date', startDate)
        .lte('payment_date', endDate)

      if (paymentsError) throw paymentsError

      // 4. Fetch Active Students (Current count as approximation)
      const { count: studentCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .or('status.eq.active,status.eq.ACTIVE')

      // PROCESS DATA

      // Monthly Reports
      // Initialize all 12 months with 0 data
      const allMonths = Array.from({ length: 12 }, (_, i) => {
        const d = new Date(year, i, 1)
        return {
          monthIndex: i,
          month: d.toLocaleString('id-ID', { month: 'long' }),
          revenue: 0,
          expenses: 0,
          profit: 0,
          profitMargin: 0,
          students: studentCount || 0
        }
      })

      // Merge fetched data
      monthlyData?.forEach(item => {
        const date = new Date(item.report_month)
        const monthIndex = date.getMonth()
        if (monthIndex >= 0 && monthIndex < 12) {
          const revenue = Number(item.total_income) || 0
          const expenses = Number(item.total_expense) || 0
          const profit = Number(item.net_profit) || 0
          const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0

          allMonths[monthIndex] = {
            ...allMonths[monthIndex],
            revenue,
            expenses,
            profit,
            profitMargin,
          }
        }
      })

      const monthlyReports = allMonths

      // Summary
      const totalRevenue = monthlyReports.reduce((acc, curr) => acc + curr.revenue, 0)
      const totalExpenses = monthlyReports.reduce((acc, curr) => acc + curr.expenses, 0)
      const totalProfit = totalRevenue - totalExpenses
      const avgProfitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0

      // Expense Breakdown
      const expenseMap = new Map<string, number>()
      expensesData?.forEach((exp: any) => {
        const cat = exp.category || 'other'
        const current = expenseMap.get(cat) || 0
        expenseMap.set(cat, current + Number(exp.amount))
      })

      const expenseBreakdown = Array.from(expenseMap.entries()).map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
      })).sort((a, b) => b.amount - a.amount)

       // Revenue Sources
      const revenueMap = new Map<string, number>()
      paymentsData?.forEach((pay: any) => {
        const cat = pay.category || 'tuition' // Default to tuition
        const current = revenueMap.get(cat) || 0
        revenueMap.set(cat, current + Number(pay.amount))
      })

      const revenueSources = Array.from(revenueMap.entries()).map(([source, amount]) => ({
        source,
        amount,
        percentage: totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0
      })).sort((a, b) => b.amount - a.amount)

      return {
        monthlyReports,
        summary: {
          totalRevenue,
          totalExpenses,
          totalProfit,
          avgProfitMargin
        },
        expenseBreakdown,
        revenueSources
      }
    }
  })
}
