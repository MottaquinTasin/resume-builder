export type TemplateType = 'classic' | 'modern' | 'minimal';

export type SectionType =
  | 'contact'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'activities'
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

/* ============================================================
   Unified bilingual workspace model
   - Personal info, education, and experience are SHARED between
     the English résumé and the Japanese 履歴書 (rirekisho).
   - Each view has its own type-specific extras.
   ============================================================ */

export type ResumeView = 'english' | 'japanese';

export type Gender = '' | 'male' | 'female' | 'other';

export interface SharedPersonal {
  // English-facing
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  // Japanese-facing
  fullNameJa: string; // 氏名 (kanji)
  furigana: string; // ふりがな (reading of the name)
  postalCode: string; // 郵便番号 〒
  addressJa: string; // 現住所
  addressFurigana: string; // 住所のふりがな
  dateOfBirth: string; // YYYY-MM-DD
  gender: Gender;
  nationality: string;
  photoDataUrl: string; // 証明写真 (base64 data URL)
}

// 免許・資格 (licenses & qualifications)
export interface QualificationItem {
  id: string;
  date: string; // 取得年月
  name: string; // 名称
}

// 自己紹介書 essay box with an editable topic title and char limit
export interface EssayItem {
  id: string;
  title: string; // editable topic, e.g. 自己PR / 志望動機 / ガクチカ
  body: string;
  maxChars: number;
}

export interface EnglishConfig {
  template: TemplateType;
  accentColor: string;
  summary: string;
  skills: SkillCategory[];
  projects: ProjectItem[];
  activities: ExperienceItem[];
  sectionOrder: SectionType[];
  enabled: Record<string, boolean>;
}

export interface JapaneseConfig {
  accentColor: string;
  rirekishoDate: string; // 記入日 YYYY-MM-DD
  qualifications: QualificationItem[];
  essays: EssayItem[]; // self-introduction sheet (自己紹介書)
  hobbies: string; // 趣味・特技
  emergencyContact: string; // 緊急連絡先
  commute: string; // 通勤時間
  dependents: string; // 扶養家族
  spouse: 'yes' | 'no' | ''; // 配偶者
  requests: string; // 本人希望記入欄
}

export interface WorkspaceData {
  activeView: ResumeView;
  personal: SharedPersonal;
  education: EducationItem[]; // shared, chronological
  experience: ExperienceItem[]; // shared, chronological
  english: EnglishConfig;
  japanese: JapaneseConfig;
}
