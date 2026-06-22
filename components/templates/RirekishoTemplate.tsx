import type { WorkspaceData } from '@/lib/types';

interface Props {
  ws: WorkspaceData;
}

const GENDER_JA: Record<string, string> = { male: '男性', female: '女性', other: 'その他', '': '' };
const CIRCLED = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];
const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

function parseYM(s: string): { year: string; month: string } {
  if (!s) return { year: '', month: '' };
  const t = s.trim();
  // YYYY-MM, YYYY/MM, YYYY年MM月
  let m = t.match(/(\d{4})\D+(\d{1,2})/);
  if (m) return { year: m[1], month: String(Number(m[2])) };
  // Month-name YYYY  (e.g. "Apr 2021")
  m = t.match(/([A-Za-z]{3,})\.?\s*(\d{4})/);
  if (m && MONTHS[m[1].slice(0, 3).toLowerCase()]) {
    return { year: m[2], month: String(MONTHS[m[1].slice(0, 3).toLowerCase()]) };
  }
  // YYYY only
  m = t.match(/(\d{4})/);
  if (m) return { year: m[1], month: '' };
  return { year: t, month: '' };
}

function age(dob: string): string {
  if (!dob) return '';
  const d = new Date(dob);
  if (isNaN(d.getTime())) return '';
  const now = new Date();
  let a = now.getFullYear() - d.getFullYear();
  const md = now.getMonth() - d.getMonth();
  if (md < 0 || (md === 0 && now.getDate() < d.getDate())) a--;
  return String(a);
}

