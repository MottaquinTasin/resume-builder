'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { LanguagesData, LanguageItem, Proficiency } from '@/lib/types';

interface Props {
  data: LanguagesData;
  onChange: (data: LanguagesData) => void;
}

const PROFICIENCY_OPTIONS: Proficiency[] = ['Native', 'Fluent', 'Proficient', 'Intermediate', 'Basic'];

function newItem(): LanguageItem {
  return { id: crypto.randomUUID(), language: '', proficiency: 'Proficient' };
}

export default function LanguagesSection({ data, onChange }: Props) {
  const update = (id: string, patch: Partial<LanguageItem>) =>
    onChange({ items: data.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) });

  const remove = (id: string) =>
    onChange({ items: data.items.filter((it) => it.id !== id) });

  return (
    <div className="space-y-2">
      {data.items.map((item) => (
        <div key={item.id} className="flex gap-2 items-center">
          <Input
            placeholder="Language"
            value={item.language}
            onChange={(e) => update(item.id, { language: e.target.value })}
            className="flex-1"
          />
          <select
            value={item.proficiency}
            onChange={(e) => update(item.id, { proficiency: e.target.value as Proficiency })}
            className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            {PROFICIENCY_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <Button variant="ghost" size="icon" onClick={() => remove(item.id)} className="text-destructive hover:text-destructive shrink-0">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => onChange({ items: [...data.items, newItem()] })} className="w-full">
        <Plus className="h-4 w-4 mr-1" /> Add language
      </Button>
    </div>
  );
}
