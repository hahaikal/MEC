import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { type Database } from '@/types/supabase'

type Student = Database['public']['Tables']['students']['Row']

export function useStudents() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      // Need to join with class_enrollments and classes to get the class_name
      const { data, error } = await supabase
        .from('students')
        .select('*, class_enrollments(classes(id, name))')
        .order('created_at', { ascending: false })

      if (error) throw error

      return data.map((d: any) => {
        let class_name = null
        let class_id = null
        if (d.class_enrollments && d.class_enrollments.length > 0) {
            const enrollment = d.class_enrollments[0]
            if (enrollment.classes) {
               class_name = enrollment.classes.name
               class_id = enrollment.classes.id
            }
        }
        return {
           ...d,
           class_name,
           class_id
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
        .select('*, class_enrollments(classes(id, name))')
        .eq('id', id)
        .single()

      if (error) throw error

      let class_name = null
      let class_id = null
      if (data.class_enrollments && data.class_enrollments.length > 0) {
          const enrollment = (data.class_enrollments as any)[0]
          if (enrollment.classes) {
             class_name = enrollment.classes.name
             class_id = enrollment.classes.id
          }
      }

      return {
         ...data,
         class_name,
         class_id
      } as any
    },
    enabled: !!id,
  })
}
