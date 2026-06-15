import type { ResumeData } from './types';
import { defaultResumeData } from './defaultData';

const KEY = 'resume-builder-data';

export function loadResume(): ResumeData {
  if (typeof window === 'undefined') return defaultResumeData;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultResumeData;
    return JSON.parse(raw) as ResumeData;
  } catch {
    return defaultResumeData;
  }
}

export function saveResume(data: ResumeData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Storage quota exceeded — silently fail
  }
}

export function clearResume(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
}
