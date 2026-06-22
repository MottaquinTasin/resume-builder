'use client';

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GripVertical, Sparkles } from 'lucide-react';
import type { EssayItem } from '@/lib/types';

interface Props {
  essays: EssayItem[];
  activeEssayId: string | null;
  onChange: (essays: EssayItem[]) => void;
  onFocusEssay: (id: string) => void;
}

function newEssay(): EssayItem {
  return { id: crypto.randomUUID(), title: '新しい設問', body: '', maxChars: 300 };
}

function EssayCard({
  essay,
  active,
  onChange,
  onRemove,
  onFocus,
}: {
  essay: EssayItem;
  active: boolean;
  onChange: (patch: Partial<EssayItem>) => void;
  onRemove: () => void;
  onFocus: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: essay.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  const count = essay.body.length;
  const over = count > essay.maxChars;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onFocus={onFocus}
      onClick={onFocus}
      className={`rounded-lg border bg-card p-2.5 space-y-2 ${active ? 'border-primary ring-1 ring-primary' : 'border-border'}`}
    >
      <div className="flex items-center gap-1.5">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground touch-none">
          <GripVertical className="h-4 w-4" />
        </button>
        <Input
          value={essay.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="設問タイトル（編集可）"
          className="h-8 text-sm font-medium flex-1"
        />
        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={onRemove}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <Textarea
        value={essay.body}
        onChange={(e) => onChange({ body: e.target.value })}
        placeholder="本文を入力、または右下の自己分析AIで下書きを作成…"
        rows={4}
        className="resize-none text-sm"
      />

      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-1 text-muted-foreground">
          上限
          <input
            type="number"
            value={essay.maxChars}
            onChange={(e) => onChange({ maxChars: Number(e.target.value) || 0 })}
            className="w-16 h-7 rounded border border-input bg-background px-2"
          />
          字
        </label>
        <span className={over ? 'text-destructive font-medium' : 'text-muted-foreground'}>
          {count} / {essay.maxChars} 字
        </span>
      </div>
      {active && (
        <p className="flex items-center gap-1 text-[11px] text-primary">
          <Sparkles className="h-3 w-3" /> この欄が自己分析AIの対象です
        </p>
      )}
    </div>
  );
}

export default function EssaysEditor({ essays, activeEssayId, onChange, onFocusEssay }: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const update = (id: string, patch: Partial<EssayItem>) =>
    onChange(essays.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = essays.findIndex((e) => e.id === active.id);
    const newIndex = essays.findIndex((e) => e.id === over.id);
    onChange(arrayMove(essays, oldIndex, newIndex));
  };

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        自己紹介書の設問。タイトルは自由に編集でき、ドラッグで並び替えできます。
      </p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={essays.map((e) => e.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {essays.map((es) => (
              <EssayCard
                key={es.id}
                essay={es}
                active={activeEssayId === es.id}
                onChange={(patch) => update(es.id, patch)}
                onRemove={() => onChange(essays.filter((e) => e.id !== es.id))}
                onFocus={() => onFocusEssay(es.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <Button variant="outline" size="sm" className="w-full" onClick={() => onChange([...essays, newEssay()])}>
        <Plus className="h-4 w-4 mr-1" /> 設問を追加
      </Button>
    </div>
  );
}
