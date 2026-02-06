"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getStudents() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("students")
    .select(`
      *,
      classes ( name ),
      payments (
        amount,
        payment_date,
        category,
        payment_status
      )
    `)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching students:", error);
    return [];
  }

  return data;
}

export async function createStudent(data: any) {
  const supabase = await createClient();
  
  // Pastikan field yang wajib diisi ada
  const studentData = {
    ...data,
    created_by: (await supabase.auth.getUser()).data.user?.id,
  };

  const { error } = await supabase.from("students").insert(studentData);

  if (error) {
    console.error("Error creating student:", error);
    throw new Error("Failed to create student");
  }

  revalidatePath("/dashboard/students");
  return { success: true };
}

export async function updateStudent(id: string, data: any) {
  const supabase = await createClient();

  // Bersihkan data undefined/null yang tidak perlu diupdate
  const updateData = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v !== undefined && v !== null && v !== "")
  );

  const { error } = await supabase
    .from("students")
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("Error updating student:", error);
    throw new Error("Failed to update student");
  }

  revalidatePath("/dashboard/students");
  return { success: true };
}

export async function deleteStudent(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("students").delete().eq("id", id);

  if (error) {
    console.error("Error deleting student:", error);
    throw new Error("Failed to delete student");
  }

  revalidatePath("/dashboard/students");
  return { success: true };
}