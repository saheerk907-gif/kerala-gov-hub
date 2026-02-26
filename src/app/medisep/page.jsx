import { supabase } from '@/lib/supabase'; // നിങ്ങളുടെ supabase കസ്റ്റം ഫയൽ

export default async function MedisepPage() {
  // ഡാറ്റാബേസിൽ നിന്ന് മെഡിസെപ്പ് വിവരങ്ങൾ എടുക്കുന്നു
  const { data: scheme } = await supabase
    .from('schemes')
    .select('*')
    .eq('slug', 'medisep')
    .single();

  if (!scheme) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-[#111] text-white p-10">
      <h1 className="text-4xl font-bold text-green-400">{scheme.title}</h1>
      <p className="mt-4 text-gray-300">{scheme.description}</p>
      
      {/* PDF ബട്ടൺ */}
      <a href={scheme.pdf_url} target="_blank" className="mt-6 inline-block bg-green-600 p-3 rounded">
        PDF വായിക്കുക
      </a>

      {/* FAQ സെക്ഷൻ - ഡാറ്റാബേസിൽ നിന്ന് വരുന്നത് */}
      <div className="mt-10">
        {scheme.faq.map((item, index) => (
          <div key={index} className="mb-4 p-4 bg-[#1a1a1a] rounded">
            <h3 className="font-bold">{item.question}</h3>
            <p className="text-gray-400">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