function dateJa(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}年 ${d.getMonth() + 1}月 ${d.getDate()}日`;
}

const BORDER = '1px solid #000';

export default function RirekishoTemplate({ ws }: Props) {
  const p = ws.personal;
  const jp = ws.japanese;
  const accent = jp.accentColor;

  const td: React.CSSProperties = { border: BORDER, padding: '5px 7px', fontSize: 10.5, verticalAlign: 'top', lineHeight: 1.5 };
  const label: React.CSSProperties = {
    ...td, backgroundColor: '#eef0f3', fontWeight: 700, whiteSpace: 'nowrap',
    textAlign: 'center', verticalAlign: 'middle',
  };

  // 学歴・職歴 rows
  type Row = { y: string; m: string; text: string; head?: boolean; end?: boolean };
  const history: Row[] = [];
  history.push({ y: '', m: '', text: '学　歴', head: true });
  for (const e of ws.education) {
    const a = parseYM(e.startDate), b = parseYM(e.endDate);
    if (e.startDate) history.push({ y: a.year, m: a.month, text: `${e.school}　${e.field}　入学` });
    if (e.endDate) history.push({ y: b.year, m: b.month, text: `${e.school}　${e.field}　卒業` });
  }
  history.push({ y: '', m: '', text: '職　歴', head: true });
  if (ws.experience.length === 0) history.push({ y: '', m: '', text: 'なし' });
  for (const x of ws.experience) {
    const a = parseYM(x.startDate), b = parseYM(x.endDate);
    if (x.startDate) history.push({ y: a.year, m: a.month, text: `${x.company}　入社` });
    if (x.title) history.push({ y: '', m: '', text: `　${x.title}` });
    if (x.current) history.push({ y: '', m: '', text: '現在に至る' });
    else if (x.endDate) history.push({ y: b.year, m: b.month, text: '一身上の都合により退社' });
  }
  history.push({ y: '', m: '', text: '以上', end: true });

  return (
    <div style={{ fontFamily: "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'MS Gothic', sans-serif", color: '#111', lineHeight: 1.5 }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '0.5em', color: accent }}>履　歴　書</h1>
        <span style={{ fontSize: 10.5 }}>{dateJa(jp.rirekishoDate)}現在</span>
      </div>

      {/* Profile */}
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <colgroup>
          <col style={{ width: 78 }} />
          <col />
          <col style={{ width: 72 }} />
          <col style={{ width: 120 }} />
          <col style={{ width: 96 }} />
        </colgroup>
        <tbody>
          <tr>
            <td style={label}>フリガナ</td>
            <td style={{ ...td, fontSize: 9, color: '#555', verticalAlign: 'middle' }} colSpan={3}>{p.furigana}</td>
            <td style={{ ...td, textAlign: 'center', verticalAlign: 'middle' }} rowSpan={5}>
              {p.photoDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.photoDataUrl} alt="証明写真" style={{ width: 84, height: 112, objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 84, height: 112, border: '1px dashed #999', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: '#999', textAlign: 'center', margin: '0 auto' }}>
                  写真<br />40×30mm
                </div>
              )}
            </td>
          </tr>
          <tr>
            <td style={label}>氏　名</td>
            <td style={{ ...td, fontSize: 17, fontWeight: 700, verticalAlign: 'middle' }} colSpan={3}>{p.fullNameJa || p.fullName}</td>
          </tr>
          <tr>
            <td style={label}>生年月日</td>
            <td style={{ ...td, verticalAlign: 'middle' }}>{dateJa(p.dateOfBirth)}{age(p.dateOfBirth) && `（満 ${age(p.dateOfBirth)} 歳）`}</td>
            <td style={label}>性　別</td>
            <td style={{ ...td, verticalAlign: 'middle' }}>{GENDER_JA[p.gender]}</td>
          </tr>
          <tr>
            <td style={label}>国　籍</td>
            <td style={{ ...td, verticalAlign: 'middle' }}>{p.nationality}</td>
            <td style={label}>電　話</td>
            <td style={{ ...td, verticalAlign: 'middle' }}>{p.phone}</td>
          </tr>
          <tr>
            <td style={label}>現住所</td>
            <td style={td} colSpan={3}>
              <div style={{ fontSize: 9, color: '#555' }}>{p.addressFurigana}</div>
              <div>〒{p.postalCode}</div>
              <div>{p.addressJa}</div>
            </td>
          </tr>
          <tr>
            <td style={label}>E-mail</td>
            <td style={{ ...td, verticalAlign: 'middle' }} colSpan={2}>{p.email}</td>
            <td style={label}>緊急連絡先</td>
            <td style={{ ...td, verticalAlign: 'middle' }}>{jp.emergencyContact}</td>
          </tr>
        </tbody>
      </table>

      {/* 学歴・職歴 */}
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', marginTop: 10 }}>
        <colgroup>
          <col style={{ width: 64 }} />
          <col style={{ width: 40 }} />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th style={label}>年</th>
            <th style={label}>月</th>
            <th style={label}>学 歴 ・ 職 歴</th>
          </tr>
        </thead>
        <tbody>
          {history.map((r, i) => (
            <tr key={i}>
              <td style={{ ...td, textAlign: 'center' }}>{r.y}</td>
              <td style={{ ...td, textAlign: 'center' }}>{r.m}</td>
              <td style={{ ...td, textAlign: r.head ? 'center' : r.end ? 'right' : 'left', fontWeight: r.head ? 700 : 400 }}>{r.text}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 保有資格・スキル */}
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', marginTop: 10 }}>
        <colgroup>
          <col style={{ width: 104 }} />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th style={label}>年 月</th>
            <th style={label}>免許 ・ 資格 ・ スキル</th>
          </tr>
        </thead>
        <tbody>
          {jp.qualifications.length === 0 ? (
            <tr><td style={{ ...td, textAlign: 'center' }} /><td style={td}>特になし</td></tr>
          ) : (
            jp.qualifications.map((q) => (
              <tr key={q.id}>
                <td style={{ ...td, textAlign: 'center' }}>{q.date}</td>
                <td style={td}>{q.name}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 趣味・特技 */}
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', marginTop: 10 }}>
        <colgroup><col style={{ width: 104 }} /><col /></colgroup>
        <tbody>
          <tr>
            <td style={{ ...label, verticalAlign: 'middle' }}>趣味・特技</td>
            <td style={td}>{jp.hobbies}</td>
          </tr>
        </tbody>
      </table>

      {/* 通勤・扶養・配偶者 / 本人希望 */}
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', marginTop: 10 }}>
        <colgroup>
          <col style={{ width: 84 }} /><col /><col style={{ width: 84 }} /><col style={{ width: 70 }} />
          <col style={{ width: 70 }} /><col style={{ width: 60 }} />
        </colgroup>
        <tbody>
          <tr>
            <td style={{ ...label, verticalAlign: 'middle' }}>通勤時間</td>
            <td style={{ ...td, verticalAlign: 'middle' }}>{jp.commute}</td>
            <td style={{ ...label, verticalAlign: 'middle' }}>扶養家族</td>
            <td style={{ ...td, verticalAlign: 'middle' }}>{jp.dependents}</td>
            <td style={{ ...label, verticalAlign: 'middle' }}>配偶者</td>
            <td style={{ ...td, verticalAlign: 'middle', textAlign: 'center' }}>{jp.spouse === 'yes' ? '有' : jp.spouse === 'no' ? '無' : ''}</td>
          </tr>
          <tr>
            <td style={{ ...label, verticalAlign: 'middle' }}>本人希望<br />記入欄</td>
            <td style={td} colSpan={5}>{jp.requests}</td>
          </tr>
        </tbody>
      </table>

      {/* 自己紹介書 / エントリーシート */}
      {jp.essays.length > 0 && (
        <>
          <h2 style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.3em', color: accent, marginTop: 22, marginBottom: 10, borderTop: `2px solid ${accent}`, paddingTop: 10 }}>
            自 己 紹 介 書
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {jp.essays.map((es, i) => (
              <div key={es.id} style={{ border: BORDER }}>
                <div style={{ backgroundColor: '#eef0f3', borderBottom: BORDER, padding: '5px 8px', fontSize: 11, fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span>{CIRCLED[i] ?? ''} {es.title}</span>
                  <span style={{ fontWeight: 400, color: '#666', fontSize: 9 }}>（{es.maxChars}字以内）</span>
                </div>
                <div style={{ padding: 8, fontSize: 10.5, minHeight: 76, whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{es.body}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
