const TEMPLATES = [
  {
    name: 'Classic',
    description: 'Timeless single-column. Works for any industry.',
    accent: '#2563EB',
    preview: 'classic',
  },
  {
    name: 'Modern',
    description: 'Two-column with a bold sidebar. Great for tech roles.',
    accent: '#7C3AED',
    preview: 'modern',
  },
  {
    name: 'Minimal',
    description: 'Whitespace-first typography. Stands out by staying quiet.',
    accent: '#059669',
    preview: 'minimal',
  },
];

function ClassicPreview({ accent }: { accent: string }) {
  return (
    <div className="w-full h-full p-4 font-serif text-[6px] leading-tight">
      <div className="text-center mb-3">
        <div className="text-[10px] font-bold mb-1" style={{ color: accent }}>Alex Johnson</div>
        <div className="text-gray-500 text-[5px]">alex@email.com · San Francisco, CA · linkedin.com/in/alex</div>
        <div className="h-px mt-1.5" style={{ backgroundColor: accent }} />
      </div>
      <div className="mb-2">
        <div className="text-[6px] font-bold uppercase tracking-wider mb-0.5" style={{ color: accent }}>Experience</div>
        <div className="h-px mb-1.5" style={{ backgroundColor: accent, opacity: 0.3 }} />
        <div className="font-bold">Senior Engineer · Acme Corp</div>
        <div className="text-gray-400">Jan 2022 – Present</div>
        <div className="text-gray-600 mt-0.5">· Led platform migration, cutting deploy time 60%</div>
        <div className="text-gray-600">· Built dashboard for 10k daily users</div>
      </div>
      <div className="mb-2">
        <div className="text-[6px] font-bold uppercase tracking-wider mb-0.5" style={{ color: accent }}>Education</div>
        <div className="h-px mb-1.5" style={{ backgroundColor: accent, opacity: 0.3 }} />
        <div className="font-bold">UC Berkeley · B.S. Computer Science</div>
        <div className="text-gray-400">2015 – 2019 · GPA 3.8</div>
      </div>
      <div>
        <div className="text-[6px] font-bold uppercase tracking-wider mb-0.5" style={{ color: accent }}>Skills</div>
        <div className="h-px mb-1.5" style={{ backgroundColor: accent, opacity: 0.3 }} />
        <div><span className="font-bold">Languages:</span> TypeScript, Python, Go</div>
        <div><span className="font-bold">Frameworks:</span> React, Next.js, Node.js</div>
      </div>
    </div>
  );
}

function ModernPreview({ accent }: { accent: string }) {
  return (
    <div className="w-full h-full flex text-[6px] leading-tight">
      <div className="w-24 h-full p-3 text-white text-[5px]" style={{ backgroundColor: accent }}>
        <div className="text-[9px] font-bold text-white mb-2">Alex Johnson</div>
        <div className="opacity-80 mb-3">
          <div>alex@email.com</div>
          <div>San Francisco</div>
          <div>linkedin.com/in/alex</div>
        </div>
        <div className="text-[5px] font-bold uppercase tracking-wider border-b border-white/30 pb-0.5 mb-1.5 opacity-90">Skills</div>
        <div className="opacity-80 mb-1 font-semibold">Languages</div>
        <div className="opacity-70 mb-1.5">TypeScript, Python, Go</div>
        <div className="opacity-80 mb-1 font-semibold">Frameworks</div>
        <div className="opacity-70">React, Next.js, Node.js</div>
      </div>
      <div className="flex-1 p-3">
        <div className="mb-2">
          <div className="text-[6px] font-bold uppercase tracking-wider mb-0.5" style={{ color: accent }}>Experience</div>
          <div className="h-px mb-1" style={{ backgroundColor: accent, opacity: 0.2 }} />
          <div className="font-bold">Senior Engineer</div>
          <div style={{ color: accent }} className="font-semibold">@ Acme Corp</div>
          <div className="text-gray-500 text-[5px]">Jan 2022 – Present</div>
          <div className="text-gray-600 mt-0.5">· Led platform migration</div>
          <div className="text-gray-600">· Built dashboard for 10k users</div>
        </div>
        <div>
          <div className="text-[6px] font-bold uppercase tracking-wider mb-0.5" style={{ color: accent }}>Education</div>
          <div className="h-px mb-1" style={{ backgroundColor: accent, opacity: 0.2 }} />
          <div className="font-bold">UC Berkeley</div>
          <div className="text-gray-600">B.S. Computer Science</div>
          <div className="text-gray-500 text-[5px]">2015 – 2019</div>
        </div>
      </div>
    </div>
  );
}

function MinimalPreview({ accent }: { accent: string }) {
  return (
    <div className="w-full h-full p-4 text-[6px] leading-tight" style={{ fontFamily: 'sans-serif' }}>
      <div className="mb-3">
        <div className="text-[13px] font-light tracking-tight text-gray-900">Alex Johnson</div>
        <div className="text-[5px] text-gray-400 mt-0.5">alex@email.com · San Francisco · linkedin.com/in/alex</div>
        <div className="h-px bg-gray-200 mt-2" />
      </div>
      <div className="mb-2.5">
        <div className="text-[5.5px] font-bold uppercase tracking-widest mb-1" style={{ color: accent }}>Experience</div>
        <div>
          <div className="flex justify-between">
            <span className="font-semibold">Senior Engineer, Acme Corp</span>
            <span className="text-gray-400 text-[5px]">2022 – Present</span>
          </div>
          <div className="text-gray-500 mt-0.5">· Led migration, cut deploy time 60%</div>
          <div className="text-gray-500">· Dashboard for 10,000 daily users</div>
        </div>
      </div>
      <div className="mb-2.5">
        <div className="text-[5.5px] font-bold uppercase tracking-widest mb-1" style={{ color: accent }}>Education</div>
        <div className="flex justify-between">
          <span className="font-semibold">UC Berkeley · B.S. CS</span>
          <span className="text-gray-400 text-[5px]">2015–2019</span>
        </div>
      </div>
      <div>
        <div className="text-[5.5px] font-bold uppercase tracking-widest mb-1" style={{ color: accent }}>Skills</div>
        <div className="flex gap-2">
          <span className="text-gray-500"><span className="font-semibold text-gray-700">Languages</span> TypeScript, Python</span>
        </div>
      </div>
    </div>
  );
}

export default function TemplatesPreview() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-semibold tracking-tight mb-3">Three templates, zero compromise.</h2>
          <p className="text-muted-foreground">All templates are ATS-friendly and export perfectly to PDF.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TEMPLATES.map((t) => (
            <div key={t.name} className="group">
              <div className="rounded-xl border border-border overflow-hidden mb-4 bg-white shadow-sm transition-shadow group-hover:shadow-md" style={{ height: 220 }}>
                {t.preview === 'classic' && <ClassicPreview accent={t.accent} />}
                {t.preview === 'modern' && <ModernPreview accent={t.accent} />}
                {t.preview === 'minimal' && <MinimalPreview accent={t.accent} />}
              </div>
              <h3 className="font-semibold mb-1">{t.name}</h3>
              <p className="text-sm text-muted-foreground">{t.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
