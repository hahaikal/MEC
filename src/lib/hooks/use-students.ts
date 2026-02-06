import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { type Database } from '@/types/supabase'

// Definisikan tipe data sesuai tabel
type Student = Database['public']['Tables']['students']['Row']

export function useStudents() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['students'], // Key unik untuk cache data siswa
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Student[]
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
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Student
    },
    enabled: !!id,
  })
}