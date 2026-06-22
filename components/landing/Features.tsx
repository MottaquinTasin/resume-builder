import { FileDown, LayoutTemplate, GripVertical, Lock } from 'lucide-react';

const FEATURES = [
  {
    icon: LayoutTemplate,
    title: '3 Professional Templates',
    description: 'Classic, Modern, and Minimal — each designed to pass ATS systems and impress hiring managers.',
  },
  {
    icon: GripVertical,
    title: 'Drag & Drop Sections',
    description: 'Reorder sections to match any job. Show what matters most at the top, hide what doesn\'t.',
  },
  {
    icon: FileDown,
    title: 'One-Click PDF Export',
    description: 'Download a pixel-perfect PDF instantly. No watermarks, no email required.',
  },
  {
    icon: Lock,
    title: 'Private Cloud Saves',
    description: 'Create an account and your resumes are saved privately to your profile. Access from any device.',
  },
];

export default function Features() {
  return (
    <section className="border-t border-border bg-muted/30 py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-semibold tracking-tight mb-3">Everything you need. Nothing you don&apos;t.</h2>
          <p className="text-muted-foreground">Built for job seekers who want a great resume fast.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-background p-6">
              <div className="mb-4 inline-flex items-center justify-center h-10 w-10 rounded-lg bg-muted">
                <f.icon className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="font-semibold mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
