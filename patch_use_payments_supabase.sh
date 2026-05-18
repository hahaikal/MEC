sed -i '/export function useStudentPaymentsYearly(studentId: string, year: number) {/a \  const supabase = createClient();' src/lib/hooks/use-payments.ts
