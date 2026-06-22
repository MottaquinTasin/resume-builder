import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, FileText, Clock } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import Navbar from '@/components/Navbar';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: resumes } = await supabase
    .from('resumes')
    .select('id, title, created_at, updated_at')
    .order('updated_at', { ascending: false });

  return (
    <div className="min-h-screen bg-muted/20">
      <Navbar user={user} />
      <main className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold">My Resumes</h1>
            <p className="text-sm text-muted-foreground mt-1">All your resumes are private and saved to your account.</p>
          </div>
          <Link
            href="/builder/new"
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New resume
          </Link>
        </div>

        {resumes && resumes.length > 0 ? (
          <DashboardClient initialResumes={resumes} />
        ) : (
          <div className="rounded-xl border border-border border-dashed bg-background p-16 text-center">
            <FileText className="h-10 w-10 text-muted-foreground/50 mx-auto mb-4" />
            <h2 className="font-medium mb-1">No resumes yet</h2>
            <p className="text-sm text-muted-foreground mb-6">Create your first resume and it will appear here.</p>
            <Link
              href="/builder/new"
              className="inline-flex items-center gap-2 h-9 px-5 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Build your first resume
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
