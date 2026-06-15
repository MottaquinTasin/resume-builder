import type { RefObject } from 'react';
import type { ResumeData } from '@/lib/types';
import ClassicTemplate from './templates/ClassicTemplate';
import ModernTemplate from './templates/ModernTemplate';
import MinimalTemplate from './templates/MinimalTemplate';

interface Props {
  resumeData: ResumeData;
  printRef: RefObject<HTMLDivElement | null>;
}

export default function ResumeCanvas({ resumeData, printRef }: Props) {
  const { sections, template, accentColor } = resumeData;

  return (
    <div
      ref={printRef}
      id="resume-canvas"
      style={{
        width: 794,
        minHeight: 1123,
        backgroundColor: '#fff',
        padding: template === 'modern' ? 0 : '48px 52px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {template === 'classic' && <ClassicTemplate sections={sections} accentColor={accentColor} />}
      {template === 'modern' && <ModernTemplate sections={sections} accentColor={accentColor} />}
      {template === 'minimal' && <MinimalTemplate sections={sections} accentColor={accentColor} />}
    </div>
  );
}
