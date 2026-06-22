'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Lightbulb, PenLine, Wand2, Loader2, ClipboardCopy, ArrowDownToLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { WorkspaceData } from '@/lib/types';
import { toast } from 'sonner';

type Mode = 'ideas' | 'draft' | 'improve';

interface Props {
  ws: WorkspaceData;
  activeEssay: { id: string; title: string; body: string; maxChars: number } | null;
  onInsert: (essayId: string, text: string) => void;
}

const MODES: { id: Mode; label: string; icon: typeof Lightbulb; hint: string }[] = [
  { id: 'ideas', label: '切り口を出す', icon: Lightbulb, hint: '書くアイデアを提案' },
  { id: 'draft', label: '下書き作成', icon: PenLine, hint: '完成文を作る' },
  { id: 'improve', label: '推敲する', icon: Wand2, hint: '今の文章を改善' },
];

export default function AiHelper({ ws, activeEssay, onInsert }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const outRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight;
  }, [output]);

  const run = async (mode: Mode) => {
    if (!activeEssay) {
      toast.info('まず左の編集パネルでエッセイ欄を選んでください。');
      return;
    }
    setLoading(true);
    setOutput('');

    const context = {
      education: ws.education.map((e) => `${e.school} ${e.field}`).filter(Boolean).join('; '),
      experience: ws.experience
        .map((x) => `${x.company} ${x.title}: ${x.bullets.filter(Boolean).join(' / ')}`)
        .filter(Boolean)
        .join(' | '),
      qualifications: ws.japanese.qualifications.map((q) => q.name).join(', '),
    };

    try {
      const res = await fetch('/api/ai-suggest', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          mode,
          essayTitle: activeEssay.title,
          currentText: activeEssay.body,
          maxChars: activeEssay.maxChars,
          context,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      if (!res.body) throw new Error('No response stream.');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setOutput(acc);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'AI request failed.';
      setOutput(`⚠️ ${msg}\n\n（AIアシスタントを使うには、サーバーに ANTHROPIC_API_KEY を設定してデプロイする必要があります。）`);
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    toast.success('コピーしました。');
  };

  const insert = () => {
    if (activeEssay) {
      onInsert(activeEssay.id, output);
      toast.success('エッセイ欄に挿入しました。');
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-foreground text-background px-4 py-3 shadow-lg hover:bg-foreground/90 transition-colors"
      >
        <Sparkles className="h-4 w-4" />
        <span className="text-sm font-medium">自己分析AI</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 w-[360px] max-h-[70vh] flex flex-col rounded-xl border border-border bg-background shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">自己分析・自己PR アシスタント</span>
        </div>
        <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Target essay */}
      <div className="px-4 py-2 border-b border-border bg-muted/30">
        {activeEssay ? (
          <p className="text-xs text-muted-foreground">
            対象: <span className="font-medium text-foreground">{activeEssay.title}</span>（{activeEssay.maxChars}字以内）
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">左パネルでエッセイ欄を選択してください。</p>
        )}
      </div>

      {/* Mode buttons */}
      <div className="grid grid-cols-3 gap-1.5 p-3 border-b border-border">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => run(m.id)}
            disabled={loading}
            title={m.hint}
            className="flex flex-col items-center gap-1 rounded-lg border border-border py-2 text-xs hover:bg-muted disabled:opacity-50 transition-colors"
          >
            <m.icon className="h-4 w-4" />
            {m.label}
          </button>
        ))}
      </div>

      {/* Output */}
      <div ref={outRef} className="flex-1 overflow-y-auto p-4 text-sm whitespace-pre-wrap leading-relaxed min-h-[120px]">
        {output ? (
          output
        ) : loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> 考えています…
          </div>
        ) : (
          <p className="text-muted-foreground text-xs">
            上のボタンを押すと、選択中のエッセイ欄に合わせて AI が日本語で提案します。
            「結論 → エピソード → 結果 → 入社後の活かし方」の構成でアドバイスします。
          </p>
        )}
      </div>

      {/* Actions */}
      {output && !loading && (
        <div className="flex gap-2 p-3 border-t border-border">
          <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={copy}>
            <ClipboardCopy className="h-3.5 w-3.5" /> コピー
          </Button>
          <Button size="sm" className="flex-1 gap-1.5" onClick={insert} disabled={!activeEssay}>
            <ArrowDownToLine className="h-3.5 w-3.5" /> 挿入
          </Button>
        </div>
      )}
    </div>
  );
}
