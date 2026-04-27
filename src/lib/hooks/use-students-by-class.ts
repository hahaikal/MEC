import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'

type Student = Database['public']['Tables']['students']['Row']

export function useStudentsByClass(classId: string | null) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['students', 'class', classId],
    queryFn: async () => {
      if (!classId) return []

      const { data, error } = await supabase
        .from('class_enrollments')
        .select('students(*)')
        .eq('class_id', classId)

      if (error) throw error

      // Filter active students manually or add it to the query
      const students = data
        .map((d: any) => d.students)
        .filter((s: any) => s && (s.status === 'active' || s.status === 'ACTIVE'))

      return students.sort((a: any, b: any) => a.name.localeCompare(b.name)) as Student[]
    },
    enabled: !!classId,
  })
}

export function useClassList() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('name')

      if (error) throw error

      return data as any[]
    },
  })
}
