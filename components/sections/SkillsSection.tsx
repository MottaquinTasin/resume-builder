'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { SkillsData, SkillCategory } from '@/lib/types';

interface Props {
  data: SkillsData;
  onChange: (data: SkillsData) => void;
}

function newCategory(): SkillCategory {
  return { id: crypto.randomUUID(), name: '', skills: '' };
}

export default function SkillsSection({ data, onChange }: Props) {
  const update = (id: string, patch: Partial<SkillCategory>) =>
    onChange({ categories: data.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)) });

  const remove = (id: string) =>
    onChange({ categories: data.categories.filter((c) => c.id !== id) });

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">Separate skills with commas (e.g. React, TypeScript, Node.js)</p>
      {data.categories.map((cat) => (
        <div key={cat.id} className="flex gap-2 items-start">
          <div className="flex-1 space-y-1">
            <Input
              placeholder="Category (e.g. Languages)"
              value={cat.name}
              onChange={(e) => update(cat.id, { name: e.target.value })}
              className="text-sm"
            />
            <Input
              placeholder="Skills, separated by commas"
              value={cat.skills}
              onChange={(e) => update(cat.id, { skills: e.target.value })}
              className="text-sm"
            />
          </div>
          <Button variant="ghost" size="icon" onClick={() => remove(cat.id)} className="text-destructive hover:text-destructive mt-1 shrink-0">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => onChange({ categories: [...data.categories, newCategory()] })} className="w-full">
        <Plus className="h-4 w-4 mr-1" /> Add category
      </Button>
    </div>
  );
}
