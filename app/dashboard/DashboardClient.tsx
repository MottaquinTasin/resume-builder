'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Pencil, Trash2, Clock } from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteResume } from '@/lib/supabase/resumes';
import { toast } from 'sonner';

interface ResumeRow {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export default function DashboardClient({ initialResumes }: { initialResumes: ResumeRow[] }) {
  const router = useRouter();
  const [resumes, setResumes] = useState(initialResumes);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteResume(id);
      setResumes((prev) => prev.filter((r) => r.id !== id));
      toast.success('Resume deleted.');
    } catch {
      toast.error('Failed to delete resume.');
    }
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {resumes.map((resume) => (
        <div
          key={resume.id}
          className="group rounded-xl border border-border bg-background p-5 hover:border-foreground/20 transition-colors"
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <h2 className="font-medium text-sm truncate">{resume.title}</h2>
            <DropdownMenu>
              <DropdownMenuTrigger className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity rounded p-1 hover:bg-muted">
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem onClick={() => router.push(`/builder/${resume.id}`)}>
                  <Pencil className="h-3.5 w-3.5 mr-2" />Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDelete(resume.id, resume.title)}
                  variant="destructive"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2" />Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Updated {fmt(resume.updated_at)}
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <button
              onClick={() => router.push(`/builder/${resume.id}`)}
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Open editor →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
