import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createStudent, updateStudent, deleteStudent } from '@/actions/students'
import { useToast } from '@/components/ui/use-toast'
import { StudentFormValues } from '@/lib/validators/student'

export function useCreateStudent() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (data: StudentFormValues) => {
      const result = await createStudent(data)
      if (result.error) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      // INI KUNCINYA: Invalidate query 'students' agar data diambil ulang otomatis
      queryClient.invalidateQueries({ queryKey: ['students'] })
      
      toast({
        title: 'Berhasil',
        description: 'Data siswa berhasil ditambahkan.',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Gagal',
        description: error.message,
      })
    },
  })
}

export function useUpdateStudent() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: StudentFormValues }) => {
      const result = await updateStudent(id, data)
      if (result.error) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      toast({
        title: 'Berhasil',
        description: 'Data siswa berhasil diperbarui.',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Gagal',
        description: error.message,
      })
    },
  })
}

export function useDeleteStudent() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteStudent(id)
      if (result.error) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      toast({
        title: 'Berhasil',
        description: 'Data siswa berhasil dihapus.',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Gagal',
        description: error.message,
      })
    },
  })
}