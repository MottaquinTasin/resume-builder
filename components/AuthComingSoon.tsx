import Link from 'next/link';
import { FileText, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AuthComingSoon() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-muted/20">
      <div className="w-full max-w-sm text-center">
        <Link href="/" className="flex items-center justify-center gap-2 font-semibold text-sm mb-8">
          <FileText className="h-4 w-4" />
          Resume Builder
        </Link>
        <div className="rounded-xl border border-border bg-background p-8 shadow-sm">
          <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Clock className="h-6 w-6 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-semibold mb-2">Accounts are coming soon</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Sign-in and cloud save aren&apos;t enabled yet. You can still build and download
            your resume right now — your work is saved in this browser.
          </p>
          <Link href="/builder/new">
            <Button className="w-full">Start building — no account needed</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
