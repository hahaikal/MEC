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
    queryKey: ['class_list_simple'],
    queryFn: async () => {
      const { data: authData } = await supabase.auth.getUser()
      const userId = authData.user?.id
      if (!userId) return []

      const { data: userRow } = await supabase.from('users').select('roles').eq('id', userId).single()
      const roles = userRow?.roles || []
      
      const isTeacher = roles.some((r: string) => r.toLowerCase() === 'teacher')
      const isAdmin = roles.some((r: string) => ['admin', 'manager', 'director', 'staff'].includes(r.toLowerCase()))

      if (isTeacher && !isAdmin) {
        const { data, error } = await supabase
          .from('classes')
          .select('*, class_teachers!inner(teacher_id)')
          .eq('class_teachers.teacher_id', userId)
          .order('name')
          
        if (error) throw error
        return data as any[]
      } else {
        const { data, error } = await supabase
          .from('classes')
          .select('*')
          .order('name')

        if (error) throw error
        return data as any[]
      }
    },
  })
}
