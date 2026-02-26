export default function MedisepPage() {
  return (
    <div className="min-h-screen bg-[#111] text-white p-10">
      <h1 className="text-4xl font-bold text-green-400">മെഡിസെപ്പ് (MEDISEP)</h1>
      <p className="mt-5 text-gray-300">
        കേരള സർക്കാർ ജീവനക്കാർക്കും പെൻഷൻകാർക്കുമുള്ള ആരോഗ്യ ഇൻഷുറൻസ് പദ്ധതിയാണിത്.
      </p>
    </div>
  );
}
import Link from 'next/link'; // ഇത് പേജിന്റെ ഏറ്റവും മുകളിൽ കൊടുക്കണം

// ... മെഡിസെപ്പ് കാർഡിന്റെ കോഡിനുള്ളിൽ ...
<Link href="/medisep">
  വിശദമായി കാണുക
</Link>
<a href="/GO(P)No13-2026-FinDated02-02-2026_45.pdf" target="_blank" className="mt-6 inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-colors">
  PDF വായിക്കുക / ഡൗൺലോഡ് ചെയ്യുക 📄
</a>
