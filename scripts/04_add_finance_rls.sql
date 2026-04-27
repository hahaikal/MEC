-- Enable RLS on finance tables
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Create policies for payments
CREATE POLICY "Admins, managers, and staff can view payments"
ON public.payments FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'manager', 'staff')
  )
);

CREATE POLICY "Admins, managers, and staff can insert payments"
ON public.payments FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'manager', 'staff')
  )
);

CREATE POLICY "Admins, managers, and staff can update payments"
ON public.payments FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'manager', 'staff')
  )
);

CREATE POLICY "Admins and managers can delete payments"
ON public.payments FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'manager')
  )
);

-- Create policies for expenses
CREATE POLICY "Admins, managers, and staff can view expenses"
ON public.expenses FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'manager', 'staff')
  )
);

CREATE POLICY "Admins, managers, and staff can insert expenses"
ON public.expenses FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'manager', 'staff')
  )
);

CREATE POLICY "Admins, managers, and staff can update expenses"
ON public.expenses FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'manager', 'staff')
  )
);

CREATE POLICY "Admins and managers can delete expenses"
ON public.expenses FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'manager')
  )
);
