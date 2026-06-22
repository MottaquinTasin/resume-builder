'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useReactToPrint } from 'react-to-print';
import { Download, RotateCcw, FileText, Cloud, CloudOff, Pencil, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loadResume, saveResume, clearResume } from '@/lib/storage';
import { defaultResumeData } from '@/lib/defaultData';
import { createResume, updateResume } from '@/lib/supabase/resumes';
import type { ResumeData, Section } from '@/lib/types';
import type { User } from '@supabase/supabase-js';
import SectionBlock from './SectionBlock';
import ResumeCanvas from './ResumeCanvas';
import { toast } from 'sonner';

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

interface Props {
  initialData: ResumeData;
  resumeId: string | null;
  resumeTitle: string;
  user: User | null;
}

export default function Builder({ initialData, resumeId, resumeTitle: initialTitle, user }: Props) {
  const router = useRouter();
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [expandedSection, setExpandedSection] = useState<string | null>('contact');
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(resumeId);
  const [title, setTitle] = useState(initialTitle);
  const [editingTitle, setEditingTitle] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Guest mode: load from localStorage only when it's a new resume with no user
    if (!user && !resumeId) {
      setResumeData(loadResume());
    }
    setMounted(true);
  }, []);

  // Auto-save: localStorage for guests, cloud for logged-in users
  const persistData = useCallback((data: ResumeData, titleVal: string) => {
    if (!user) {
      saveResume(data);
      return;
    }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      setSaving(true);
      try {
        if (savedId) {
          await updateResume(savedId, { data, title: titleVal });
        } else {
          const record = await createResume(titleVal, data);
          setSavedId(record.id);
          router.replace(`/builder/${record.id}`, { scroll: false });
        }
      } catch {
        toast.error('Failed to save. Changes are kept locally.');
      } finally {
        setSaving(false);
      }
    }, 1200);
  }, [user, savedId, router]);

  useEffect(() => {
    if (mounted) persistData(resumeData, title);
  }, [resumeData, title, mounted]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: title,
    pageStyle: `@page { size: A4; margin: 0; } @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`,
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
    setTitle('Untitled Resume');
  };

  if (!mounted) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/30">
        <div className="text-muted-foreground text-sm">Loading…</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-muted/30">
      {/* Top bar */}
      <header className="bg-background border-b border-border px-4 py-2.5 flex items-center justify-between gap-4 shrink-0">
        {/* Title */}
        <div className="flex items-center gap-2 min-w-0">
          {editingTitle ? (
            <div className="flex items-center gap-1">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => setEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setEditingTitle(false)}
                className="h-7 text-sm w-48"
                autoFocus
              />
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingTitle(false)}>
                <Check className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setEditingTitle(true)}
              className="flex items-center gap-1.5 text-sm font-medium hover:text-muted-foreground transition-colors group"
            >
              {title}
              <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
            </button>
          )}
          {user && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              {saving ? (
                <><Cloud className="h-3 w-3 animate-pulse" /> Saving…</>
              ) : (
                <><Cloud className="h-3 w-3 text-emerald-500" /> Saved</>
              )}
            </span>
          )}
          {!user && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <CloudOff className="h-3 w-3" /> Guest mode
            </span>
          )}
        </div>

        {/* Template switcher */}
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

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            {ACCENT_COLORS.map((c) => (
              <button
                key={c.value}
                title={c.label}
                onClick={() => setResumeData((p) => ({ ...p, accentColor: c.value }))}
                style={{ backgroundColor: c.value }}
                className={`w-4.5 h-4.5 rounded-full transition-transform hover:scale-110 ${
                  resumeData.accentColor === c.value ? 'ring-2 ring-offset-1 ring-foreground scale-110' : ''
                }`}
              />
            ))}
          </div>
          <Button variant="ghost" size="sm" onClick={resetResume} className="gap-1.5 text-muted-foreground text-xs h-7">
            <RotateCcw className="h-3 w-3" />Reset
          </Button>
          <Button size="sm" onClick={() => handlePrint()} className="gap-1.5 h-7 text-xs">
            <Download className="h-3 w-3" />Download PDF
          </Button>
        </div>
      </header>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <aside className="w-80 border-r border-border bg-background flex flex-col overflow-hidden shrink-0">
          <div className="px-3 py-2 border-b border-border">
            <p className="text-xs text-muted-foreground">Drag to reorder · eye to show/hide · click to edit</p>
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
          {!user && (
            <div className="border-t border-border p-3 bg-muted/30">
              <p className="text-xs text-muted-foreground text-center">
                <a href="/signup" className="text-foreground font-medium hover:underline">Sign up free</a> to save your resume to the cloud
              </p>
            </div>
          )}
        </aside>

        {/* Resume preview */}
        <main className="flex-1 overflow-auto bg-muted/40 flex flex-col items-center py-8 px-4">
          <div style={{ transform: 'scale(0.82)', transformOrigin: 'top center', marginBottom: '-18%' }}>
            <ResumeCanvas resumeData={resumeData} printRef={printRef} />
          </div>
        </main>
      </div>
    </div>
  );
}
