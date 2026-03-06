import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function NewsDetailPage({ params }) {
  const { id } = params;
  
  const { data: item, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !item) {
    return <div className="p-20 text-center">വാർത്ത കണ്ടെത്താനായില്ല!</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-[800px] mx-auto py-20 px-6">
        <h1 className="text-4xl font-black text-gray-900 mb-6 leading-tight">
          {item.title_ml}
        </h1>
        
        {/* സമ്മറി */}
        <div className="text-xl text-gray-600 mb-8 font-medium border-l-4 border-red-500 pl-4">
          {item.summary_ml}
        </div>

        {/* മെയിൻ കണ്ടന്റ് */}
        <div className="prose prose-lg text-gray-800 leading-relaxed">
          {item.content_ml ? (
            <div dangerouslySetInnerHTML={{ __html: item.content_ml }} />
          ) : (
            <p className="text-gray-400 italic text-sm">വിശദാംശങ്ങൾ ലഭ്യമല്ല.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
