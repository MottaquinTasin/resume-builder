# Setup

The app runs with **zero configuration** in guest mode (resumes save to the
browser). To enable accounts, cloud save, and the AI helper, add the env vars
below — locally in `.env.local` and in Vercel (Settings → Environment
Variables), then redeploy.

## 1. Accounts + cloud save (Supabase)

1. Create a free project at [supabase.com](https://supabase.com).
2. **SQL Editor → New query** → paste [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
3. **Project Settings → API**, copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Authentication → URL Configuration → Redirect URLs**: add
   `https://<your-vercel-domain>/auth/callback` (and
   `http://localhost:3000/auth/callback` for local dev).

The `anon` key is safe to expose in the browser (RLS restricts each user to
their own rows). Never put the `service_role` key in this app.

## 2. AI helper (Anthropic)

Add `ANTHROPIC_API_KEY` from [console.anthropic.com](https://console.anthropic.com).
Without it, `/api/ai-suggest` returns a graceful "not configured" response.

## Local dev

```bash
cp .env.example .env.local   # fill in the values
npm install
npm run dev
```
