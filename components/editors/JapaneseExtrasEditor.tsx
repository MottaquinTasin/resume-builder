'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { JapaneseConfig } from '@/lib/types';

interface Props {
  jp: JapaneseConfig;
  onChange: (patch: Partial<JapaneseConfig>) => void;
}

export default function JapaneseExtrasEditor({ jp, onChange }: Props) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">記入日</label>
        <Input type="date" value={jp.rirekishoDate} onChange={(e) => onChange({ rirekishoDate: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">通勤時間</label>
          <Input value={jp.commute} onChange={(e) => onChange({ commute: e.target.value })} placeholder="約 1 時間" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">扶養家族</label>
          <Input value={jp.dependents} onChange={(e) => onChange({ dependents: e.target.value })} placeholder="0 人" />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">配偶者</label>
        <select
          value={jp.spouse}
          onChange={(e) => onChange({ spouse: e.target.value as JapaneseConfig['spouse'] })}
          className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">未選択</option>
          <option value="yes">有</option>
          <option value="no">無</option>
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">本人希望記入欄</label>
        <Textarea
          value={jp.requests}
          onChange={(e) => onChange({ requests: e.target.value })}
          rows={3}
          className="resize-none text-sm"
          placeholder="貴社の規定に従います。"
        />
      </div>
    </div>
  );
}
