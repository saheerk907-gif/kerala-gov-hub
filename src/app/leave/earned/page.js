import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LeaveCalculator from '@/components/LeaveCalculator';

export const metadata = {
  title: 'Earned Leave Calculator — Kerala Service Rules (KSR) | Kerala Government Employees',
  description:
    'Calculate Earned Leave (EL) for Kerala government employees as per KSR Part I. Supports permanent, temporary, vacation department and limited-period officers. Includes KSR FAQ on Maternity Leave, Casual Leave, Half-Pay Leave, Subsistence Allowance, and more.',
  alternates: { canonical: 'https://keralaemployees.in/leave/earned' },
};

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
