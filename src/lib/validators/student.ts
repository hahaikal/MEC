import { z } from "zod";

export const studentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone_number: z.string().optional(),
  parent_name: z.string().optional(),
  parent_phone: z.string().optional(),
  nis: z.string().optional(),
  date_of_birth: z.date().optional(),
  address: z.string().optional(),
  class_id: z.string().uuid("Please select a class").optional(),
  program_id: z.string().uuid("Please select a program"), // Mandatory for payments
  base_fee: z.coerce.number().min(0, "Fee must be positive"),
  billing_cycle_date: z.coerce.number().min(1).max(28).default(10),
});

export type StudentFormValues = z.infer<typeof studentSchema>;

export type Student = StudentFormValues & {
  id: string;
  status: string;
  enrollment_date: string;
  created_at: string;
  class_year?: string;
};