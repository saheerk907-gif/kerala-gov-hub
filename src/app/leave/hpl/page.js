import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HPLCalculator from '@/components/HPLCalculator';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Half Pay Leave Rules — Kerala Government Employees',
  description: 'Kerala government employee HPL rules — half pay leave accumulation, commutation to earned leave, medical grounds, LPR. KSR Part I provisions.',
  path: '/leave/hpl',
  keywords: ['HPL half pay leave Kerala', 'half pay leave rules Kerala', 'HPL commutation Kerala', 'KSR HPL provisions'],
});

export default function HPLPage() {
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
            <span className="text-[#64d2ff]">HPL & Commuted Leave</span>
          </div>
          <HPLCalculator />
        </div>
      </main>
      <Footer />
    </>
  );
}
