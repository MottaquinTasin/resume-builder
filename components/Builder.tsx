'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useReactToPrint } from 'react-to-print';
import {
  Download, RotateCcw, FileText, Cloud, CloudOff, Pencil, Check,
  GripVertical, ChevronDown, ChevronUp, Eye, EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loadWorkspace, saveWorkspace, clearWorkspace } from '@/lib/storage';
import { defaultWorkspace } from '@/lib/defaultData';
import type {
  WorkspaceData, ResumeView, SectionType,
  ExperienceData, EducationData, SkillsData, ProjectsData, SummaryData,
} from '@/lib/types';
import type { User } from '@supabase/supabase-js';
import { createResume, updateResume } from '@/lib/supabase/resumes';
import { toast } from 'sonner';

import ResumeCanvas from './ResumeCanvas';
import AiHelper from './AiHelper';
import PersonalEditor from './editors/PersonalEditor';
import EssaysEditor from './editors/EssaysEditor';
import QualificationsEditor from './editors/QualificationsEditor';
import JapaneseExtrasEditor from './editors/JapaneseExtrasEditor';
import ExperienceSection from './sections/ExperienceSection';
import EducationSection from './sections/EducationSection';
import SummarySection from './sections/SummarySection';
import SkillsSection from './sections/SkillsSection';
import ProjectsSection from './sections/ProjectsSection';

const TEMPLATES = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'minimal', label: 'Minimal' },
] as const;

const ACCENT_COLORS = [
  '#2563EB', '#1F3A5F', '#059669', '#7C3AED', '#E11D48', '#D97706', '#475569',
];

const EN_LABELS: Record<SectionType, string> = {
  contact: 'Contact',
  summary: 'Summary',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  languages: 'Languages',
};

interface Props {
  initialData: WorkspaceData;
  resumeId: string | null;
  resumeTitle: string;
  user: User | null;
}

/* ---- collapsible group (non-draggable, used for shared + JP) ---- */
function Group({
  title, open, onToggle, children,
}: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium"
      >
        {title}
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && <div className="p-3 border-t border-border">{children}</div>}
    </div>
  );
}

