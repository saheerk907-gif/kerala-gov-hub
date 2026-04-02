import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LeaveCalculator from '@/components/LeaveCalculator';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Kerala Govt Earned Leave Rules | KSR Part I Guides',
  description: 'Kerala government employee earned leave rules — accumulation limit, encashment, leave at credit calculation, EL surrender. KSR provisions explained.',
  path: '/leave/earned',
  keywords: ['earned leave Kerala', 'EL rules Kerala government', 'leave encashment Kerala', 'KSR earned leave', 'leave at credit Kerala'],
});

export default function EarnedLeavePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-aurora text-white pt-[100px]">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex items-center gap-2 text-xs text-white/60 mb-8">
            <a href="/" className="hover:text-white transition-colors no-underline text-white/60">Home</a>
            <span>›</span>
            <a href="/ksr" className="hover:text-white transition-colors no-underline text-white/60">Kerala Service Rules</a>
            <span>›</span>
            <a href="/leave" className="hover:text-white transition-colors no-underline text-white/60">Leave Calculator</a>
            <span>›</span>
            <span className="text-[#ff9f0a]">Earned Leave</span>
          </div>

          <div className="mb-8">
            <h1 className="text-[clamp(24px,4vw,40px)] font-[900] tracking-[-0.03em] leading-tight mb-3 text-white">
              Earned Leave Calculator — Kerala Government Employees
            </h1>
            <p className="text-[14px] text-white/65 leading-relaxed mb-2">
              Calculate your Earned Leave (EL) balance, surrender value, and encashment amount as per Kerala Service Rules (KSR) Part I. Earned Leave accrues at 1/11th of duty days, subject to a maximum accumulation of 300 days. EL can be surrendered for cash payment (encashment) at the time of retirement or availed as leave with full pay during service.
            </p>
            <p className="text-[13px] text-white/50 leading-relaxed" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              KSR Part I അനുസരിച്ചുള്ള Earned Leave ബാലൻസ്, Encashment തുക, Leave Surrender ആനുകൂല്യം — ഇവ കണക്കാക്കാൻ ഈ കാൽക്കുലേറ്റർ ഉപയോഗിക്കുക.
            </p>
          </div>

          <LeaveCalculator />
        </div>
      </main>
      <Footer />
    </>
  );
}
