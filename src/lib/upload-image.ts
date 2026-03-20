import { supabase } from "./supabase";

export async function uploadImage(
  file: File,
  folder: "products" | "banners" | "categories"
): Promise<string | null> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

  const { error } = await supabase.storage
    .from("alumfresh-images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error);
    return null;
  }

  const { data } = supabase.storage
    .from("alumfresh-images")
    .getPublicUrl(fileName);

  return data.publicUrl;
}
