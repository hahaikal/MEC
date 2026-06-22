import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { startOfMonth, endOfMonth, subMonths } from 'date-fns'

export function useDashboardStats() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // 1. Total Students
      const { count: totalStudents, error: studentsError } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ACTIVE')

      if (studentsError) throw studentsError

      // 2. Active Programs
      const { count: activePrograms, error: programsError } = await supabase
        .from('programs')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      if (programsError) throw programsError

      // 3. Total Revenue (All completed payments)
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('amount')
        .eq('payment_status', 'completed')

      if (paymentsError) throw paymentsError

      const totalRevenue = paymentsData.reduce((sum, payment) => sum + Number(payment.amount), 0)

      // 4. Monthly Growth (Revenue)
      const now = new Date()

      const currentMonthStart = startOfMonth(now).toISOString()
      const currentMonthEnd = endOfMonth(now).toISOString()

      const lastMonthStart = startOfMonth(subMonths(now, 1)).toISOString()
      const lastMonthEnd = endOfMonth(subMonths(now, 1)).toISOString()

      // Current Month Revenue
      const { data: currentMonthData, error: currentMonthError } = await supabase
        .from('payments')
        .select('amount')
        .eq('payment_status', 'completed')
        .gte('payment_date', currentMonthStart)
        .lte('payment_date', currentMonthEnd)

      if (currentMonthError) throw currentMonthError

      const currentMonthRevenue = currentMonthData.reduce((sum, payment) => sum + Number(payment.amount), 0)

      // Last Month Revenue
      const { data: lastMonthData, error: lastMonthError } = await supabase
        .from('payments')
        .select('amount')
        .eq('payment_status', 'completed')
        .gte('payment_date', lastMonthStart)
        .lte('payment_date', lastMonthEnd)

      if (lastMonthError) throw lastMonthError

      const lastMonthRevenue = lastMonthData.reduce((sum, payment) => sum + Number(payment.amount), 0)

      let monthlyGrowth = 0
      if (lastMonthRevenue === 0) {
        monthlyGrowth = currentMonthRevenue > 0 ? 100 : 0
      } else {
        monthlyGrowth = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      }

      return {
        totalStudents: totalStudents || 0,
        totalRevenue: totalRevenue,
        activePrograms: activePrograms || 0,
        monthlyGrowth: monthlyGrowth,
      }
    },
  })
}
