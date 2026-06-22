import Link from 'next/link';

export default function CTA() {
  return (
    <section className="border-t border-border bg-muted/30 py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-semibold tracking-tight mb-4">
          Your next job starts with a great resume.
        </h2>
        <p className="text-muted-foreground mb-8">
          Start building for free — no sign-up required. Create an account when you&apos;re ready to save.
        </p>
        <Link
          href="/builder/new"
          className="inline-flex items-center justify-center h-11 px-8 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
        >
          Start building now
        </Link>
      </div>
    </section>
  );
}
