import { z } from 'zod'

export const studentSchema = z.object({
  // Data Pribadi
  name: z.string().min(1, 'Nama lengkap wajib diisi'),
  place_of_birth: z.string().optional(),
  date_of_birth: z.string().optional(), // ISO date string
  gender: z.enum(['MALE', 'FEMALE']).optional(),
  religion: z.string().optional(),

  // Kontak & Alamat
  address: z.string().optional(),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  phone_number: z.string().optional(), // No HP Siswa
  
  // Data Akademik
  school_origin: z.string().optional(),
  class_name: z.string().optional(),
  enrollment_date: z.string().optional(), // Tanggal masuk/daftar

  // Data Orang Tua
  parent_name: z.string().optional(),
  parent_occupation: z.string().optional(),
  parent_phone: z.string().optional(),
  
  // Data Keuangan
  base_fee: z.coerce.number().min(0, 'Biaya SPP tidak boleh negatif').default(0),

  // Deprecated / Hidden fields kept for type safety if needed but removed from UI
  // nis: z.string().optional(),
  // class_year: z.string().optional(),
  // status: z.enum(['ACTIVE', 'GRADUATED', 'DROPOUT', 'ON_LEAVE']).default('ACTIVE'),
  // billing_cycle_date: z.coerce.number().default(10),
})

export type StudentFormValues = z.infer<typeof studentSchema>
