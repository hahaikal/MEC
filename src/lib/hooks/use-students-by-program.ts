import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'

type Student = Database['public']['Tables']['students']['Row']

export function useStudentsByProgram(programId: string | null) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['students', 'program', programId],
    queryFn: async () => {
      if (!programId) return []

      const { data, error } = await supabase
        .from('student_programs')
        .select(`
          students!inner(*)
        `)
        .eq('program_id', programId)
        .eq('status', 'active')
        .order('name', { foreignTable: 'students', ascending: true })

      if (error) throw error

      // data is an array of { students: Student }
      return data.map((item: any) => item.students) as Student[]
    },
    enabled: !!programId,
  })
}
