'use client';
import AudioPlayer from '@/components/AudioPlayer';

const ACCENT = '#ff9f0a'; // orange

const F1 = '#2a3552';
const F2 = '#1e2a44';
const D  = '#162038';

function AudioIllustration() {
  return (
    <svg viewBox="0 0 600 380" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden="true">

      {/* Headphones — large, right-center */}
      <g transform="translate(460,170)">
        <path d="M-82,22 Q-82,-96 0,-96 Q82,-96 82,22"
          fill="none" stroke={F1} strokeWidth="24" strokeLinecap="round"/>
        {/* Left ear cup */}
        <rect x="-104" y="8"  width="46" height="66" rx="20" fill={F1}/>
        <rect x="-98"  y="16" width="34" height="50" rx="16" fill={D}/>
        <circle cx="-81" cy="41" r="11" fill={F1}/>
        {/* Right ear cup */}
        <rect x="58"  y="8"  width="46" height="66" rx="20" fill={F1}/>
        <rect x="64"  y="16" width="34" height="50" rx="16" fill={D}/>
        <circle cx="81" cy="41" r="11" fill={F1}/>
        {/* Cable */}
        <path d="M-81,74 Q-81,106 -60,116 Q-30,126 0,124 Q30,126 60,116 Q81,106 81,74"
          fill="none" stroke={F2} strokeWidth="5" strokeLinecap="round"/>
        <circle cx="0" cy="128" r="9" fill={F2}/>
        <rect x="-3" y="128" width="6" height="22" rx="3" fill={D}/>
      </g>

      {/* Waveform bars — left of headphones */}
      <g transform="translate(348,200)">
        {[22,36,18,44,30,40,16,34,26,42,20,38].map((h,i)=>(
          <rect key={i} x={i*16-88} y={-h/2} width="10" height={h} rx="4"
            fill={i%3===0 ? F1 : F2}/>
        ))}
      </g>

      {/* Sound-wave arcs — right of headphones */}
      <g transform="translate(564,170)">
        {[28,48,68].map((r,i)=>(
          <path key={i} d={`M0,${-r} A${r},${r} 0 0,1 0,${r}`}
            fill="none" stroke={F1} strokeWidth="5" strokeLinecap="round" opacity={0.92-i*0.14}/>
        ))}
      </g>

      {/* Vinyl record — bottom-right */}
      <g transform="translate(530,308)">
        <circle r="52" fill={F2}/>
        <circle r="40" fill={D}/>
        {[24,30,36].map(r=>(
          <circle key={r} r={r} fill="none" stroke={F1} strokeWidth="1.5" opacity="0.85"/>
        ))}
        <circle r="11" fill={F1}/>
        <circle r="5"  fill={D}/>
      </g>

      {/* Musical note — top area */}
      <g transform="translate(375,72)">
        <rect x="-4" y="-32" width="8" height="40" rx="3" fill={F1}/>
        <ellipse cx="-11" cy="8" rx="13" ry="9" fill={F1} transform="rotate(-20,-11,8)"/>
        <rect x="14" y="-44" width="7" height="40" rx="3" fill={F2}/>
        <ellipse cx="7" cy="-4" rx="12" ry="8" fill={F2} transform="rotate(-20,7,-4)"/>
        <line x1="-4" y1="-32" x2="21" y2="-44" stroke={F1} strokeWidth="2"/>
      </g>

      {/* Accent dots */}
      <circle cx="326" cy="290" r="5"   fill={F1}/>
      <circle cx="338" cy="308" r="3"   fill={F2}/>
      <circle cx="574" cy="62"  r="5"   fill={F1}/>
      <circle cx="588" cy="78"  r="3"   fill={F2}/>
    </svg>
  );
}

export default function AudioClassesSection() {
  return (
    <section id="audio-classes" className="relative py-3 md:py-4 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">

        {/* Purple-blue glow border wrapper */}
        <div style={{
          background: 'linear-gradient(135deg,rgba(140,80,240,0.55),rgba(60,130,255,0.55))',
          padding: '1.5px', borderRadius: 28,
        }}>
          {/* SVG illustrated card */}
          <div className="relative overflow-hidden" style={{
            background: '#080c14',
            borderRadius: 26,
            minHeight: 340,
          }}>
            {/* SVG illustration — behind everything */}
            <AudioIllustration />
            {/* Fade content area */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 1,
              background: 'linear-gradient(to right, rgba(8,12,20,0.97) 0%, rgba(8,12,20,0.88) 44%, rgba(8,12,20,0.50) 68%, transparent 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, zIndex: 1,
              background: 'linear-gradient(to bottom, rgba(8,12,20,0.55) 0%, transparent 30%, rgba(8,12,20,0.75) 100%)' }} />
            {/* Orange accent glow bottom-left */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '45%', height: '35%', zIndex: 1,
              background: 'radial-gradient(ellipse at bottom left, rgba(255,159,10,0.13) 0%, transparent 70%)' }} />

            {/* Content */}
            <div className="relative p-5 md:p-7 flex flex-col" style={{ zIndex: 2, minHeight: 340 }}>

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
