'use client';
import AudioPlayer from '@/components/AudioPlayer';

const ACCENT = '#ff9f0a'; // orange

export default function AudioClassesSection() {
  return (
    <section id="audio-classes" className="relative py-3 md:py-4 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">

        {/* Purple-blue glow border wrapper */}
        <div style={{
          background: 'linear-gradient(135deg,rgba(140,80,240,0.55),rgba(60,130,255,0.55))',
          padding: '1.5px', borderRadius: 28,
        }}>
          {/* Cinematic photo card */}
          <div className="relative overflow-hidden" style={{
            backgroundImage: "url('/images/govtoffic.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center 35%',
            borderRadius: 26,
            minHeight: 340,
          }}>
            {/* ── Cinematic overlays ── */}
            {/* Base dark tint */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,8,14,0.65)', zIndex: 1 }} />
            {/* Left-to-right: strong dark left side for content */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 2,
              background: 'linear-gradient(to right, rgba(6,8,14,0.96) 0%, rgba(6,8,14,0.78) 40%, rgba(6,8,14,0.4) 68%, transparent 100%)' }} />
            {/* Top-to-bottom fade */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 2,
              background: 'linear-gradient(to bottom, rgba(6,8,14,0.75) 0%, transparent 30%, rgba(6,8,14,0.85) 100%)' }} />
            {/* Orange accent glow bottom-left */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '45%', height: '35%', zIndex: 2,
              background: 'radial-gradient(ellipse at bottom left, rgba(255,159,10,0.13) 0%, transparent 70%)' }} />

            {/* ── Content ── */}
            <div className="relative p-5 md:p-7 flex flex-col" style={{ zIndex: 3, minHeight: 340 }}>

              {/* Header */}
              <div className="mb-5">
                <div className="section-label mb-1" style={{ color: ACCENT, opacity: 1, fontWeight: 800 }}>KSR Awareness</div>
                <h2 className="text-[clamp(26px,4vw,38px)] font-[900] tracking-[-0.03em] text-white leading-tight"
                  style={{ fontFamily: "var(--font-noto-malayalam), sans-serif", textShadow: '0 2px 20px rgba(0,0,0,0.9)' }}>
                  ഓഡിയോ ക്ലാസ്സുകൾ
                </h2>
                <div className="h-[3px] w-12 mt-2 rounded-full"
                  style={{ background: `linear-gradient(to right, ${ACCENT}, transparent)` }} />
                <p className="text-[13px] mt-2 max-w-md"
                  style={{ color: 'rgba(255,255,255,0.62)', textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
                  Kerala Service Rules — Awareness Classes for Govt Employees
                </p>

                {/* Live badge */}
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                    style={{ background: 'rgba(255,159,10,0.15)', border: '1px solid rgba(255,159,10,0.35)', color: ACCENT }}>
                    <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: ACCENT, animation: 'pulse 2s infinite' }} />
                    Audio Classes
                  </div>
                  <div className="px-2.5 py-1 rounded-full text-[10px] font-semibold"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.65)' }}>
                    🎙️ KSR Series
                  </div>
                </div>
              </div>

              {/* Audio Player — rendered on the cinematic background */}
              <div className="flex-grow">
                <AudioPlayer limit={2} />
              </div>

            </div>{/* /content */}
          </div>{/* /photo card */}
        </div>{/* /gradient border */}

      </div>
    </section>
  );
}
