export default function MedisepPage() {
  return (
    <div className="min-h-screen bg-[#111] text-white p-10">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-4xl font-bold text-green-400 mb-6">മെഡിസെപ്പ് (MEDISEP)</h1>
        
        <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-white/[0.08]">
          <p className="text-gray-300 mb-6">
            കേരള സർക്കാർ ജീവനക്കാർക്കും പെൻഷൻകാർക്കുമുള്ള ആരോഗ്യ ഇൻഷുറൻസ് പദ്ധതിയാണിത്.
          </p>
          
          <a 
            href="/GO(P)No13-2026-FinDated02-02-2026_45.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-4 inline-block bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            PDF വായിക്കുക / ഡൗൺലോഡ് ചെയ്യുക 📄
          </a>
        </div>
      </div>
    </div>
  );
}
