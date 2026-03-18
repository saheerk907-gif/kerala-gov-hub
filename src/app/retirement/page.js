import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RetirementCalculator from '@/components/RetirementCalculator';

export const metadata = {
  title: 'Retirement Calculator — Kerala Government Employees | Countdown, Pension, DCRG',
  description:
    'Calculate your retirement date, countdown, LPR start date, monthly pension, DCRG and leave encashment. Supports both traditional pension (pre-2013) and NPS subscribers.',
  alternates: { canonical: 'https://keralaemployees.in/retirement' },
  keywords:
    'retirement calculator Kerala, Kerala government retirement date, pension calculator Kerala, DCRG calculator, LPR leave preparatory to retirement, NPS retirement Kerala',
};

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
