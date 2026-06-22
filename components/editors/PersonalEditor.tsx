'use client';

import { Input } from '@/components/ui/input';
import { Upload, X } from 'lucide-react';
import type { SharedPersonal, ResumeView, Gender } from '@/lib/types';

interface Props {
  data: SharedPersonal;
  view: ResumeView;
  onChange: (data: SharedPersonal) => void;
}

export default function PersonalEditor({ data, view, onChange }: Props) {
  const set = (field: keyof SharedPersonal) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...data, [field]: e.target.value });

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ ...data, photoDataUrl: String(reader.result) });
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <Input placeholder="Full Name (English)" value={data.fullName} onChange={set('fullName')} />
      <div className="grid grid-cols-2 gap-2">
        <Input placeholder="Email" value={data.email} onChange={set('email')} />
        <Input placeholder="Phone" value={data.phone} onChange={set('phone')} />
      </div>

      {view === 'english' ? (
        <>
          <Input placeholder="Location (City, Country)" value={data.location} onChange={set('location')} />
          <Input placeholder="Website" value={data.website} onChange={set('website')} />
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="LinkedIn URL" value={data.linkedin} onChange={set('linkedin')} />
            <Input placeholder="GitHub URL" value={data.github} onChange={set('github')} />
          </div>
        </>
      ) : (
        <>
          <Input placeholder="ふりがな（氏名の読み）" value={data.furigana} onChange={set('furigana')} />
          <Input placeholder="氏名（漢字・カナ）" value={data.fullNameJa} onChange={set('fullNameJa')} />
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="生年月日" type="date" value={data.dateOfBirth} onChange={set('dateOfBirth')} />
            <select
              value={data.gender}
              onChange={(e) => onChange({ ...data, gender: e.target.value as Gender })}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">性別（任意）</option>
              <option value="male">男</option>
              <option value="female">女</option>
              <option value="other">その他</option>
            </select>
          </div>
          <Input placeholder="国籍" value={data.nationality} onChange={set('nationality')} />
          <Input placeholder="郵便番号（〒）" value={data.postalCode} onChange={set('postalCode')} />
          <Input placeholder="住所のふりがな" value={data.addressFurigana} onChange={set('addressFurigana')} />
          <Input placeholder="現住所" value={data.addressJa} onChange={set('addressJa')} />

          {/* Photo */}
          <div className="flex items-center gap-3 pt-1">
            {data.photoDataUrl ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={data.photoDataUrl} alt="証明写真" className="w-12 h-16 object-cover rounded border border-border" />
                <button
                  onClick={() => onChange({ ...data, photoDataUrl: '' })}
                  className="absolute -top-1.5 -right-1.5 bg-destructive text-white rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="w-12 h-16 rounded border border-dashed border-border flex items-center justify-center text-[8px] text-muted-foreground text-center">
                証明写真
              </div>
            )}
            <label className="flex items-center gap-1.5 text-xs cursor-pointer rounded-md border border-border px-3 py-2 hover:bg-muted">
              <Upload className="h-3.5 w-3.5" />
              写真をアップロード
              <input type="file" accept="image/*" className="hidden" onChange={onPhoto} />
            </label>
          </div>
        </>
      )}
    </div>
  );
}
