import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'

type Student = Database['public']['Tables']['students']['Row']

export function useStudentsByClass(className: string | null) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['students', 'class', className],
    queryFn: async () => {
      if (!className) return []

      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('class_name', className)
        .eq('status', 'ACTIVE')
        .order('name')

      if (error) throw error

      return data as Student[]
    },
    enabled: !!className,
  })
}

export function useClassList() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['students', 'classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('class_name')
        .not('class_name', 'is', null)

      if (error) throw error

      // Get unique class names
      const uniqueClasses = Array.from(new Set(data.map(item => item.class_name).filter(Boolean)))
      return uniqueClasses.sort() as string[]
    },
  })
}
