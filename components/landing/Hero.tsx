import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-28 pb-20 px-6">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          opacity: 0.4,
        }}
      />
      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-1.5 text-xs text-muted-foreground mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Free to use · No account required to start
        </div>

        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-foreground leading-[1.1] mb-6">
          Resumes that open
          <br />
          <span className="text-muted-foreground">doors.</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
          Build a polished, professional resume in minutes. Three clean templates,
          drag-and-drop sections, instant PDF export — and your own account to save everything.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/builder/new"
            className="inline-flex items-center justify-center h-11 px-7 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
          >
            Build your resume — free
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center h-11 px-7 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
          >
            Create an account
          </Link>
        </div>
      </div>
    </section>
  );
}
