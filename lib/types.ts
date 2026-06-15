export type TemplateType = 'classic' | 'modern' | 'minimal';

export type SectionType =
  | 'contact'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages';

export interface ContactData {
  name: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
}

export interface SummaryData {
  text: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface ExperienceData {
  items: ExperienceItem[];
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface EducationData {
  items: EducationItem[];
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: string;
}

export interface SkillsData {
  categories: SkillCategory[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
  bullets: string[];
}

export interface ProjectsData {
  items: ProjectItem[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export interface CertificationsData {
  items: CertificationItem[];
}

export type Proficiency = 'Native' | 'Fluent' | 'Proficient' | 'Intermediate' | 'Basic';

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: Proficiency;
}

export interface LanguagesData {
  items: LanguageItem[];
}

export type SectionData =
  | ContactData
  | SummaryData
  | ExperienceData
  | EducationData
  | SkillsData
  | ProjectsData
  | CertificationsData
  | LanguagesData;

export interface Section {
  id: string;
  type: SectionType;
  enabled: boolean;
  data: SectionData;
}

export interface ResumeData {
  template: TemplateType;
  accentColor: string;
  sections: Section[];
}
