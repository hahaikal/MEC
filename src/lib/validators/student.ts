import { z } from "zod"

export const studentSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email salah").optional().or(z.literal("")),
  phone_number: z.string().min(10, "Nomor HP tidak valid").optional().or(z.literal("")),
  base_fee: z.coerce.number().min(0, "Biaya SPP tidak boleh negatif"),
  class_year: z.string().optional(), 
  status: z.enum(["active", "inactive", "graduated"]).default("active"),
  address: z.string().optional(),
  date_of_birth: z.string().optional(),
})

export type StudentFormValues = z.infer<typeof studentSchema>