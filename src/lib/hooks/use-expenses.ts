import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export type ExpenseCategory = 'operational' | 'salary' | 'asset' | 'maintenance' | 'marketing' | 'other'

export interface Expense {
  id: string
  description: string
  amount: number
  category: ExpenseCategory
  date: string
  created_by?: string
  created_at: string
}

export type NewExpense = Omit<Expense, 'id' | 'created_at' | 'created_by'>

export function useExpenses(filters?: { startDate?: string; endDate?: string; category?: string }) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['expenses', filters],
    queryFn: async () => {
      let query = supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false })

      if (filters?.startDate) {
        query = query.gte('date', filters.startDate)
      }
      if (filters?.endDate) {
        query = query.lte('date', filters.endDate)
      }
      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching expenses:', error)
        throw error
      }

      return data as Expense[]
    },
  })
}

export function useCreateExpense() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (newExpense: any) => {
      const { data: { user } } = await supabase.auth.getUser()

      const { data, error } = await supabase
        .from('expenses')
        .insert({
          ...newExpense,
          created_by: user?.id
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      toast.success('Pengeluaran berhasil dicatat')
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
    },
    onError: (error) => {
      toast.error(`Gagal mencatat pengeluaran: ${error.message}`)
    },
  })
}

export function useDeleteExpense() {
    const queryClient = useQueryClient()
    const supabase = createClient()
  
    return useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase
          .from('expenses')
          .delete()
          .eq('id', id)
  
        if (error) throw error
      },
      onSuccess: () => {
        toast.success('Pengeluaran berhasil dihapus')
        queryClient.invalidateQueries({ queryKey: ['expenses'] })
      },
      onError: (error) => {
        toast.error(`Gagal menghapus pengeluaran: ${error.message}`)
      },
    })
  }
