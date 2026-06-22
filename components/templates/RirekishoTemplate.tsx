import type { WorkspaceData } from '@/lib/types';

interface Props {
  ws: WorkspaceData;
}

const GENDER_JA: Record<string, string> = {
  male: '男',
  female: '女',
  other: 'その他',
  '': '',
};

function calcAge(dob: string): string {
  if (!dob) return '';
  const d = new Date(dob);
  if (isNaN(d.getTime())) return '';
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return String(age);
}

function fmtDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}年 ${d.getMonth() + 1}月 ${d.getDate()}日`;
}

const cell: React.CSSProperties = {
  border: '1px solid #333',
  padding: '4px 6px',
  fontSize: 10,
  verticalAlign: 'top',
};
const labelCell: React.CSSProperties = {
  ...cell,
  backgroundColor: '#f3f4f6',
  fontWeight: 600,
  whiteSpace: 'nowrap',
  width: 80,
};

export default function RirekishoTemplate({ ws }: Props) {
  const p = ws.personal;
  const jp = ws.japanese;
  const accent = jp.accentColor;

  // Build 学歴・職歴 rows (chronological table)
  const historyRows: { date: string; text: string; head?: boolean }[] = [];
  historyRows.push({ date: '', text: '学　歴', head: true });
  for (const e of ws.education) {
    if (e.startDate) historyRows.push({ date: e.startDate, text: `${e.school}　${e.field}　入学` });
    if (e.endDate) historyRows.push({ date: e.endDate, text: `${e.school}　${e.field}　卒業` });
  }
  historyRows.push({ date: '', text: '職　歴', head: true });
  for (const x of ws.experience) {
    if (x.startDate) historyRows.push({ date: x.startDate, text: `${x.company}　入社` });
    if (x.title) historyRows.push({ date: '', text: `　${x.title}` });
    if (x.current) historyRows.push({ date: '', text: '現在に至る' });
    else if (x.endDate) historyRows.push({ date: x.endDate, text: '一身上の都合により退社' });
  }
  historyRows.push({ date: '', text: '以上' });

  return (
    <div
      style={{
        fontFamily: "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', sans-serif",
        color: '#1a1a1a',
        lineHeight: 1.5,
      }}
    >
      {/* ===== 履歴書 ===== */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.4em', color: accent }}>履 歴 書</h1>
        <span style={{ fontSize: 10, color: '#444' }}>{fmtDate(jp.rirekishoDate)} 現在</span>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <tbody>
          {/* ふりがな + photo */}
          <tr>
            <td style={{ ...labelCell, width: 70 }}>ふりがな</td>
            <td style={cell} colSpan={2}>
              <span style={{ fontSize: 9, color: '#555' }}>{p.furigana}</span>
            </td>
            <td
              style={{ ...cell, width: 100, textAlign: 'center', verticalAlign: 'middle' }}
              rowSpan={4}
            >
              {p.photoDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.photoDataUrl} alt="証明写真" style={{ width: 90, height: 120, objectFit: 'cover' }} />
              ) : (
                <div
                  style={{
                    width: 90,
                    height: 120,
                    border: '1px dashed #aaa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 8,
                    color: '#aaa',
                    margin: '0 auto',
                    textAlign: 'center',
                  }}
                >
                  写真
                  <br />
                  40mm×30mm
                </div>
              )}
            </td>
          </tr>
          {/* 氏名 */}
          <tr>
            <td style={labelCell}>氏　名</td>
            <td style={{ ...cell, fontSize: 16, fontWeight: 700, verticalAlign: 'middle' }} colSpan={2}>
              {p.fullNameJa || p.fullName}
            </td>
          </tr>
          {/* 生年月日 / 性別 */}
          <tr>
            <td style={labelCell}>生年月日</td>
            <td style={{ ...cell, verticalAlign: 'middle' }}>
              {fmtDate(p.dateOfBirth)}
              {calcAge(p.dateOfBirth) && `（満 ${calcAge(p.dateOfBirth)} 歳）`}
            </td>
            <td style={{ ...cell, verticalAlign: 'middle', width: 90 }}>
              性別　{GENDER_JA[p.gender] || ''}
            </td>
          </tr>
          {/* 国籍 */}
          <tr>
            <td style={labelCell}>国　籍</td>
            <td style={{ ...cell, verticalAlign: 'middle' }} colSpan={2}>
              {p.nationality}
            </td>
          </tr>
          {/* 現住所 */}
          <tr>
            <td style={labelCell}>現住所</td>
            <td style={cell} colSpan={3}>
              <div style={{ fontSize: 9, color: '#555' }}>ふりがな：{p.addressFurigana}</div>
              <div>〒 {p.postalCode}</div>
              <div>{p.addressJa}</div>
            </td>
          </tr>
          {/* 連絡先 */}
          <tr>
            <td style={labelCell}>電話 / メール</td>
            <td style={cell} colSpan={3}>
              <div>TEL：{p.phone}</div>
              <div>E-mail：{p.email}</div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* 学歴・職歴 */}
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', marginTop: 10 }}>
        <thead>
          <tr>
            <th style={{ ...labelCell, width: 120, textAlign: 'center' }}>年 月</th>
            <th style={{ ...labelCell, textAlign: 'center' }}>学 歴 ・ 職 歴</th>
          </tr>
        </thead>
        <tbody>
          {historyRows.map((r, i) => (
            <tr key={i}>
              <td style={{ ...cell, textAlign: 'center', width: 120 }}>{r.date}</td>
              <td
                style={{
                  ...cell,
                  textAlign: r.head ? 'center' : r.text === '以上' ? 'right' : 'left',
                  fontWeight: r.head ? 700 : 400,
                }}
              >
                {r.text}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 免許・資格 */}
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', marginTop: 10 }}>
        <thead>
          <tr>
            <th style={{ ...labelCell, width: 120, textAlign: 'center' }}>年 月</th>
            <th style={{ ...labelCell, textAlign: 'center' }}>免 許 ・ 資 格</th>
          </tr>
        </thead>
        <tbody>
          {jp.qualifications.length === 0 ? (
            <tr>
              <td style={{ ...cell, textAlign: 'center' }}></td>
              <td style={cell}>特になし</td>
            </tr>
          ) : (
            jp.qualifications.map((q) => (
              <tr key={q.id}>
                <td style={{ ...cell, textAlign: 'center' }}>{q.date}</td>
                <td style={cell}>{q.name}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 通勤・扶養・配偶者・本人希望 */}
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', marginTop: 10 }}>
        <tbody>
          <tr>
            <td style={{ ...labelCell, width: 90 }}>通勤時間</td>
            <td style={cell}>{jp.commute}</td>
            <td style={{ ...labelCell, width: 110 }}>扶養家族</td>
            <td style={cell}>{jp.dependents}</td>
            <td style={{ ...labelCell, width: 70 }}>配偶者</td>
            <td style={cell}>{jp.spouse === 'yes' ? '有' : jp.spouse === 'no' ? '無' : ''}</td>
          </tr>
          <tr>
            <td style={labelCell}>本人希望記入欄</td>
            <td style={cell} colSpan={5}>
              {jp.requests}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ===== 自己紹介書 ===== */}
      {jp.essays.length > 0 && (
        <>
          <h2
            style={{
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: '0.3em',
              color: accent,
              marginTop: 24,
              marginBottom: 8,
              borderTop: `2px solid ${accent}`,
              paddingTop: 10,
            }}
          >
            自 己 紹 介 書
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {jp.essays.map((es) => (
              <div key={es.id} style={{ border: '1px solid #333' }}>
                <div
                  style={{
                    backgroundColor: '#f3f4f6',
                    borderBottom: '1px solid #333',
                    padding: '4px 8px',
                    fontSize: 11,
                    fontWeight: 700,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{es.title}</span>
                  <span style={{ fontWeight: 400, color: '#777', fontSize: 9 }}>（{es.maxChars}字以内）</span>
                </div>
                <div
                  style={{
                    padding: '8px',
                    fontSize: 10.5,
                    minHeight: 70,
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.7,
                  }}
                >
                  {es.body}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
