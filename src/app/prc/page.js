import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PayCalculator from '@/components/PayCalculator';

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
