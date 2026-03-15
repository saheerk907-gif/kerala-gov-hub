'use client';
import AudioPlayer from '@/components/AudioPlayer';

export default function AudioClassesSection() {
  return (
    <section id="audio-classes" className="relative py-7 md:py-8 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="mb-6">
          <div className="section-label mb-2">KSR Awareness</div>
          <h2 className="text-[clamp(22px,3vw,32px)] font-[900] tracking-[-0.02em] text-white" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            ഓഡിയോ ക്ലാസ്സുകൾ
          </h2>
          <div className="h-[2px] w-10 bg-gradient-to-r from-[#30d158] to-transparent mt-2 rounded-full" />
          <p className="text-white/72 text-[13px] mt-1">Kerala Service Rules — Awareness Classes for Govt Employees</p>
        </div>

        <AudioPlayer limit={2} />

      </div>
    </section>
  );
}
