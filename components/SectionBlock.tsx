'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Section, ContactData, SummaryData, ExperienceData, EducationData, SkillsData, ProjectsData, CertificationsData, LanguagesData } from '@/lib/types';
import ContactSection from './sections/ContactSection';
import SummarySection from './sections/SummarySection';
import ExperienceSection from './sections/ExperienceSection';
import EducationSection from './sections/EducationSection';
import SkillsSection from './sections/SkillsSection';
import ProjectsSection from './sections/ProjectsSection';
import CertificationsSection from './sections/CertificationsSection';
import LanguagesSection from './sections/LanguagesSection';

const SECTION_LABELS: Record<string, string> = {
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
  section: Section;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleEnabled: () => void;
  onDataChange: (data: Section['data']) => void;
}

export default function SectionBlock({ section, isExpanded, onToggleExpand, onToggleEnabled, onDataChange }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Header row */}
      <div className={`flex items-center gap-2 px-3 py-2.5 ${isExpanded ? 'border-b border-border' : ''}`}>
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <span className={`flex-1 text-sm font-medium ${!section.enabled ? 'text-muted-foreground' : ''}`}>
          {SECTION_LABELS[section.type] ?? section.type}
        </span>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={onToggleEnabled}
          title={section.enabled ? 'Hide section' : 'Show section'}
        >
          {section.enabled ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={onToggleExpand}
        >
          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </Button>
      </div>

      {/* Editor body */}
      {isExpanded && (
        <div className="p-3">
          {section.type === 'contact' && (
            <ContactSection data={section.data as ContactData} onChange={onDataChange} />
          )}
          {section.type === 'summary' && (
            <SummarySection data={section.data as SummaryData} onChange={onDataChange} />
          )}
          {section.type === 'experience' && (
            <ExperienceSection data={section.data as ExperienceData} onChange={onDataChange} />
          )}
          {section.type === 'education' && (
            <EducationSection data={section.data as EducationData} onChange={onDataChange} />
          )}
          {section.type === 'skills' && (
            <SkillsSection data={section.data as SkillsData} onChange={onDataChange} />
          )}
          {section.type === 'projects' && (
            <ProjectsSection data={section.data as ProjectsData} onChange={onDataChange} />
          )}
          {section.type === 'certifications' && (
            <CertificationsSection data={section.data as CertificationsData} onChange={onDataChange} />
          )}
          {section.type === 'languages' && (
            <LanguagesSection data={section.data as LanguagesData} onChange={onDataChange} />
          )}
        </div>
      )}
    </div>
  );
}
