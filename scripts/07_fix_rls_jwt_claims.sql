-- Drop the old function if needed or just replace it
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  -- Retrieve the role directly from the JWT token session (user_metadata),
  -- completely decoupling RLS from querying the public.users table.
  SELECT NULLIF(current_setting('request.jwt.claims', true)::jsonb -> 'user_metadata' ->> 'role', '');
$$;
