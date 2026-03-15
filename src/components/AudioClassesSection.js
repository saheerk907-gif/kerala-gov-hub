'use client';
import AudioPlayer from '@/components/AudioPlayer';
import Link from 'next/link';

export default function AudioClassesSection() {
  return (
    <section id="audio-classes" className="relative py-6 md:py-8 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-7">
          <div>
            <div className="section-label mb-2">KSR Awareness</div>
            <h2 className="text-[clamp(22px,3vw,32px)] font-[900] tracking-[-0.02em] text-white" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              ഓഡിയോ ക്ലാസ്സുകൾ
            </h2>
            <div className="h-[2px] w-10 bg-gradient-to-r from-[#30d158] to-transparent mt-2 rounded-full" />
            <p className="text-white/72 text-[13px] mt-1">Kerala Service Rules — Awareness Classes for Govt Employees</p>
          </div>
          <Link href="/audio-classes"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-bold no-underline transition-all hover:bg-[#30d158]/10 flex-shrink-0"
            style={{ background: 'rgba(48,209,88,0.08)', color: '#30d158', border: '1px solid rgba(48,209,88,0.2)' }}>
            എല്ലാം കാണുക
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        <AudioPlayer limit={2} />

      </div>
    </section>
  );
}
