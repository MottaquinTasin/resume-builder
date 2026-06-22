import { createClient } from '@/lib/supabase/server';
import Navbar from '@/components/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import TemplatesPreview from '@/components/landing/TemplatesPreview';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/landing/Footer';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <main className="flex-1">
        <Hero />
        <Features />
        <TemplatesPreview />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
