import { supabase } from '@/lib/supabase';

export default async function MedisepPage() {
  // Supabase-ൽ നിന്ന് മെഡിസെപ്പ് വിവരങ്ങൾ എടുക്കുന്നു
  const { data: scheme, error } = await supabase
    .from('schemes')
    .select('*')
    .eq('slug', 'medisep')
    .single();

  if (error || !scheme) {
    return <div className="p-10 text-white">വിവരങ്ങൾ ലഭ്യമായില്ല. അഡ്മിൻ പാനലിൽ 'medisep' എന്ന slug ഉണ്ടെന്ന് ഉറപ്പുവരുത്തുക.</div>;
  }

  return (
    <div className="min-h-screen bg-[#111] text-white p-6 md:p-10">
      <div className="max-w-[1000px] mx-auto">
        <h1 className="text-4xl font-bold text-green-400 mb-6">
          {scheme.title_ml || 'മെഡിസെപ്പ് (MEDISEP)'}
        </h1>
        
        {/* Intro & PDF Section */}
        <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-white/[0.08] mb-10">
          <p className="text-gray-300 mb-6 leading-relaxed whitespace-pre-wrap">
            {scheme.description_ml || "കേരള സർക്കാർ ജീവനക്കാർക്കും പെൻഷൻകാർക്കുമുള്ള ആരോഗ്യ ഇൻഷുറൻസ് പദ്ധതിയാണിത്."}
          </p>
          
          <a 
            href="/GO(P)No13-2026-FinDated02-02-2026_45.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            സർക്കാർ ഉത്തരവ് (PDF) വായിക്കുക 📄
          </a>
        </div>

        {/* Content Section - അഡ്മിൻ പാനലിൽ നൽകുന്ന FAQ ഇവിടെ വരും */}
        {scheme.content_ml && (
          <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-white/[0.08]">
            <div className="prose prose-invert max-w-none whitespace-pre-wrap text-gray-300">
              {scheme.content_ml}
            </div>
          </div>
        )}

        {/* വിവരങ്ങൾ ലഭ്യമല്ലെങ്കിൽ മാത്രം കാണിക്കുന്ന മെസ്സേജ് */}
        {!scheme.content_ml && (
          <div className="text-gray-500 text-center py-10">
            കൂടുതൽ വിവരങ്ങൾ അഡ്മിൻ പാനൽ വഴി ഉടൻ അപ്‌ഡേറ്റ് ചെയ്യുന്നതാണ്.
          </div>
        )}
      </div>
    </div>
  );
}
