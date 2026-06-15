'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { EducationData, EducationItem } from '@/lib/types';

interface Props {
  data: EducationData;
  onChange: (data: EducationData) => void;
}

function newItem(): EducationItem {
  return {
    id: crypto.randomUUID(),
    school: '',
    degree: '',
    field: '',
    location: '',
    startDate: '',
    endDate: '',
    gpa: '',
  };
}

export default function EducationSection({ data, onChange }: Props) {
  const update = (id: string, patch: Partial<EducationItem>) =>
    onChange({ items: data.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) });

  const remove = (id: string) =>
    onChange({ items: data.items.filter((it) => it.id !== id) });

  return (
    <div className="space-y-4">
      {data.items.map((item) => (
        <div key={item.id} className="border border-border rounded-lg p-3 space-y-2">
          <div className="flex justify-between gap-2">
            <div className="flex-1 space-y-2">
              <Input placeholder="School / University" value={item.school} onChange={(e) => update(item.id, { school: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Degree (e.g. B.S.)" value={item.degree} onChange={(e) => update(item.id, { degree: e.target.value })} />
                <Input placeholder="Field of Study" value={item.field} onChange={(e) => update(item.id, { field: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Location" value={item.location} onChange={(e) => update(item.id, { location: e.target.value })} />
                <Input placeholder="GPA (optional)" value={item.gpa} onChange={(e) => update(item.id, { gpa: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Start Year" value={item.startDate} onChange={(e) => update(item.id, { startDate: e.target.value })} />
                <Input placeholder="End Year" value={item.endDate} onChange={(e) => update(item.id, { endDate: e.target.value })} />
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => remove(item.id)} className="text-destructive hover:text-destructive shrink-0">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => onChange({ items: [...data.items, newItem()] })} className="w-full">
        <Plus className="h-4 w-4 mr-1" /> Add education
      </Button>
    </div>
  );
}
