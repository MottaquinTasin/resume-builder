import { createClient } from '@/lib/supabase/server';
import Builder from '@/components/Builder';
import Navbar from '@/components/Navbar';
import { defaultResumeData } from '@/lib/defaultData';
import type { ResumeData } from '@/lib/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BuilderPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let initialData: ResumeData = defaultResumeData;
  let resumeId: string | null = null;
  let resumeTitle = 'Untitled Resume';

  if (id !== 'new' && user) {
    const { data: resume } = await supabase
      .from('resumes')
      .select('id, title, data')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (resume) {
      initialData = resume.data as ResumeData;
      resumeId = resume.id;
      resumeTitle = resume.title;
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar user={user} />
      <div className="flex-1 pt-14">
        <Builder
          initialData={initialData}
          resumeId={resumeId}
          resumeTitle={resumeTitle}
          user={user}
        />
      </div>
    </div>
  );
}
