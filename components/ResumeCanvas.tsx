import type { RefObject } from 'react';
import type { WorkspaceData } from '@/lib/types';
import { workspaceToResumeData } from '@/lib/defaultData';
import ClassicTemplate from './templates/ClassicTemplate';
import ModernTemplate from './templates/ModernTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import RirekishoTemplate from './templates/RirekishoTemplate';

interface Props {
  ws: WorkspaceData;
  printRef: RefObject<HTMLDivElement | null>;
}

export default function ResumeCanvas({ ws, printRef }: Props) {
  if (ws.activeView === 'japanese') {
    return (
      <div
        ref={printRef}
        id="resume-canvas"
        style={{
          width: 794,
          minHeight: 1123,
          backgroundColor: '#fff',
          padding: '40px 44px',
          boxSizing: 'border-box',
        }}
      >
        <RirekishoTemplate ws={ws} />
      </div>
    );
  }

  const resumeData = workspaceToResumeData(ws);
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
