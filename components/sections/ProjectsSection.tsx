'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { ProjectsData, ProjectItem } from '@/lib/types';

interface Props {
  data: ProjectsData;
  onChange: (data: ProjectsData) => void;
}

function newItem(): ProjectItem {
  return {
    id: crypto.randomUUID(),
    name: '',
    description: '',
    technologies: '',
    link: '',
    bullets: [''],
  };
}

export default function ProjectsSection({ data, onChange }: Props) {
  const update = (id: string, patch: Partial<ProjectItem>) =>
    onChange({ items: data.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) });

  const remove = (id: string) =>
    onChange({ items: data.items.filter((it) => it.id !== id) });

  const updateBullet = (itemId: string, idx: number, value: string) => {
    const item = data.items.find((it) => it.id === itemId)!;
    const bullets = [...item.bullets];
    bullets[idx] = value;
    update(itemId, { bullets });
  };

  const addBullet = (itemId: string) => {
    const item = data.items.find((it) => it.id === itemId)!;
    update(itemId, { bullets: [...item.bullets, ''] });
  };

  const removeBullet = (itemId: string, idx: number) => {
    const item = data.items.find((it) => it.id === itemId)!;
    update(itemId, { bullets: item.bullets.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-4">
      {data.items.map((item) => (
        <div key={item.id} className="border border-border rounded-lg p-3 space-y-2">
          <div className="flex justify-between gap-2">
            <div className="flex-1 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Project Name" value={item.name} onChange={(e) => update(item.id, { name: e.target.value })} />
                <Input placeholder="Link (optional)" value={item.link} onChange={(e) => update(item.id, { link: e.target.value })} />
              </div>
              <Input placeholder="Technologies used" value={item.technologies} onChange={(e) => update(item.id, { technologies: e.target.value })} />
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium">Bullet points</p>
                {item.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Textarea
                      value={bullet}
                      onChange={(e) => updateBullet(item.id, idx, e.target.value)}
                      placeholder="Describe what you built or achieved..."
                      rows={2}
                      className="resize-none flex-1 text-sm"
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeBullet(item.id, idx)} className="text-destructive hover:text-destructive shrink-0 self-start mt-1">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addBullet(item.id)} className="w-full">
                  <Plus className="h-3 w-3 mr-1" /> Add bullet
                </Button>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => remove(item.id)} className="text-destructive hover:text-destructive shrink-0">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => onChange({ items: [...data.items, newItem()] })} className="w-full">
        <Plus className="h-4 w-4 mr-1" /> Add project
      </Button>
    </div>
  );
}
