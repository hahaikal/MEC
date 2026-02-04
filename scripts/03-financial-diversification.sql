-- ==============================================================================
-- MEC FINANCE SYSTEM - PHASE 2: FINANCIAL DIVERSIFICATION
-- Author: Senior Backend Engineer
-- Description: Expenses tracking, Payment Categories, and Financial Reporting View
-- ==============================================================================

-- 1. EXPENSES MODULE: Create Table
-- Tabel ini mencatat arus kas keluar (Operational, Salary, Asset, dll)
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    description TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    category TEXT NOT NULL CHECK (category IN ('operational', 'salary', 'asset', 'maintenance', 'marketing', 'other')),
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    created_by UUID REFERENCES auth.users(id), -- Audit Trail
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.1 Security: Enable RLS for Expenses
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Policy: Admin & Staff Finance can VIEW expenses
CREATE POLICY "Expenses Visibility" ON public.expenses
FOR SELECT USING (
  auth.uid() IN (
    SELECT id FROM public.users 
    WHERE role IN ('admin', 'staff', 'manager', 'finance_staff')
  )
);

-- Policy: Admin & Staff Finance can INSERT expenses
CREATE POLICY "Authorized Insert Expenses" ON public.expenses
FOR INSERT WITH CHECK (
  auth.uid() IN (
    SELECT id FROM public.users 
    WHERE role IN ('admin', 'staff', 'manager', 'finance_staff')
  )
);

-- Policy: Only Admin can DELETE expenses
CREATE POLICY "Admin Delete Expenses" ON public.expenses
FOR DELETE USING (
  auth.uid() IN (
    SELECT id FROM public.users 
    WHERE role = 'admin'
  )
);

-- 1.2 Automation: Auto-fill created_by using existing Trigger Logic
-- Kita reuse function 'set_created_by' yang dibuat di migrasi sebelumnya
DROP TRIGGER IF EXISTS trigger_set_created_by_expenses ON expenses;
CREATE TRIGGER trigger_set_created_by_expenses
BEFORE INSERT ON expenses
FOR EACH ROW
EXECUTE FUNCTION public.set_created_by();


-- 2. PAYMENTS UPDATE: Add 'Category' Column
-- Memisahkan 'Method' (Cash/Transfer) dengan 'Category' (SPP/Uang Pangkal)
-- Default value 'tuition' (SPP) agar data lama tetap valid.
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'tuition' NOT NULL
CHECK (category IN ('tuition', 'registration', 'books', 'uniform', 'other'));

-- Indexing untuk mempercepat filter laporan keuangan berdasarkan kategori
CREATE INDEX IF NOT EXISTS idx_payments_category ON payments(category);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);


-- 3. FINANCIAL REPORTING: Aggregation View (v_monthly_summary)
-- View ini menggabungkan Pemasukan (Payments) dan Pengeluaran (Expenses)
-- Grouping berdasarkan Bulan untuk grafik Profit/Loss di Dashboard.

CREATE OR REPLACE VIEW v_monthly_summary AS
WITH monthly_income AS (
    -- Hitung total pemasukan yang statusnya 'completed'
    SELECT 
        DATE_TRUNC('month', payment_date)::DATE as month_date,
        SUM(amount) as total_income,
        COUNT(id) as transaction_count
    FROM payments 
    WHERE payment_status = 'completed'
    GROUP BY 1
),
monthly_expenses AS (
    -- Hitung total pengeluaran
    SELECT 
        DATE_TRUNC('month', date)::DATE as month_date,
        SUM(amount) as total_expense,
        COUNT(id) as expense_count
    FROM expenses 
    GROUP BY 1
)
SELECT 
    -- Full Outer Join untuk menangani bulan yang mungkin hanya ada expense atau hanya income
    COALESCE(i.month_date, e.month_date) as report_month,
    COALESCE(i.total_income, 0) as total_income,
    COALESCE(e.total_expense, 0) as total_expense,
    (COALESCE(i.total_income, 0) - COALESCE(e.total_expense, 0)) as net_profit,
    COALESCE(i.transaction_count, 0) as income_transactions,
    COALESCE(e.expense_count, 0) as expense_transactions
FROM monthly_income i
FULL OUTER JOIN monthly_expenses e ON i.month_date = e.month_date
ORDER BY report_month DESC;

-- Grant access to the view
GRANT SELECT ON v_monthly_summary TO authenticated;
GRANT SELECT ON v_monthly_summary TO service_role;