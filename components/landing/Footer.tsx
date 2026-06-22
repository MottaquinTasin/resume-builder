import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <FileText className="h-4 w-4" />
          Resume Builder
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/builder/new" className="hover:text-foreground transition-colors">Builder</Link>
          <Link href="/login" className="hover:text-foreground transition-colors">Login</Link>
          <Link href="/signup" className="hover:text-foreground transition-colors">Sign up</Link>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Resume Builder. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
