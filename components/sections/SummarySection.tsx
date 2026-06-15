'use client';

import { Textarea } from '@/components/ui/textarea';
import type { SummaryData } from '@/lib/types';

interface Props {
  data: SummaryData;
  onChange: (data: SummaryData) => void;
}

export default function SummarySection({ data, onChange }: Props) {
  return (
    <Textarea
      placeholder="Write a brief professional summary..."
      value={data.text}
      onChange={(e) => onChange({ text: e.target.value })}
      rows={4}
      className="resize-none"
    />
  );
}