/* ---- draggable English section card ---- */
function EnSectionCard({
  type, enabled, open, onToggleOpen, onToggleEnabled, children,
}: {
  type: SectionType; enabled: boolean; open: boolean;
  onToggleOpen: () => void; onToggleEnabled: () => void; children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: type });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, zIndex: isDragging ? 10 : undefined };
  return (
    <div ref={setNodeRef} style={style} className="rounded-lg border border-border bg-card overflow-hidden">
      <div className={`flex items-center gap-2 px-3 py-2.5 ${open ? 'border-b border-border' : ''}`}>
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground touch-none">
          <GripVertical className="h-4 w-4" />
        </button>
        <span className={`flex-1 text-sm font-medium ${!enabled ? 'text-muted-foreground' : ''}`}>{EN_LABELS[type]}</span>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={onToggleEnabled}>
          {enabled ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={onToggleOpen}>
          {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </Button>
      </div>
      {open && <div className="p-3">{children}</div>}
    </div>
  );
}

export default function Builder({ initialData, resumeId, resumeTitle: initialTitle, user }: Props) {
  const router = useRouter();
  const [ws, setWs] = useState<WorkspaceData>(initialData);
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(resumeId);
  const [title, setTitle] = useState(initialTitle);
  const [editingTitle, setEditingTitle] = useState(false);
  const [openGroup, setOpenGroup] = useState<string>('personal');
  const [activeEssayId, setActiveEssayId] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!user && !resumeId) setWs(loadWorkspace());
    setMounted(true);
  }, []);

  const persist = useCallback((data: WorkspaceData, t: string) => {
    if (!user) { saveWorkspace(data); return; }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      try {
        if (savedId) await updateResume(savedId, { data, title: t });
        else {
          const rec = await createResume(t, data);
          setSavedId(rec.id);
          router.replace(`/builder/${rec.id}`, { scroll: false });
        }
      } catch {
        toast.error('保存に失敗しました。変更はローカルに保持されます。');
      } finally { setSaving(false); }
    }, 1200);
  }, [user, savedId, router]);

  useEffect(() => { if (mounted) persist(ws, title); }, [ws, title, mounted]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: title,
    pageStyle: `@page { size: A4; margin: 0; } @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`,
  });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const view = ws.activeView;
  const setView = (v: ResumeView) => setWs((w) => ({ ...w, activeView: v }));

  // mutators
  const setPersonal = (personal: WorkspaceData['personal']) => setWs((w) => ({ ...w, personal }));
  const setExperience = (d: ExperienceData) => setWs((w) => ({ ...w, experience: d.items }));
  const setEducation = (d: EducationData) => setWs((w) => ({ ...w, education: d.items }));
  const setEnglish = (patch: Partial<WorkspaceData['english']>) => setWs((w) => ({ ...w, english: { ...w.english, ...patch } }));
  const setJapanese = (patch: Partial<WorkspaceData['japanese']>) => setWs((w) => ({ ...w, japanese: { ...w.japanese, ...patch } }));

  const accent = view === 'english' ? ws.english.accentColor : ws.japanese.accentColor;
  const setAccent = (c: string) => (view === 'english' ? setEnglish({ accentColor: c }) : setJapanese({ accentColor: c }));

  const resetAll = () => {
    if (!confirm('サンプルにリセットしますか？編集内容は失われます。')) return;
    clearWorkspace();
    setWs(defaultWorkspace);
    setTitle('Untitled Resume');
  };

  // English section drag
  const handleEnDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const order = ws.english.sectionOrder;
    const oldI = order.indexOf(active.id as SectionType);
    const newI = order.indexOf(over.id as SectionType);
    setEnglish({ sectionOrder: arrayMove(order, oldI, newI) });
  };

  const activeEssay = ws.japanese.essays.find((e) => e.id === activeEssayId) ?? null;
  const insertEssay = (id: string, text: string) =>
    setJapanese({ essays: ws.japanese.essays.map((e) => (e.id === id ? { ...e, body: text } : e)) });

  if (!mounted) {
    return <div className="h-full flex items-center justify-center bg-muted/30"><span className="text-sm text-muted-foreground">Loading…</span></div>;
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-muted/30">
      {/* Top bar */}
      <header className="bg-background border-b border-border px-4 py-2.5 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {editingTitle ? (
            <div className="flex items-center gap-1">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} onBlur={() => setEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setEditingTitle(false)} className="h-7 text-sm w-44" autoFocus />
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingTitle(false)}><Check className="h-3.5 w-3.5" /></Button>
            </div>
          ) : (
            <button onClick={() => setEditingTitle(true)} className="flex items-center gap-1.5 text-sm font-medium hover:text-muted-foreground group">
              {title}<Pencil className="h-3 w-3 opacity-0 group-hover:opacity-50" />
            </button>
          )}
          {user
            ? <span className="text-xs text-muted-foreground flex items-center gap-1">{saving ? <><Cloud className="h-3 w-3 animate-pulse" /> 保存中…</> : <><Cloud className="h-3 w-3 text-emerald-500" /> 保存済み</>}</span>
            : <span className="text-xs text-muted-foreground flex items-center gap-1"><CloudOff className="h-3 w-3" /> ゲスト</span>}
        </div>

        {/* EN / JP toggle */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <button onClick={() => setView('english')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${view === 'english' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            English Résumé
          </button>
          <button onClick={() => setView('japanese')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${view === 'japanese' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            日本語 履歴書
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            {ACCENT_COLORS.map((c) => (
              <button key={c} onClick={() => setAccent(c)} style={{ backgroundColor: c }}
                className={`w-4 h-4 rounded-full transition-transform hover:scale-110 ${accent === c ? 'ring-2 ring-offset-1 ring-foreground scale-110' : ''}`} />
            ))}
          </div>
          <Button variant="ghost" size="sm" onClick={resetAll} className="gap-1.5 text-muted-foreground text-xs h-7"><RotateCcw className="h-3 w-3" />Reset</Button>
          <Button size="sm" onClick={() => handlePrint()} className="gap-1.5 h-7 text-xs"><Download className="h-3 w-3" />Download PDF</Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left editor panel */}
        <aside className="w-80 border-r border-border bg-background flex flex-col overflow-hidden shrink-0">
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {view === 'english' ? (
              <>
                {/* Template picker */}
                <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                  {TEMPLATES.map((t) => (
                    <button key={t.id} onClick={() => setEnglish({ template: t.id })}
                      className={`flex-1 px-2 py-1 text-xs font-medium rounded-md ${ws.english.template === t.id ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}>
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Contact (shared, always first, not draggable) */}
                <Group title="Personal / Contact" open={openGroup === 'personal'} onToggle={() => setOpenGroup(openGroup === 'personal' ? '' : 'personal')}>
                  <PersonalEditor data={ws.personal} view="english" onChange={setPersonal} />
                </Group>

                {/* Draggable EN sections */}
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleEnDragEnd}>
                  <SortableContext items={ws.english.sectionOrder} strategy={verticalListSortingStrategy}>
                    {ws.english.sectionOrder.map((type) => (
                      <EnSectionCard
                        key={type}
                        type={type}
                        enabled={ws.english.enabled[type] !== false}
                        open={openGroup === type}
                        onToggleOpen={() => setOpenGroup(openGroup === type ? '' : type)}
                        onToggleEnabled={() => setEnglish({ enabled: { ...ws.english.enabled, [type]: ws.english.enabled[type] === false } })}
                      >
                        {type === 'summary' && <SummarySection data={{ text: ws.english.summary } as SummaryData} onChange={(d) => setEnglish({ summary: d.text })} />}
                        {type === 'experience' && <ExperienceSection data={{ items: ws.experience }} onChange={setExperience} />}
                        {type === 'education' && <EducationSection data={{ items: ws.education }} onChange={setEducation} />}
                        {type === 'skills' && <SkillsSection data={{ categories: ws.english.skills } as SkillsData} onChange={(d) => setEnglish({ skills: d.categories })} />}
                        {type === 'projects' && <ProjectsSection data={{ items: ws.english.projects } as ProjectsData} onChange={(d) => setEnglish({ projects: d.items })} />}
                      </EnSectionCard>
                    ))}
                  </SortableContext>
                </DndContext>
              </>
            ) : (
              <>
                <Group title="個人情報" open={openGroup === 'personal'} onToggle={() => setOpenGroup(openGroup === 'personal' ? '' : 'personal')}>
                  <PersonalEditor data={ws.personal} view="japanese" onChange={setPersonal} />
                </Group>
                <Group title="学歴" open={openGroup === 'edu'} onToggle={() => setOpenGroup(openGroup === 'edu' ? '' : 'edu')}>
                  <EducationSection data={{ items: ws.education }} onChange={setEducation} />
                </Group>
                <Group title="職歴" open={openGroup === 'exp'} onToggle={() => setOpenGroup(openGroup === 'exp' ? '' : 'exp')}>
                  <ExperienceSection data={{ items: ws.experience }} onChange={setExperience} />
                </Group>
                <Group title="免許・資格" open={openGroup === 'qual'} onToggle={() => setOpenGroup(openGroup === 'qual' ? '' : 'qual')}>
                  <QualificationsEditor items={ws.japanese.qualifications} onChange={(items) => setJapanese({ qualifications: items })} />
                </Group>
                <Group title="自己紹介書（エッセイ）" open={openGroup === 'essays'} onToggle={() => setOpenGroup(openGroup === 'essays' ? '' : 'essays')}>
                  <EssaysEditor essays={ws.japanese.essays} activeEssayId={activeEssayId}
                    onChange={(essays) => setJapanese({ essays })} onFocusEssay={setActiveEssayId} />
                </Group>
                <Group title="その他（通勤・本人希望など）" open={openGroup === 'extras'} onToggle={() => setOpenGroup(openGroup === 'extras' ? '' : 'extras')}>
                  <JapaneseExtrasEditor jp={ws.japanese} onChange={setJapanese} />
                </Group>
              </>
            )}
          </div>
          {!user && (
            <div className="border-t border-border p-3 bg-muted/30">
              <p className="text-xs text-muted-foreground text-center">
                <a href="/signup" className="text-foreground font-medium hover:underline">無料登録</a> でクラウド保存できます
              </p>
            </div>
          )}
        </aside>

        {/* Preview */}
        <main className="flex-1 overflow-auto bg-muted/40 flex flex-col items-center py-8 px-4">
          <div style={{ transform: 'scale(0.82)', transformOrigin: 'top center', marginBottom: '-18%' }}>
            <ResumeCanvas ws={ws} printRef={printRef} />
          </div>
        </main>
      </div>

      {/* AI helper — most useful in Japanese view */}
      {view === 'japanese' && <AiHelper ws={ws} activeEssay={activeEssay} onInsert={insertEssay} />}
    </div>
  );
}
