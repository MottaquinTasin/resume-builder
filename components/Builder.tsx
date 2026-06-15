'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useReactToPrint } from 'react-to-print';
import { Download, RotateCcw, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { loadResume, saveResume, clearResume } from '@/lib/storage';
import { defaultResumeData } from '@/lib/defaultData';
import type { ResumeData, Section } from '@/lib/types';
import SectionBlock from './SectionBlock';
import ResumeCanvas from './ResumeCanvas';

const TEMPLATES = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'minimal', label: 'Minimal' },
] as const;

const ACCENT_COLORS = [
  { value: '#2563EB', label: 'Blue' },
  { value: '#059669', label: 'Emerald' },
  { value: '#7C3AED', label: 'Violet' },
  { value: '#E11D48', label: 'Rose' },
  { value: '#D97706', label: 'Amber' },
  { value: '#475569', label: 'Slate' },
];

export default function Builder() {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [expandedSection, setExpandedSection] = useState<string | null>('contact');
  const [mounted, setMounted] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setResumeData(loadResume());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) saveResume(resumeData);
  }, [resumeData, mounted]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Resume - ${(resumeData.sections.find((s) => s.type === 'contact')?.data as any)?.name ?? 'Resume'}`,
    pageStyle: `
      @page { size: A4; margin: 0; }
      @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    `,
  });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const updateSection = useCallback((id: string, data: Section['data']) => {
    setResumeData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? { ...s, data } : s)),
    }));
  }, []);

  const toggleSection = useCallback((id: string) => {
    setResumeData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    }));
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setResumeData((prev) => {
      const oldIndex = prev.sections.findIndex((s) => s.id === active.id);
      const newIndex = prev.sections.findIndex((s) => s.id === over.id);
      return { ...prev, sections: arrayMove(prev.sections, oldIndex, newIndex) };
    });
  };

  const resetResume = () => {
    if (!confirm('Reset to sample resume? This will clear all your edits.')) return;
    clearResume();
    setResumeData(defaultResumeData);
  };

  if (!mounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-muted/30">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-muted/30">
      {/* Top bar */}
      <header className="bg-background border-b border-border px-4 py-3 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <span className="font-semibold text-sm">Resume Builder</span>
        </div>

        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setResumeData((p) => ({ ...p, template: t.id }))}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                resumeData.template === t.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            {ACCENT_COLORS.map((c) => (
              <button
                key={c.value}
                title={c.label}
                onClick={() => setResumeData((p) => ({ ...p, accentColor: c.value }))}
                style={{ backgroundColor: c.value }}
                className={`w-5 h-5 rounded-full transition-transform hover:scale-110 ${
                  resumeData.accentColor === c.value ? 'ring-2 ring-offset-1 ring-foreground scale-110' : ''
                }`}
              />
            ))}
          </div>

          <Button variant="ghost" size="sm" onClick={resetResume} className="gap-1.5 text-muted-foreground">
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>

          <Button size="sm" onClick={() => handlePrint()} className="gap-1.5">
            <Download className="h-3.5 w-3.5" />
            Download PDF
          </Button>
        </div>
      </header>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — section editor */}
        <aside className="w-80 border-r border-border bg-background flex flex-col overflow-hidden shrink-0">
          <div className="px-3 py-2.5 border-b border-border">
            <p className="text-xs text-muted-foreground">Drag to reorder · click eye to show/hide · click section to edit</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={resumeData.sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                {resumeData.sections.map((section) => (
                  <SectionBlock
                    key={section.id}
                    section={section}
                    isExpanded={expandedSection === section.id}
                    onToggleExpand={() => setExpandedSection((prev) => (prev === section.id ? null : section.id))}
                    onToggleEnabled={() => toggleSection(section.id)}
                    onDataChange={(data) => updateSection(section.id, data)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </aside>

        {/* Resume preview */}
        <main className="flex-1 overflow-auto bg-muted/40 flex flex-col items-center py-8 px-4">
          <div
            className="shadow-2xl"
            style={{ transform: 'scale(0.85)', transformOrigin: 'top center', marginBottom: '-15%' }}
          >
            <ResumeCanvas resumeData={resumeData} printRef={printRef} />
          </div>
        </main>
      </div>
    </div>
  );
}
