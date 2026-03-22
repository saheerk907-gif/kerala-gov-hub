import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PayCalculator from '@/components/PayCalculator';

export const metadata = {
  title: '12th PRC Calculator — Kerala Pay Revision 2024',
  description: 'Calculate your revised salary under the 12th Pay Revision Commission (PRC) for Kerala government employees. Fitment, DA, and new basic pay calculation.',
  alternates: { canonical: 'https://keralaemployees.in/prc' },
  keywords: '12th PRC calculator, Kerala pay revision 2024, PRC salary calculator, Kerala PRC fitment',
  openGraph: {
    title: '12th PRC Calculator — Kerala Pay Revision 2024',
    description: 'Calculate revised salary under 12th PRC for Kerala government employees.',
    url: 'https://keralaemployees.in/prc',
  },
};

export default function PrcPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-aurora text-white pt-[100px]">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex items-center gap-2 text-xs text-white/60 mb-8">
            <a href="/" className="hover:text-white transition-colors no-underline text-white/60 hover:text-white">Home</a>
            <span>›</span>
            <span className="text-[#2997ff]">12th PRC Calculator</span>
          </div>
          <PayCalculator />
        </div>
      </main>
      <Footer />
    </>
  );
}
