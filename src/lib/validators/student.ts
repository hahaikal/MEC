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
  phone_number: z.string().optional(), // No HP Siswa
  
  // Data Akademik
  school_origin: z.string().optional(),
  class_id: z.string().optional(),
  enrollment_date: z.string().optional(), // Tanggal masuk/daftar
  joined_since_class: z.string().optional(), // Masuk sejak kelas

  // Data Orang Tua
  father_name: z.string().optional(),
  mother_name: z.string().optional(),
  father_occupation: z.string().optional(),
  mother_occupation: z.string().optional(),
  parent_phone: z.string().optional(),
  
  // Data Keuangan
  base_fee: z.coerce.number().min(0, 'Biaya SPP tidak boleh negatif').default(375000),

  // Deprecated / Hidden fields kept for type safety if needed but removed from UI
  // nis: z.string().optional(),
  // class_year: z.string().optional(),
  // status: z.enum(['ACTIVE', 'GRADUATED', 'DROPOUT', 'ON_LEAVE']).default('ACTIVE'),
  // billing_cycle_date: z.coerce.number().default(10),
})

export type StudentFormValues = z.infer<typeof studentSchema>
