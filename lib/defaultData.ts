import type { WorkspaceData, ResumeData } from './types';

export const defaultWorkspace: WorkspaceData = {
  activeView: 'english',
  personal: {
    fullName: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+81 90-0000-0000',
    location: 'Tokyo, Japan',
    website: 'alexjohnson.dev',
    linkedin: 'linkedin.com/in/alexjohnson',
    github: 'github.com/alexjohnson',
    fullNameJa: 'アレックス ジョンソン',
    furigana: 'あれっくす じょんそん',
    postalCode: '101-0041',
    addressJa: '東京都千代田区神田須田町2-5',
    addressFurigana: 'とうきょうとちよだくかんだすだちょう',
    dateOfBirth: '1998-04-01',
    gender: '',
    nationality: '日本',
    photoDataUrl: '',
  },
  education: [
    {
      id: 'edu-1',
      school: '東京大学 / University of Tokyo',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      location: 'Tokyo',
      startDate: '2017',
      endDate: '2021',
      gpa: '3.8',
    },
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'Acme Corp',
      title: 'Software Engineer',
      location: 'Tokyo',
      startDate: 'Apr 2021',
      endDate: '',
      current: true,
      bullets: [
        'Built a real-time dashboard used by 10,000+ daily active users.',
        'Improved API response times by 40% through caching and query optimization.',
      ],
    },
  ],
  english: {
    template: 'classic',
    accentColor: '#2563EB',
    summary:
      'Results-driven software engineer with experience building scalable web applications. Passionate about clean code, developer experience, and shipping products users love.',
    skills: [
      { id: 'sk-1', name: 'Languages', skills: 'TypeScript, JavaScript, Python, Go' },
      { id: 'sk-2', name: 'Frameworks', skills: 'React, Next.js, Node.js' },
    ],
    projects: [
      {
        id: 'proj-1',
        name: 'OpenDash',
        description: 'Open-source analytics dashboard',
        technologies: 'Next.js, TypeScript, PostgreSQL',
        link: 'github.com/alexjohnson/opendash',
        bullets: ['Built an open-source analytics platform with 2,000+ GitHub stars.'],
      },
    ],
    sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects'],
    enabled: {
      summary: true,
      experience: true,
      education: true,
      skills: true,
      projects: true,
    },
  },
  japanese: {
    accentColor: '#1F3A5F',
    rirekishoDate: new Date().toISOString().slice(0, 10),
    qualifications: [
      { id: 'q-1', date: '2020-07', name: '日本語能力試験 N2 合格' },
      { id: 'q-2', date: '2019-08', name: '普通自動車第一種運転免許' },
    ],
    essays: [
      {
        id: 'es-1',
        title: '学業で力を注いだこと',
        body: '',
        maxChars: 300,
      },
      {
        id: 'es-2',
        title: '学業以外で力を注いだこと（ガクチカ）',
        body: '',
        maxChars: 300,
      },
      {
        id: 'es-3',
        title: '自己PR',
        body: '',
        maxChars: 400,
      },
      {
        id: 'es-4',
        title: '志望動機',
        body: '',
        maxChars: 400,
      },
    ],
    hobbies: '趣味は詩作とバドミントン。特技は戦略ゲームと料理です。',
    emergencyContact: '同上',
    commute: '約 1 時間 0 分',
    dependents: '0 人',
    spouse: 'no',
    requests: '貴社の規定に従います。',
  },
};

/** Adapt the shared workspace into the legacy ResumeData shape so the
 *  existing English templates (Classic / Modern / Minimal) can render it. */
export function workspaceToResumeData(ws: WorkspaceData): ResumeData {
  const p = ws.personal;
  const en = ws.english;

  const byType = {
    contact: {
      id: 'contact',
      type: 'contact' as const,
      enabled: true,
      data: {
        name: p.fullName,
        email: p.email,
        phone: p.phone,
        location: p.location,
        website: p.website,
        linkedin: p.linkedin,
        github: p.github,
      },
    },
    summary: {
      id: 'summary',
      type: 'summary' as const,
      enabled: en.enabled.summary !== false,
      data: { text: en.summary },
    },
    experience: {
      id: 'experience',
      type: 'experience' as const,
      enabled: en.enabled.experience !== false,
      data: { items: ws.experience },
    },
    education: {
      id: 'education',
      type: 'education' as const,
      enabled: en.enabled.education !== false,
      data: { items: ws.education },
    },
    skills: {
      id: 'skills',
      type: 'skills' as const,
      enabled: en.enabled.skills !== false,
      data: { categories: en.skills },
    },
    projects: {
      id: 'projects',
      type: 'projects' as const,
      enabled: en.enabled.projects !== false,
      data: { items: en.projects },
    },
  };

  const ordered = en.sectionOrder
    .filter((t): t is keyof typeof byType => t in byType && t !== 'contact')
    .map((t) => byType[t]);

  return {
    template: en.template,
    accentColor: en.accentColor,
    sections: [byType.contact, ...ordered],
  };
}
