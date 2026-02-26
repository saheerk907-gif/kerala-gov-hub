export default function KsrPage() {
  return (
    <div className="min-h-screen bg-[#111] text-white p-10">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-4xl font-bold text-blue-400 mb-6">കേരള സർവ്വീസ് ചട്ടങ്ങൾ (KSR)</h1>
        
        <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-white/[0.08]">
          <p className="text-gray-300 mb-4 leading-relaxed">
            കേരള സർക്കാർ ജീവനക്കാരുടെ നിയമനം, ശമ്പളം, അവധി, അലവൻസ്, പെൻഷൻ തുടങ്ങിയ കാര്യങ്ങൾ നിയന്ത്രിക്കുന്ന ചട്ടങ്ങളാണ് KSR (Kerala Service Rules).
          </p>
          
          <ul className="list-disc ml-5 text-gray-400 space-y-2 mt-6">
            <li><strong>Part I & II:</strong> ശമ്പളം, അവധി, അലവൻസുകൾ, ജോയിനിംഗ് ടൈം</li>
            <li><strong>Part III:</strong> പെൻഷൻ സംബന്ധമായ കാര്യങ്ങൾ</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
