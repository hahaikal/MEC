"use server";

import { createClient } from "@/lib/supabase/server";
import { studentSchema, StudentFormValues } from "@/lib/validators/student";
import { revalidatePath } from "next/cache";

export async function getStudents() {
  const supabase = await createClient();
  
  // Join dengan table classes untuk mendapatkan nama kelas (jika ada)
  const { data, error } = await supabase
    .from("students")
    .select(`
      *,
      classes (
        name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching students:", error);
    throw new Error("Gagal mengambil data siswa");
  }

  return data;
}

export async function createStudent(data: StudentFormValues) {
  const supabase = await createClient();
  const validData = studentSchema.parse(data);

  // Ambil user yang sedang login untuk field created_by
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // --- LOGIC SEDERHANA ---
  // Kita asumsikan Trigger SQL sudah bekerja.
  // Jika masih gagal FK constraint, berarti SQL trigger belum dijalankan.
  
  const { error } = await supabase.from("students").insert({
    ...validData,
    created_by: user.id,
    date_of_birth: validData.date_of_birth ? validData.date_of_birth.toISOString() : null,
    enrollment_date: validData.enrollment_date ? validData.enrollment_date.toISOString() : new Date().toISOString(),
  });

  if (error) {
    console.error("Error creating student:", error);
    
    // Pesan error yang lebih membantu jika lupa menjalankan SQL
    if (error.code === '23503') { // Foreign Key Violation
        throw new Error("Akun pengguna anda belum terdaftar di sistem. Mohon jalankan script '05-fix-user-sync.sql' di Supabase.");
    }

    throw new Error(error.message || "Gagal membuat data siswa");
  }

  revalidatePath("/dashboard/students");
  return { success: true };
}

export async function updateStudent(id: string, data: StudentFormValues) {
  const supabase = await createClient();
  const validData = studentSchema.parse(data);

  const { error } = await supabase
    .from("students")
    .update({
      ...validData,
      updated_at: new Date().toISOString(),
      date_of_birth: validData.date_of_birth ? validData.date_of_birth.toISOString() : null,
      enrollment_date: validData.enrollment_date ? validData.enrollment_date.toISOString() : null,
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating student:", error);
    throw new Error(error.message || "Gagal mengupdate data siswa");
  }

  revalidatePath("/dashboard/students");
  return { success: true };
}

export async function deleteStudent(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("students").delete().eq("id", id);

  if (error) {
    console.error("Error deleting student:", error);
    throw new Error("Gagal menghapus data siswa");
  }

  revalidatePath("/dashboard/students");
  return { success: true };
}