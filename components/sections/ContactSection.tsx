'use client';

import { Input } from '@/components/ui/input';
import type { ContactData } from '@/lib/types';

interface Props {
  data: ContactData;
  onChange: (data: ContactData) => void;
}

export default function ContactSection({ data, onChange }: Props) {
  const set = (field: keyof ContactData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...data, [field]: e.target.value });

  return (
    <div className="space-y-2">
      <Input placeholder="Full Name" value={data.name} onChange={set('name')} />
      <div className="grid grid-cols-2 gap-2">
        <Input placeholder="Email" value={data.email} onChange={set('email')} />
        <Input placeholder="Phone" value={data.phone} onChange={set('phone')} />
      </div>
      <Input placeholder="Location (City, State)" value={data.location} onChange={set('location')} />
      <Input placeholder="Website" value={data.website} onChange={set('website')} />
      <div className="grid grid-cols-2 gap-2">
        <Input placeholder="LinkedIn URL" value={data.linkedin} onChange={set('linkedin')} />
        <Input placeholder="GitHub URL" value={data.github} onChange={set('github')} />
      </div>
    </div>
  );
}
