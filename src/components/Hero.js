import Image from 'next/image';
import Link from 'next/link';
import HeroSearchButton from './HeroSearchButton';

const STATS = [
  { value: '1,200+', label: 'Govt Orders',  icon: '📋' },
  { value: '15+',    label: 'Calculators',  icon: '🧮' },
  { value: '100%',   label: 'Free Always',  icon: '✅' },
];

const QUICK_LINKS = [
  { label: '💰 Pension',      href: '/pension'    },
  { label: '📊 Pay Revision', href: '/prc'        },
  { label: '🏖️ Leave',        href: '/leave'      },
  { label: '📄 Forms',        href: '/forms'      },
  { label: '📋 Govt Orders',  href: '/orders'     },
  { label: '🧾 Income Tax',   href: '/income-tax' },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[100svh] md:min-h-[92vh] flex flex-col">

      {/* ── Background image ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/kerala-secretariat-opt.webp"
          alt=""
          fill
          priority
          fetchPriority="high"
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* Dark base layer — sets overall darkness */}
        <div className="absolute inset-0" style={{ background: 'rgba(10,12,15,0.52)' }} />

        {/* Bottom-up heavy fade — content sits on dark base */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, #0d1117 0%, #0d1117 18%, rgba(13,17,23,0.85) 38%, rgba(13,17,23,0.30) 60%, transparent 100%)',
        }} />

        {/* Left vignette — helps text readability */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(105deg, rgba(10,12,15,0.80) 0%, rgba(10,12,15,0.40) 45%, transparent 75%)',
        }} />
      </div>

      {/* ── Gold ambient glow behind text ── */}
      <div className="absolute z-[1] pointer-events-none"
        style={{
          top: '30%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700, height: 400,
          background: 'radial-gradient(ellipse, rgba(200,150,12,0.14) 0%, transparent 68%)',
          filter: 'blur(40px)',
        }}
      />

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col flex-1 pt-[72px] md:pt-[88px]">

        {/* Upper hero — logo + text + search */}
        <div className="flex-1 flex flex-col justify-center px-5 md:px-10 lg:px-16 pb-8">
          <div className="max-w-[720px]">

            {/* Logo + badge row */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 rounded-full blur-[18px] scale-125"
                  style={{ background: 'rgba(200,150,12,0.35)' }} />
                <Image
                  src="/logo.webp"
                  alt="Kerala Employees Portal"
                  width={52}
                  height={52}
                  priority
                  className="relative rounded-full object-cover w-[48px] h-[48px] md:w-[56px] md:h-[56px]"
                  style={{
                    boxShadow: '0 0 0 2px rgba(245,208,96,0.55), 0 8px 28px rgba(0,0,0,0.60)',
                  }}
                />
              </div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em]"
                style={{
                  background: 'rgba(245,208,96,0.10)',
                  border: '1px solid rgba(245,208,96,0.30)',
                  color: 'rgba(245,208,96,0.85)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#f5d060] animate-pulse flex-shrink-0" />
                Kerala Govt Employees Portal
              </div>
            </div>

            {/* Main headline */}
            <h1
              className="font-malayalam font-black leading-[1.25] mb-2 md:mb-3"
              style={{
                fontSize: 'clamp(38px, 7.5vw, 82px)',
                background: 'linear-gradient(135deg, #c8960c 0%, #f5d060 35%, #fce38a 50%, #f5d060 65%, #c8960c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 2px 20px rgba(200,150,12,0.40))',
                letterSpacing: '-0.01em',
              }}
            >
              കേരള സർക്കാർ
            </h1>

            {/* Sub headline */}
            <h2
              className="font-malayalam font-bold leading-[1.35] mb-6 md:mb-8"
              style={{
                fontSize: 'clamp(18px, 3.8vw, 42px)',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.90) 50%, rgba(255,255,255,0.55) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.005em',
              }}
            >
              ജീവനക്കാരുടെ വിജ്ഞാനകോശം
            </h2>

            {/* Search bar */}
            <div className="w-full max-w-[560px]">
              <HeroSearchButton />
            </div>

            {/* Quick links — visible on all sizes */}
            <div className="flex flex-wrap gap-2 mt-1">
              {QUICK_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 rounded-full text-[11px] md:text-[12px] font-semibold no-underline transition-all duration-200 hover:scale-105"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    color: 'rgba(255,255,255,0.75)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Stats bar — anchored to bottom ── */}
        <div
          className="relative z-10 px-5 md:px-10 lg:px-16 py-5 md:py-6"
          style={{
            background: 'linear-gradient(to right, rgba(13,17,23,0.92) 0%, rgba(13,17,23,0.75) 60%, rgba(13,17,23,0.50) 100%)',
            borderTop: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div className="flex items-center gap-6 md:gap-12 flex-wrap">
            {STATS.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                  style={{
                    background: 'rgba(245,208,96,0.10)',
                    border: '1px solid rgba(245,208,96,0.20)',
                  }}
                >
                  {s.icon}
                </div>
                <div>
                  <div
                    className="font-black leading-none tracking-tight"
                    style={{ fontSize: 'clamp(18px, 2.5vw, 26px)', color: '#f5d060' }}
                  >
                    {s.value}
                  </div>
                  <div className="text-[10px] md:text-[11px] font-medium uppercase tracking-wider mt-0.5"
                    style={{ color: 'rgba(255,255,255,0.50)' }}>
                    {s.label}
                  </div>
                </div>
                {i < STATS.length - 1 && (
                  <div className="hidden sm:block w-px h-8 ml-2 md:ml-6"
                    style={{ background: 'rgba(255,255,255,0.10)' }} />
                )}
              </div>
            ))}

            {/* Scroll hint — desktop */}
            <div className="hidden md:flex items-center gap-2 ml-auto opacity-40">
              <span className="text-[11px] text-white uppercase tracking-widest">Scroll</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
