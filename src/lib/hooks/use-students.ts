import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { type Database } from '@/types/supabase'

type Student = Database['public']['Tables']['students']['Row']

export function useStudents() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      // Join with class_enrollments and classes
      const { data, error } = await supabase
        .from('students')
        .select('*, class_enrollments(class_id, base_fee, classes(id, name, programs(name)))')
        .order('created_at', { ascending: false })

      if (error) throw error

      return data.map((d: any) => {
        const enrollments = d.class_enrollments?.map((enr: any) => ({
          class_id: enr.class_id,
          class_name: enr.classes?.name,
          program_name: enr.classes?.programs?.name,
          base_fee: enr.base_fee
        })) || []
        
        const programs = Array.from(new Set(enrollments.map((e: any) => e.program_name).filter(Boolean)))
        
        return {
           ...d,
           enrollments,
           // for backward compatibility or simple display
           class_name: enrollments.map((e: any) => e.class_name).join(', '),
           programs
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
