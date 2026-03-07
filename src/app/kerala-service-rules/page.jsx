import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { buildMetadata } from '@/lib/seo';

export const revalidate = 60;

export const metadata = buildMetadata({
  title: 'Kerala Service Rules — Leave, Pay & Pension',
  description: 'Kerala Service Rules (KSR) for government employees — leave entitlement, pay rules, pension, disciplinary proceedings, and service conditions.',
  path: '/kerala-service-rules',
  keywords: ['Kerala Service Rules', 'Kerala government leave rules', 'KSR pension', 'Kerala pay rules'],
});

export default async function KsrPage() {
  const { data: pageData } = await supabase
    .from('schemes')
    .select('*')
    .eq('slug', 'ksr')
    .single();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <div className="relative pt-32 pb-20 px-6 overflow-hidden" 
             style={{ background: 'linear-gradient(135deg, #001228 0%, #000a1a 60%, #000 100%)' }}>
          
          <div className="absolute inset-0 opacity-30" 
               style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, #2997ff30, transparent)' }} />
          
          <div className="relative max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight animate-fade-up">
              {pageData?.title || 'Kerala Service Rules'}
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-up animate-fade-up-delay-1">
              {pageData?.description || 'KSR സംബന്ധിച്ച എല്ലാ വിവരങ്ങളും ഇവിടെ ലഭ്യമാണ്.'}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
