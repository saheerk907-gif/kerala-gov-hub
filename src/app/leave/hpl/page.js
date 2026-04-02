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

          <div className="mb-8">
            <h1 className="text-[clamp(24px,4vw,40px)] font-[900] tracking-[-0.03em] leading-tight mb-3 text-white">
              Half Pay Leave (HPL) Calculator — Kerala Government Employees
            </h1>
            <p className="text-[14px] text-white/65 leading-relaxed mb-2">
              Calculate your Half Pay Leave (HPL) balance and commuted leave entitlement under Kerala Service Rules (KSR) Part I. HPL accrues at 20 days per completed year of service. Commuted Leave can be taken at full pay by debiting double the days from HPL credit — allowed up to 180 days in one spell on medical grounds. Use this calculator to find your HPL at credit and commutation options.
            </p>
            <p className="text-[13px] text-white/50 leading-relaxed" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              KSR Part I അനുസരിച്ചുള്ള Half Pay Leave ബാലൻസ്, Commuted Leave ആനുകൂല്യം — ഇവ കണക്കാക്കാൻ ഈ കാൽക്കുലേറ്റർ ഉപയോഗിക്കുക.
            </p>
          </div>

          <HPLCalculator />
        </div>
      </main>
      <Footer />
    </>
  );
}
