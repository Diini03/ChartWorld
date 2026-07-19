import { supabase } from "@/integrations/supabase/client";

export type Note = {
  id: string;
  dataset_id: string;
  author_id: string;
  body: string;
  created_at: string;
};

export type ProfileLite = { id: string; display_name: string | null; avatar_url: string | null };

export async function listNotes(dataset_id: string) {
  const { data, error } = await supabase
    .from("dataset_notes")
    .select("*")
    .eq("dataset_id", dataset_id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Note[];
}

export async function createNote(dataset_id: string, body: string) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Not signed in");
  const { data, error } = await supabase
    .from("dataset_notes")
    .insert({ dataset_id, body, author_id: u.user.id })
    .select()
    .single();
  if (error) throw error;
  return data as Note;
}

export async function deleteNote(id: string) {
  const { error } = await supabase.from("dataset_notes").delete().eq("id", id);
  if (error) throw error;
}

export async function listProfiles(search?: string): Promise<ProfileLite[]> {
  let q = supabase.from("profiles").select("id, display_name, avatar_url").limit(20);
  if (search) q = q.ilike("display_name", `%${search}%`);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as ProfileLite[];
}

export async function getProfilesByIds(ids: string[]): Promise<Record<string, ProfileLite>> {
  if (!ids.length) return {};
  const { data, error } = await supabase.from("profiles").select("id, display_name, avatar_url").in("id", ids);
  if (error) throw error;
  const map: Record<string, ProfileLite> = {};
  for (const p of data ?? []) map[(p as ProfileLite).id] = p as ProfileLite;
  return map;
}
