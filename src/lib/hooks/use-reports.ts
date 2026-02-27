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
