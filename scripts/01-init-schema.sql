-- MEC Finance System - Initial Schema Setup
-- Phase 1: Core Foundation Tables

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'staff', 'manager', 'teacher')),
  department VARCHAR(100),
  phone_number VARCHAR(20),
  profile_picture_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create students table
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone_number VARCHAR(20),
  parent_name VARCHAR(255),
  parent_phone VARCHAR(20),
  date_of_birth DATE,
  address TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated')),
  enrollment_date DATE DEFAULT CURRENT_DATE,
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create programs table
CREATE TABLE IF NOT EXISTS public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration_months INTEGER,
  price DECIMAL(12, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create student_programs table (enrollments)
CREATE TABLE IF NOT EXISTS public.student_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  completion_date DATE,
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(student_id, program_id)
);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE SET NULL,
  amount DECIMAL(12, 2) NOT NULL,
  payment_date DATE DEFAULT CURRENT_DATE,
  payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('cash', 'transfer', 'check', 'card')),
  payment_status VARCHAR(50) NOT NULL DEFAULT 'completed' CHECK (payment_status IN ('completed', 'pending', 'failed', 'cancelled')),
  invoice_number VARCHAR(100) UNIQUE,
  notes TEXT,
  received_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create transaction_summary table for quick access
CREATE TABLE IF NOT EXISTS public.transaction_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_date DATE NOT NULL,
  total_income DECIMAL(12, 2) DEFAULT 0,
  total_paid_programs DECIMAL(12, 2) DEFAULT 0,
  total_outstanding DECIMAL(12, 2) DEFAULT 0,
  payment_count INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create audit_logs table for tracking changes
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  table_name VARCHAR(100),
  record_id UUID,
  action VARCHAR(20) CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for students table
CREATE POLICY "Staff can view students" ON public.students
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'staff', 'manager'))
  );

CREATE POLICY "Staff can insert students" ON public.students
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'staff', 'manager'))
  );

CREATE POLICY "Staff can update students" ON public.students
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'staff', 'manager'))
  ) WITH CHECK (
    auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'staff', 'manager'))
  );

-- RLS Policies for payments table
CREATE POLICY "Staff can view payments" ON public.payments
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'staff', 'manager'))
  );

CREATE POLICY "Staff can insert payments" ON public.payments
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'staff', 'manager'))
  );

CREATE POLICY "Staff can update own payments" ON public.payments
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'staff', 'manager'))
  ) WITH CHECK (
    auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'staff', 'manager'))
  );

-- RLS Policies for programs table
CREATE POLICY "Everyone can view programs" ON public.programs
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage programs" ON public.programs
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

-- Create indexes for performance
CREATE INDEX idx_students_created_by ON public.students(created_by);
CREATE INDEX idx_students_status ON public.students(status);
CREATE INDEX idx_payments_student_id ON public.payments(student_id);
CREATE INDEX idx_payments_payment_date ON public.payments(payment_date);
CREATE INDEX idx_payments_status ON public.payments(payment_status);
CREATE INDEX idx_student_programs_student_id ON public.student_programs(student_id);
CREATE INDEX idx_student_programs_program_id ON public.student_programs(program_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_name ON public.audit_logs(table_name);
