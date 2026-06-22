'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { QualificationItem } from '@/lib/types';

interface Props {
  items: QualificationItem[];
  onChange: (items: QualificationItem[]) => void;
}

export default function QualificationsEditor({ items, onChange }: Props) {
  const update = (id: string, patch: Partial<QualificationItem>) =>
    onChange(items.map((q) => (q.id === id ? { ...q, ...patch } : q)));

  return (
    <div className="space-y-2">
      {items.map((q) => (
        <div key={q.id} className="flex gap-2 items-center">
          <Input
            placeholder="取得年月 (例 2020-07)"
            value={q.date}
            onChange={(e) => update(q.id, { date: e.target.value })}
            className="w-32 text-sm"
          />
          <Input
            placeholder="免許・資格名"
            value={q.name}
            onChange={(e) => update(q.id, { name: e.target.value })}
            className="flex-1 text-sm"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive shrink-0"
            onClick={() => onChange(items.filter((x) => x.id !== q.id))}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => onChange([...items, { id: crypto.randomUUID(), date: '', name: '' }])}
      >
        <Plus className="h-4 w-4 mr-1" /> 資格を追加
      </Button>
    </div>
  );
}
