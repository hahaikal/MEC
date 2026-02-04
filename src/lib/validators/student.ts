import { z } from "zod"

export const studentStatusEnum = z.enum(["ACTIVE", "GRADUATED", "DROPOUT", "ON_LEAVE"])

export const studentSchema = z.object({
  id: z.string().optional(),
  nis: z
    .string()
    .min(3, { message: "NIS wajib diisi minimal 3 karakter" })
    .max(20, { message: "NIS maksimal 20 karakter" }),
  name: z.string().min(2, { message: "Nama wajib diisi minimal 2 karakter" }),
  email: z.string().email({ message: "Format email tidak valid" }).optional().or(z.literal("")),
  phone_number: z
    .string()
    .min(10, { message: "Nomor HP minimal 10 digit" })
    .optional()
    .or(z.literal("")),
  parent_name: z.string().optional().or(z.literal("")),
  parent_phone: z.string().optional().or(z.literal("")),
  date_of_birth: z.date().optional().nullable(),
  address: z.string().optional().or(z.literal("")),
  status: studentStatusEnum.default("ACTIVE"),
  enrollment_date: z.date().default(() => new Date()),
  base_fee: z.coerce
    .number()
    .min(0, { message: "Biaya SPP tidak boleh negatif" })
    .default(0),
  billing_cycle_date: z.coerce
    .number()
    .min(1, { message: "Tanggal tagihan minimal 1" })
    .max(28, { message: "Tanggal tagihan maksimal 28" })
    .default(10),
  class_id: z.string().uuid().optional().nullable(),
})

export type StudentFormValues = z.infer<typeof studentSchema>