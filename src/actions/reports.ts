'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Define Report Types
export interface MonthlyReport {
  month: string;
  year: number;
  monthNum: number;
  revenue: number;
  expenses: number;
  profit: number;
  students: number;
  profitMargin: number;
}

export interface ExpenseBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface RevenueSource {
  source: string;
  amount: number;
  percentage: number;
}

export async function getReportsData(year: number = new Date().getFullYear()) {
  const supabase = await createClient();

  // 1. Fetch Monthly Revenue (Payments)
  // We'll aggregate by month for the given year
  const { data: payments, error: paymentsError } = await supabase
    .from('payments')
    .select('amount, month, year, payment_status, category')
    .eq('year', year)
    .eq('payment_status', 'completed'); // Only count completed

  if (paymentsError) {
    console.error('Error fetching payments:', paymentsError);
    return { error: 'Failed to fetch payments data' };
  }

  // 2. Fetch Monthly Expenses
  const { data: expenses, error: expensesError } = await supabase
    .from('expenses')
    .select('amount, date, category')
    .gte('date', `${year}-01-01`)
    .lte('date', `${year}-12-31`);

  if (expensesError) {
    console.error('Error fetching expenses:', expensesError);
    return { error: 'Failed to fetch expenses data' };
  }

  // 3. Aggregate Monthly Data
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const monthNum = i; // 0-11
    const revenue = payments
      .filter(p => p.month === monthNum)
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const expense = expenses
      .filter(e => new Date(e.date).getMonth() === monthNum)
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    const profit = revenue - expense;
    const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;

    // We can fetch student count per month if needed (e.g. active students)
    // For now, let's assume total students is constant or fetch current count
    const students = 0; // Placeholder

    return {
      month: new Date(year, monthNum, 1).toLocaleString('id-ID', { month: 'long' }) + ` ${year}`,
      year,
      monthNum,
      revenue,
      expenses: expense,
      profit,
      students,
      profitMargin
    };
  });

  // 4. Aggregate Expense Breakdown
  const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const expenseCategories = ['operational', 'salary', 'asset', 'maintenance', 'marketing', 'other'];
  const expenseBreakdown: ExpenseBreakdown[] = expenseCategories.map(cat => {
    const amount = expenses
      .filter(e => e.category === cat)
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    return {
      category: cat.charAt(0).toUpperCase() + cat.slice(1), // Capitalize
      amount,
      percentage: totalExpenses > 0 ? Number(((amount / totalExpenses) * 100).toFixed(1)) : 0
    };
  }).filter(e => e.amount > 0); // Only showing active categories

  // 5. Aggregate Revenue Sources
  const totalRevenue = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const revenueCategories = ['tuition', 'registration', 'books', 'uniform', 'other'];
  const revenueSources: RevenueSource[] = revenueCategories.map(cat => {
    const amount = payments
      .filter(p => p.category === cat)
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    return {
      source: cat === 'tuition' ? 'SPP (Tuition Fee)' : cat.charAt(0).toUpperCase() + cat.slice(1),
      amount,
      percentage: totalRevenue > 0 ? Number(((amount / totalRevenue) * 100).toFixed(1)) : 0
    };
  }).filter(r => r.amount > 0);

  return {
    monthlyReports: monthlyData,
    expenseBreakdown,
    revenueSources,
    summary: {
      totalRevenue,
      totalExpenses,
      totalProfit: totalRevenue - totalExpenses,
      avgProfitMargin: totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue * 100).toFixed(1) : 0
    }
  };
}

export async function getDashboardStats() {
  const supabase = await createClient();

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // 1. Active students count
  const { count: activeStudents, error: err1 } = await supabase
    .from('students')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'ACTIVE');

  if (err1) console.error(err1);

  // 2. Outstanding count (dummy simple logic for now, or just active students minus those who paid)
  // Let's count who has paid for this month
  const { data: paidPayments, error: err2 } = await supabase
    .from('payments')
    .select('student_id')
    .eq('payment_status', 'completed')
    .eq('category', 'tuition')
    .eq('month', currentMonth)
    .eq('year', currentYear);

  if (err2) console.error(err2);

  const paidStudentIds = new Set((paidPayments || []).map(p => p.student_id));
  const outstandingCount = Math.max(0, (activeStudents || 0) - paidStudentIds.size);

  // 3. Total income this month
  // Get first day of this month
  const firstDay = new Date(currentYear, currentMonth - 1, 1).toISOString();
  // Get first day of next month
  const firstDayNextMonth = new Date(currentYear, currentMonth, 1).toISOString();

  const { data: incomeData, error: err3 } = await supabase
    .from('payments')
    .select('amount')
    .eq('payment_status', 'completed')
    .gte('payment_date', firstDay)
    .lt('payment_date', firstDayNextMonth);

  if (err3) console.error(err3);

  const totalIncome = (incomeData || []).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  return {
    activeStudents: activeStudents || 0,
    outstandingCount: outstandingCount,
    totalIncome: totalIncome
  };
}
