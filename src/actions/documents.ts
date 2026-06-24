"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createDocumentRecord(data: {
  class_id: string;
  title: string;
  document_url: string;
  file_size_mb: number;
  document_type: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase.from("class_documents").insert({
    ...data,
    created_by: user.id,
  });

  if (error) {
    console.error("Error creating document record:", error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/dashboard/teacher-workspace/${data.class_id}`);
  return { success: true };
}

export async function deleteDocumentRecord(id: string, class_id: string, document_url: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Delete from storage first
  const fileName = document_url.split('/').pop();
  if (fileName) {
    await supabase.storage.from("parent_hub_magazines").remove([fileName]);
  }

  // Delete from database
  const { error } = await supabase.from("class_documents").delete().eq("id", id);

  if (error) {
    console.error("Error deleting document record:", error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/dashboard/teacher-workspace/${class_id}`);
  return { success: true };
}
