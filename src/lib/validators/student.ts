import { z } from 'zod'

export const studentSchema = z.object({
  name: z.string().min(1, 'Nama lengkap wajib diisi'),
  nis: z.string().optional(),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  phone_number: z.string().optional(),
  
  // Data Akademik
  class_name: z.string().optional(), // Menggantikan class_id
  class_year: z.string().optional(),
  status: z.enum(['ACTIVE', 'GRADUATED', 'DROPOUT', 'ON_LEAVE']).default('ACTIVE'),
  enrollment_date: z.string().optional(), // Untuk tanggal masuk
  
  // Data Orang Tua
  parent_name: z.string().optional(),
  parent_phone: z.string().optional(),
  
  // Data Keuangan & Alamat
  base_fee: z.coerce.number().min(0, 'Biaya SPP tidak boleh negatif'),
  billing_cycle_date: z.coerce.number().min(1).max(28).default(10),
  address: z.string().optional(),
})

export type StudentFormValues = z.infer<typeof studentSchema>