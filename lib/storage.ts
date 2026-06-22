import type { WorkspaceData } from './types';
import { defaultWorkspace } from './defaultData';

const KEY = 'resume-builder-workspace';

export function loadWorkspace(): WorkspaceData {
  if (typeof window === 'undefined') return defaultWorkspace;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultWorkspace;
    return { ...defaultWorkspace, ...JSON.parse(raw) } as WorkspaceData;
  } catch {
    return defaultWorkspace;
  }
}

export function saveWorkspace(data: WorkspaceData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Storage quota exceeded — silently fail
  }
}

export function clearWorkspace(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
}
