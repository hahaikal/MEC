import { z } from "zod";

export const studentSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  nis: z.string().min(1, "NIS wajib diisi"),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  phone_number: z.string().optional().or(z.literal("")),
  
  parent_name: z.string().min(1, "Nama orang tua wajib diisi"),
  parent_phone: z.string().min(1, "No HP orang tua wajib diisi"),
  
  class_id: z.string().optional().nullable(), // UUID
  class_year: z.string().optional(),
  status: z.enum(["ACTIVE", "GRADUATED", "DROPOUT", "ON_LEAVE"]).default("ACTIVE"),
  enrollment_date: z.date().optional(),
  
  base_fee: z.coerce.number().min(0, "Biaya dasar tidak boleh negatif"),
  billing_cycle_date: z.coerce.number().min(1).max(28).default(10),
  
  date_of_birth: z.date().optional(),
  address: z.string().optional().or(z.literal("")),
});

export type StudentFormValues = z.infer<typeof studentSchema>;