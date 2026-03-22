'use client';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import AudioPlayer from '@/components/AudioPlayer';

export default function AudioClassesPage() {
  return (
    <>
    <Navbar />
    <div className="relative min-h-screen bg-aurora overflow-x-hidden">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 pt-[100px] pb-16">

        {/* Header */}
        <div className="mb-8">
          <Link href="/"
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/70 hover:text-white no-underline transition-colors mb-3">
            ← Back to Home
          </Link>
          <div className="text-[10px] font-black uppercase tracking-widest text-white/65 mb-2">KSR Awareness</div>
          <h1 className="text-[clamp(22px,4vw,40px)] font-[900] tracking-[-0.03em] text-white leading-tight"
            style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            ഓഡിയോ ക്ലാസ്സുകൾ
          </h1>
          <p className="text-[13px] text-white/72 mt-1">
            Kerala Service Rules — Awareness Classes for Government Employees
          </p>
          <div className="h-[2px] w-10 bg-gradient-to-r from-[#30d158] to-transparent mt-3 rounded-full" />
        </div>

        <AudioPlayer />

      </div>
    </div>
    </>
  );
}
