'use server'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

export async function getDashboardStats() {
  const supabaseAuth = await createClient()
  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser()
  
  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Server misconfiguration: SUPABASE_SERVICE_ROLE_KEY is missing on Vercel')
  }

  // Use service role to bypass RLS for global dashboard aggregates
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const now = new Date()

  // 1. Total Active Students
  const { count: totalStudents, error: studentsError } = await supabase
    .from('students')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'ACTIVE')

  if (studentsError) {
    console.error('Dashboard stats - students error:', studentsError)
  }

  // 2. Active Programs
  const { count: activePrograms, error: programsError } = await supabase
    .from('programs')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  if (programsError) {
    console.error('Dashboard stats - programs error:', programsError)
  }

  // 3. Total Revenue (All completed payments)
  const { data: paymentsData, error: paymentsError } = await supabase
    .from('payments')
    .select('amount')
    .eq('payment_status', 'completed')

  if (paymentsError) {
    console.error('Dashboard stats - payments error:', paymentsError)
  }

  const totalRevenue = (paymentsData || []).reduce(
    (sum, payment) => sum + Number(payment.amount),
    0
  )

  // 4. Monthly Growth (Revenue comparison: current month vs last month)
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() // 0-indexed

  const currentMonthStart = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`
  const currentMonthLastDay = new Date(currentYear, currentMonth + 1, 0)
  const currentMonthEnd = `${currentMonthLastDay.getFullYear()}-${String(currentMonthLastDay.getMonth() + 1).padStart(2, '0')}-${String(currentMonthLastDay.getDate()).padStart(2, '0')}`

  const lastMonthDate = new Date(currentYear, currentMonth - 1, 1)
  const lastMonthStart = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}-01`
  const lastMonthLastDay = new Date(currentYear, currentMonth, 0)
  const lastMonthEnd = `${lastMonthLastDay.getFullYear()}-${String(lastMonthLastDay.getMonth() + 1).padStart(2, '0')}-${String(lastMonthLastDay.getDate()).padStart(2, '0')}`

  // Current Month Revenue
  const { data: currentMonthData, error: currentMonthError } = await supabase
    .from('payments')
    .select('amount')
    .eq('payment_status', 'completed')
    .gte('payment_date', currentMonthStart)
    .lte('payment_date', currentMonthEnd)

  if (currentMonthError) {
    console.error('Dashboard stats - current month error:', currentMonthError)
  }

  const currentMonthRevenue = (currentMonthData || []).reduce(
    (sum, payment) => sum + Number(payment.amount),
    0
  )

  // Last Month Revenue
  const { data: lastMonthData, error: lastMonthError } = await supabase
    .from('payments')
    .select('amount')
    .eq('payment_status', 'completed')
    .gte('payment_date', lastMonthStart)
    .lte('payment_date', lastMonthEnd)

  if (lastMonthError) {
    console.error('Dashboard stats - last month error:', lastMonthError)
  }

  const lastMonthRevenue = (lastMonthData || []).reduce(
    (sum, payment) => sum + Number(payment.amount),
    0
  )

  let monthlyGrowth = 0
  if (lastMonthRevenue === 0) {
    monthlyGrowth = currentMonthRevenue > 0 ? 100 : 0
  } else {
    monthlyGrowth =
      ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
  }

  return {
    totalStudents: totalStudents || 0,
    totalRevenue,
    activePrograms: activePrograms || 0,
    monthlyGrowth,
  }
}
