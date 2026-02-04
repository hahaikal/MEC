"use server"

import { createClient } from "@/lib/supabase/server"
import { studentSchema, type StudentFormValues } from "@/lib/validators/student"
import { revalidatePath } from "next/cache"

export type ActionResponse<T = null> = {
  success: boolean
  message: string
  data?: T
  errors?: Record<string, string[]>
}

export async function getStudents(
  page = 1,
  limit = 10,
  query = ""
): Promise<ActionResponse<any>> {
  const supabase = await createClient()
  
  try {
    const from = (page - 1) * limit
    const to = from + limit - 1

    let dbQuery = supabase
      .from("students")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to)

    if (query) {
      dbQuery = dbQuery.or(`name.ilike.%${query}%,nis.ilike.%${query}%`)
    }

    const { data, error, count } = await dbQuery

    if (error) throw error

    return {
      success: true,
      message: "Data siswa berhasil diambil",
      data: {
        students: data,
        metadata: {
          total: count,
          page,
          limit,
          totalPages: count ? Math.ceil(count / limit) : 0
        }
      }
    }
  } catch (error: any) {
    console.error("Get Students Error:", error)
    return {
      success: false,
      message: "Gagal mengambil data siswa",
    }
  }
}

export async function createStudent(data: StudentFormValues): Promise<ActionResponse> {
  const supabase = await createClient()
  
  const validatedFields = studentSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validasi gagal",
      errors: validatedFields.error.flatten().fieldErrors
    }
  }

  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, message: "Unauthorized" }
    }

    const { error } = await supabase.from("students").insert({
        ...validatedFields.data,
        created_by: user.id,
        // created_at and updated_at are handled by DB defaults
    })

    if (error) throw error

    revalidatePath("/dashboard/students")
    return { success: true, message: "Siswa berhasil ditambahkan" }

  } catch (error: any) {
      console.error("Create Student Error:", error)
      return {
          success: false,
          message: error.message || "Gagal menambahkan siswa"
      }
  }
}

export async function updateStudent(id: string, data: StudentFormValues): Promise<ActionResponse> {
    const supabase = await createClient()
    const validatedFields = studentSchema.safeParse(data)

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Validasi gagal",
            errors: validatedFields.error.flatten().fieldErrors
        }
    }

    try {
        const { data: { user } } = await supabase.auth.getUser()
    
        if (!user) {
            return { success: false, message: "Unauthorized" }
        }

        const { error } = await supabase
        .from("students")
        .update({
            ...validatedFields.data,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)

        if (error) throw error

        revalidatePath("/dashboard/students")
        return { success: true, message: "Data siswa berhasil diperbarui." }
    } catch (error: any) {
        console.error("Update Student Error:", error)
        return {
        success: false,
        message: error.message || "Gagal memperbarui data siswa.",
        }
    }
}

export async function deleteStudent(id: string): Promise<ActionResponse> {
  const supabase = await createClient()

  try {
    const {
        data: { user },
      } = await supabase.auth.getUser()
  
    if (!user) {
        return { success: false, message: "Unauthorized" }
    }

    // Soft delete logic bisa diimplementasikan di sini jika tidak ingin hard delete
    const { error } = await supabase.from("students").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/dashboard/students")
    return { success: true, message: "Data siswa berhasil dihapus" }
  } catch (error: any) {
      console.error("Delete Student Error:", error)
      return {
          success: false,
          message: "Gagal menghapus siswa"
      }
  }
}