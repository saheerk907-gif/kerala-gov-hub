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

          <div className="mb-8">
            <div className="text-[10px] font-black uppercase tracking-widest text-[#2997ff] mb-2">Kerala Government · Finance Department</div>
            <h1 className="text-[clamp(24px,4vw,40px)] font-[900] tracking-[-0.03em] leading-tight mb-3 text-white">
              12th PRC Pay Revision Calculator
            </h1>
            <p className="text-[14px] text-white/65 leading-relaxed mb-2">
              Calculate your revised Basic Pay under the 12th Pay Revision Commission (PRC) recommendations for Kerala government employees, effective from 01.07.2024. Enter your current Basic Pay under the 11th PRC (2019) scale to get your new revised pay, fitment benefit, and incremental progression in the new scale.
            </p>
            <p className="text-[13px] text-white/50 leading-relaxed" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              12-ആം ശമ്പള പുനരീക്ഷണ കമ്മീഷൻ ശുപാർശ പ്രകാരം 2024 ജൂലൈ 1 മുതൽ ബാധകമാകുന്ന ഭേദഗതി ചെയ്ത ശമ്പളം കണക്കാക്കുക.
            </p>
          </div>

          <PayCalculator />
        </div>
      </main>
      <Footer />
    </>
  );
}
