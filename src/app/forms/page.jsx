import Link from 'next/link';
import FormsClient from './FormsClient';
import { FORMS } from './formsData';

export default function FormsPage() {
  return (
    <div className="relative min-h-screen bg-aurora overflow-x-hidden">
      <div className="max-w-[1040px] mx-auto px-4 pt-[100px] pb-16">

        {/* Header */}
        <div className="mb-8">
          <Link href="/"
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/50 hover:text-white/60 no-underline transition-colors mb-3">
            ← Back to Home
          </Link>
          <div className="text-[10px] font-black uppercase tracking-widest text-white/45 mb-2">
            Finance Department · Government of Kerala
          </div>
          <h1 className="text-[clamp(22px,4vw,40px)] font-[900] tracking-[-0.03em] text-white leading-tight"
            style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            Government Forms — Download Official Kerala Finance Dept Forms
          </h1>
          <p className="text-[13px] text-white/55 mt-1">
            {FORMS.length} official forms across 14 categories — Finance Department, Kerala
          </p>
        </div>

        {/* Descriptive intro — server-rendered, always visible */}
        <div className="mb-8 rounded-2xl p-5 md:p-6"
          style={{ background: 'rgba(41,151,255,0.04)', border: '1px solid rgba(41,151,255,0.10)' }}>
          <p className="text-[13px] text-white/65 leading-relaxed mb-3">
            This page provides direct download links to all official government forms used by Kerala State Government
            employees, sourced from the Finance Department (finance.kerala.gov.in). Forms are available across
            14 categories including Pension, GPF, Leave, NPS, GIS, SLI, HBA, KFC, Treasury, and IT/Digital.
          </p>
          <p className="text-[13px] text-white/60 leading-relaxed mb-3">
            <strong className="text-white/80">Pension forms</strong> include the Pension Fixation Form, Malayalam Pension Book,
            and Form TR 83B for drawing pension through Treasury Savings Bank.{' '}
            <strong className="text-white/80">GPF forms</strong> cover admission (PF Form A), temporary advances (Form B, D),
            non-refundable withdrawals (Form B1), and nomination.{' '}
            <strong className="text-white/80">Leave forms</strong> include Form 13, the standard leave application (Rule 113 KSR),
            and the medical certificate form (Rule 117).
          </p>
          <p className="text-[13px] text-white/60 leading-relaxed mb-3">
            <strong className="text-white/80">HBA (House Building Advance)</strong> forms include the main HBA application,
            KFC Form 32 (Mortgage Deed), KFC Form 36 (Agreement for Loan), and KFC Form 37.{' '}
            <strong className="text-white/80">NPS forms</strong> include the Option Form and PRAN application.{' '}
            <strong className="text-white/80">Treasury forms</strong> cover TR 46, TR 47, TR 59(C), TR 103, TR 104,
            and the Treasury Savings Bank account opening form.
          </p>
          <p className="text-[13px] text-white/55 leading-relaxed"
            style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            കേരള സർക്കാർ ജീവനക്കാർക്ക് ആവശ്യമായ എല്ലാ ഔദ്യോഗിക ഫോമുകളും ഇവിടെ ഒരേ സ്ഥലത്ത് ലഭ്യമാണ്.
            പെൻഷൻ, GPF, ലീവ്, NPS, GIS, SLI, HBA, KFC, ട്രഷറി ഫോമുകൾ ഉൾപ്പെടെ 14 വിഭാഗങ്ങളിലായി {FORMS.length}
            ഫോമുകൾ ഡൗൺലോഡ് ചെയ്യാൻ ലഭ്യമാണ്.
          </p>
        </div>

        {/* Interactive search + filter list (client component) */}
        <FormsClient />

      </div>
    </div>
  );
}
