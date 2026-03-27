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
          <LeaveCalculator />
        </div>
      </main>
      <Footer />
    </>
  );
}
