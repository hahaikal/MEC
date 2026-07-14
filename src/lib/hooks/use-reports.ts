import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

interface ReportFilters {
  year: number
  programIds?: string[]
  months?: string[] // e.g. ["1", "2"] for Jan, Feb
  categories?: string[] // e.g. ["registration", "books", "tuition"]
}

export function useFinancialReports(filters: ReportFilters) {
  const { year, programIds = [], months = [], categories = [] } = filters
  const supabase = createClient()

  return useQuery({
    queryKey: ['reports', 'finance', year, programIds, months, categories],
    queryFn: async () => {
      // 1. Get Income (from completed payments)
      const paymentsQuery = supabase
        .from('payments')
        .select('id, amount, payment_date, category, payment_status, program_id, students(name, class_enrollments(classes(program_id)))')
        .eq('payment_status', 'completed')
        .gte('payment_date', `${year}-01-01`)
        .lte('payment_date', `${year}-12-31`)

      const { data: rawPayments, error: payError } = await paymentsQuery
      if (payError) throw payError

      const payments = rawPayments?.filter(p => {
        // Filter by program
        if (programIds.length > 0) {
          let hasProgram = false;
          if (p.program_id && programIds.includes(p.program_id)) hasProgram = true;
          else {
            const ce = p.students?.class_enrollments;
            if (ce && ce.some((enroll: any) => enroll.classes?.program_id && programIds.includes(enroll.classes.program_id))) hasProgram = true;
          }
          if (!hasProgram) return false;
        }

        // Filter by category
        if (categories.length > 0) {
          if (!categories.includes(p.category)) return false;
        }

        // Filter by month
        if (months.length > 0) {
          const d = new Date(p.payment_date)
          if (!months.includes((d.getMonth() + 1).toString())) return false;
        }

        return true;
      })

      // 2. Get Expenses
      const { data: rawExpenses, error: expError } = await supabase
        .from('expenses')
        .select('id, amount, date, description, category')
        .gte('date', `${year}-01-01`)
        .lte('date', `${year}-12-31`)

      if (expError) throw expError

      const expenses = rawExpenses?.filter(e => {
        // Expenses don't typically have students/programs. If program is filtered, 
        // we might want to hide all expenses or maybe expenses have program_id? 
        // Assuming they don't, if program is selected, maybe we still show expenses?
        // Usually if a specific program is selected, expenses might not map directly unless they have program_id.
        // For now, we will apply category and month filters to expenses.
        
        if (categories.length > 0) {
           if (!categories.includes(e.category)) return false;
        }

        if (months.length > 0) {
          const d = new Date(e.date)
          if (!months.includes((d.getMonth() + 1).toString())) return false;
        }
        
        return true;
      })

      // Aggregate by month (only for the requested months if any, but we build 12 months first)
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
      
      const filteredMonthlyData = months.length > 0 
        ? monthlyData.filter(m => months.includes(m.month.toString()))
        : monthlyData;

      // Extract Recent Transactions from the filtered lists
      const formattedPayments = (payments || []).map(p => ({
        id: `inc-${p.id}`,
        type: 'income',
        amount: Number(p.amount),
        date: new Date(p.payment_date),
        title: `Payment from ${p.students?.name || 'Unknown'}`,
        category: p.category,
        status: p.payment_status
      }));

      const formattedExpenses = (expenses || []).map(e => ({
        id: `exp-${e.id}`,
        type: 'expense',
        amount: Number(e.amount),
        date: new Date(e.date),
        title: e.description || 'Pengeluaran',
        category: e.category,
        status: 'completed'
      }));

      const recentTransactions = [...formattedPayments, ...formattedExpenses]
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 10);

      return {
        monthlyData: filteredMonthlyData,
        recentTransactions
      }
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
