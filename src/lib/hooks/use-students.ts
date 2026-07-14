import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { type Database } from '@/types/supabase'

type Student = Database['public']['Tables']['students']['Row']

export function useStudents() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      // Join with class_enrollments, classes, and payments
      const { data, error } = await supabase
        .from('students')
        .select('*, class_enrollments(class_id, base_fee, classes(id, name, schedule_days, schedule_time, programs(name))), payments(amount, year, month, category, payment_status, payment_date)')
        .order('created_at', { ascending: false })

      if (error) throw error

      const currentYear = new Date().getFullYear();

      return data.map((d: any) => {
        const enrollments = d.class_enrollments?.map((enr: any) => ({
          class_id: enr.class_id,
          class_name: enr.classes?.name,
          program_name: enr.classes?.programs?.name,
          base_fee: enr.base_fee,
          schedule_days: enr.classes?.schedule_days,
          schedule_time: enr.classes?.schedule_time
        })) || []
        
        const programs = Array.from(new Set(enrollments.map((e: any) => e.program_name).filter(Boolean)))
        
        const studentPayments = d.payments?.filter((p: any) => p.year === currentYear || new Date(p.payment_date).getFullYear() === currentYear) || [];
        const registration = studentPayments.find((p: any) => p.category === 'registration');
        const book_fee = studentPayments.find((p: any) => p.category === 'books');

        const getMonthStatus = (m: number) => {
           const p = studentPayments.find((p: any) => p.category === 'tuition' && (p.month === m || new Date(p.payment_date).getMonth() === m));
           return p ? (p.payment_status === 'completed' ? 1 : 0) : -1;
        };

        return {
           ...d,
           enrollments,
           // for backward compatibility or simple display
           class_name: enrollments.map((e: any) => e.class_name).join(', '),
           programs,
           registration_sort: registration?.payment_status === 'completed' ? 1 : (registration?.payment_status === 'pending' ? 0 : -1),
           book_fee_sort: book_fee?.payment_status === 'completed' ? 1 : (book_fee?.payment_status === 'pending' ? 0 : -1),
           januari_sort: getMonthStatus(0),
           februari_sort: getMonthStatus(1),
           maret_sort: getMonthStatus(2),
           april_sort: getMonthStatus(3),
           mei_sort: getMonthStatus(4),
           juni_sort: getMonthStatus(5),
           juli_sort: getMonthStatus(6),
           agustus_sort: getMonthStatus(7),
           september_sort: getMonthStatus(8),
           oktober_sort: getMonthStatus(9),
           november_sort: getMonthStatus(10),
           desember_sort: getMonthStatus(11),
        }
      })
    },
  })
}

export function useStudent(id: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['students', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*, class_enrollments(class_id, base_fee, classes(id, name))')
        .eq('id', id)
        .single()

      if (error) throw error

      const enrollments = data.class_enrollments?.map((enr: any) => ({
        class_id: enr.class_id,
        class_name: enr.classes?.name,
        base_fee: enr.base_fee
      })) || []

      return {
         ...data,
         enrollments,
         class_name: enrollments.map((e: any) => e.class_name).join(', ')
      } as any
    },
    enabled: !!id,
  })
}
