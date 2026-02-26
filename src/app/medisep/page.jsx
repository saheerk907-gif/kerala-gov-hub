export default function MedisepPage() {
  return (
    <div className="min-h-screen bg-[#111] text-white p-6 md:p-10">
      <div className="max-w-[1000px] mx-auto">
        <h1 className="text-4xl font-bold text-green-400 mb-6">മെഡിസെപ്പ് (MEDISEP)</h1>
        
        {/* Intro & PDF Section */}
        <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-white/[0.08] mb-10">
          <p className="text-gray-300 mb-6 leading-relaxed">
            [cite_start]കേരള സർക്കാർ ജീവനക്കാർക്കും പെൻഷൻകാർക്കുമുള്ള ആരോഗ്യ ഇൻഷുറൻസ് പദ്ധതിയാണിത്. [cite: 7]
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

        {/* FAQ Section */}
        <h2 className="text-2xl font-bold text-green-300 mb-6 border-b border-white/[0.1] pb-4">
          MEDISEP Phase II – സർക്കാർ ജീവനക്കാർക്കുള്ള FAQ (2026 അപ്ഡേറ്റ്)
        </h2>
        
        <div className="space-y-4">
          <div className="bg-[#1a1a1a] p-5 rounded-xl border border-white/[0.05]">
            <h3 className="font-bold text-white mb-2">1) MEDISEP എന്താണ്?</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              കേരള സർക്കാർ ജീവനക്കാരും പെൻഷൻക്കാരും ഉൾപ്പെടുന്ന ആരോഗ്യ ഇൻഷുറൻസ് പദ്ധതി. എമ്പാനൽ ചെയ്ത ആശുപത്രികളിൽ ക്യാഷ്‌ലെസ് ചികിത്സ ലഭിക്കും.
            </p>
          </div>

          <div className="bg-[#1a1a1a] p-5 rounded-xl border border-white/[0.05]">
            <h3 className="font-bold text-white mb-2">2) 2026 ലെ പുതിയ മാറ്റം എന്താണ്?</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              [cite_start]02-02-2026 ലെ സർക്കാർ ഉത്തരവ് (G.O.(P) No.13/2026/Fin) പ്രകാരം മൂന്ന് തലത്തിലുള്ള പരാതി പരിഹാര സംവിധാനം (Grievance Redressal) നടപ്പാക്കി. [cite: 4, 7]
            </p>
          </div>

          <div className="bg-[#1a1a1a] p-5 rounded-xl border border-white/[0.05]">
            <h3 className="font-bold text-white mb-2">3) പരാതി ആദ്യം എവിടെ നൽകണം?</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              [cite_start]ആദ്യം ഇൻഷുറൻസ് കമ്പനിയിലൂടെയാണ് പരാതി നൽകേണ്ടത് (Call Centre / MEDISEP വെബ്സൈറ്റ് വഴി). [cite: 7]
            </p>
          </div>

          <div className="bg-[#1a1a1a] p-5 rounded-xl border border-white/[0.05]">
            <h3 className="font-bold text-white mb-2">4) പരാതി നൽകാനുള്ള സമയപരിധി എത്ര?</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              [cite_start]ആശുപത്രി ഡിസ്ചാർജിന് ശേഷം 30 ദിവസത്തിനകം പരാതി നൽകണം. [cite: 7]
            </p>
          </div>

          {/* കൂടുതൽ ചോദ്യങ്ങൾ ഇവിടെ ചേർക്കാം... */}

          <div className="bg-green-900/20 p-6 rounded-xl border border-green-500/30 mt-6">
            <h3 className="font-bold text-lg text-green-400 mb-3">സർക്കാർ ജീവനക്കാർ ശ്രദ്ധിക്കാൻ:</h3>
            <ul className="list-disc ml-6 text-gray-300 space-y-1">
              <li>ഡിസ്ചാർജ് സമ്മറി സൂക്ഷിക്കുക</li>
              <li>30 ദിവസത്തെ സമയപരിധി പാലിക്കുക</li>
              <li>പരാതി നൽകുമ്പോൾ ലഭിക്കുന്ന Ticket ID സൂക്ഷിക്കുക</li>
              <li>ആവശ്യമായാൽ അടുത്ത ഘട്ടങ്ങളിൽ അപ്പീൽ ചെയ്യുക</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
