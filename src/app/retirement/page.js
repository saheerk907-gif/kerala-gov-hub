import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RetirementCalculator from '@/components/RetirementCalculator';

export default function RetirementPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-aurora text-white pt-[100px]">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex items-center gap-2 text-xs text-white/60 mb-8">
            <a href="/" className="hover:text-white transition-colors no-underline text-white/60">Home</a>
            <span>›</span>
            <span className="text-[#30d158]">Retirement Calculator</span>
          </div>
          <RetirementCalculator />
        </div>
      </main>
      <Footer />
    </>
  );
}
