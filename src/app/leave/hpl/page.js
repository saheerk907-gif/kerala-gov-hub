import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HPLCalculator from '@/components/HPLCalculator';

export const metadata = {
  title: 'HPL & Commuted Leave Calculator — Kerala Service Rules (KSR) | Kerala Government Employees',
  description:
    'Calculate Half-Pay Leave (HPL) and Commuted Leave for Kerala government employees as per KSR Part I. Includes a "Can I take X days?" eligibility checker, LWA exclusion, and KSR leave rules reference.',
  alternates: { canonical: 'https://keralaemployees.in/leave/hpl' },
};

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
