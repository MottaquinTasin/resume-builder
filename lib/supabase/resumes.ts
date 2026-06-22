import type { WorkspaceData } from '@/lib/types';
import { createClient } from './client';

export interface ResumeRecord {
  id: string;
  title: string;
  data: WorkspaceData;
  created_at: string;
  updated_at: string;
}

export async function listResumes(): Promise<ResumeRecord[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('resumes')
    .select('id, title, data, created_at, updated_at')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data as ResumeRecord[];
}

export async function getResume(id: string): Promise<ResumeRecord | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('resumes')
    .select('id, title, data, created_at, updated_at')
    .eq('id', id)
    .single();
  if (error) return null;
  return data as ResumeRecord;
}

export async function createResume(title: string, data: WorkspaceData): Promise<ResumeRecord> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: record, error } = await supabase
    .from('resumes')
    .insert({ title, data, user_id: user!.id })
    .select()
    .single();
  if (error) throw error;
  return record as ResumeRecord;
}

export async function updateResume(id: string, patch: { title?: string; data?: WorkspaceData }): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('resumes').update(patch).eq('id', id);
  if (error) throw error;
}

export async function deleteResume(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('resumes').delete().eq('id', id);
  if (error) throw error;
}
