import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';
export const maxDuration = 60;

type Mode = 'ideas' | 'draft' | 'improve';

interface Body {
  mode: Mode;
  essayTitle: string;
  currentText: string;
  maxChars: number;
  context?: {
    education?: string;
    experience?: string;
    qualifications?: string;
  };
}

const SYSTEM = `あなたは日本の新卒・中途採用の就職活動を支援する、経験豊富なキャリアアドバイザーです。
履歴書・自己紹介書（自己PR、志望動機、ガクチカ、自己分析など）の作成を手伝います。

重要な原則:
- 日本のビジネス文書として自然で、敬体（です・ます調）または常体を一貫して使う。
- 「結論 → 具体的なエピソード → 結果・学び → 入社後にどう活かすか」の構成を意識する。
- 抽象的な美辞麗句を避け、具体的な行動と数字で語る。
- 指定された文字数の8割以上を埋められる分量を目安にする。
- 嘘や誇張はせず、ユーザーが提供した経歴に基づいて書く。情報が足りない場合は、本人が埋められる [ ] のプレースホルダを使う。`;

function buildPrompt(body: Body): string {
  const ctx = body.context;
  const ctxText = [
    ctx?.education && `学歴: ${ctx.education}`,
    ctx?.experience && `職歴・経験: ${ctx.experience}`,
    ctx?.qualifications && `資格: ${ctx.qualifications}`,
  ]
    .filter(Boolean)
    .join('\n');

  const ctxBlock = ctxText
    ? `\n\n応募者の経歴情報:\n${ctxText}`
    : '\n\n（応募者の経歴情報はまだ入力されていません。一般的な型と、本人が埋めるプレースホルダを提示してください。）';

  if (body.mode === 'ideas') {
    return `「${body.essayTitle}」という設問（${body.maxChars}字以内）について、書くべき切り口・アイデアを3〜4個、箇条書きで提案してください。各アイデアには「どんなエピソードを使えるか」「何をアピールできるか」を一言添えてください。${ctxBlock}`;
  }
  if (body.mode === 'improve') {
    return `以下は「${body.essayTitle}」（${body.maxChars}字以内）の現在の下書きです。日本の採用担当者の視点で、より説得力のある文章に推敲してください。構成・具体性・読みやすさを改善し、完成版の本文のみを返してください。\n\n現在の下書き:\n"""\n${body.currentText || '(空欄)'}\n"""${ctxBlock}`;
  }
  // draft
  return `「${body.essayTitle}」という設問（${body.maxChars}字以内）について、そのまま提出できる完成度の高い文章を1つ作成してください。本文のみを返し、前置きや説明は不要です。${ctxBlock}`;
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'AI helper is not configured (missing ANTHROPIC_API_KEY).' }),
      { status: 503, headers: { 'content-type': 'application/json' } }
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (!body.essayTitle) {
    return new Response(JSON.stringify({ error: 'Missing essay title.' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const client = new Anthropic();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        const messageStream = client.messages.stream({
          model: 'claude-opus-4-8',
          max_tokens: 2048,
          thinking: { type: 'adaptive' },
          system: SYSTEM,
          messages: [{ role: 'user', content: buildPrompt(body) }],
        });

        for await (const event of messageStream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'AI request failed.';
        controller.enqueue(encoder.encode(`\n\n[エラー] ${msg}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}
