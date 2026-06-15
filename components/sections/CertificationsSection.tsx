'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { CertificationsData, CertificationItem } from '@/lib/types';

interface Props {
  data: CertificationsData;
  onChange: (data: CertificationsData) => void;
}

function newItem(): CertificationItem {
  return { id: crypto.randomUUID(), name: '', issuer: '', date: '', link: '' };
}

export default function CertificationsSection({ data, onChange }: Props) {
  const update = (id: string, patch: Partial<CertificationItem>) =>
    onChange({ items: data.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) });

  const remove = (id: string) =>
    onChange({ items: data.items.filter((it) => it.id !== id) });

  return (
    <div className="space-y-3">
      {data.items.map((item) => (
        <div key={item.id} className="border border-border rounded-lg p-3 space-y-2">
          <div className="flex justify-between gap-2">
            <div className="flex-1 space-y-2">
              <Input placeholder="Certification Name" value={item.name} onChange={(e) => update(item.id, { name: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Issuing Organization" value={item.issuer} onChange={(e) => update(item.id, { issuer: e.target.value })} />
                <Input placeholder="Date (e.g. Mar 2024)" value={item.date} onChange={(e) => update(item.id, { date: e.target.value })} />
              </div>
              <Input placeholder="Credential URL (optional)" value={item.link} onChange={(e) => update(item.id, { link: e.target.value })} />
            </div>
            <Button variant="ghost" size="icon" onClick={() => remove(item.id)} className="text-destructive hover:text-destructive shrink-0">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => onChange({ items: [...data.items, newItem()] })} className="w-full">
        <Plus className="h-4 w-4 mr-1" /> Add certification
      </Button>
    </div>
  );
}
