"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createActivityRecord(data: {
  class_id: string;
  title: string;
  description?: string;
  image_url: string;
  created_at?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const { error } = await supabase.from("class_activities").insert({
    ...data,
    created_by: user.id,
  });

  if (error) {
    console.error("Error creating activity record:", error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/dashboard/teacher-workspace/${data.class_id}`);
  revalidatePath(`/parent-hub/dashboard/class/${data.class_id}`);
  return { success: true };
}

export async function deleteActivityRecord(id: string, class_id: string, image_url: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Delete from storage first
  const fileName = image_url.split('/').pop();
  if (fileName) {
    await supabase.storage.from("parent_hub_gallery").remove([`activities/${fileName}`]);
  }

  // Delete from database
  const { error } = await supabase.from("class_activities").delete().eq("id", id);

  if (error) {
    console.error("Error deleting activity record:", error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/dashboard/teacher-workspace/${class_id}`);
  revalidatePath(`/parent-hub/dashboard/class/${class_id}`);
  return { success: true };
}

export async function updateActivityRecord(id: string, data: {
  class_id: string;
  title: string;
  description?: string;
  created_at?: string;
  image_url?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Update data object
  const updateData: any = {
    title: data.title,
    description: data.description,
  };
  
  if (data.created_at) {
    updateData.created_at = data.created_at;
  }
  
  if (data.image_url) {
    updateData.image_url = data.image_url;
  }

  const { error } = await supabase
    .from("class_activities")
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("Error updating activity record:", error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/dashboard/teacher-workspace/${data.class_id}`);
  revalidatePath(`/parent-hub/dashboard/class/${data.class_id}`);
  return { success: true };
}
