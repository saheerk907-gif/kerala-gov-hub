'use client';

import Image from 'next/image';
import Link from 'next/link';

const STATS = [
  { value: '1,200+', label: 'Govt Orders' },
  { value: '15+',    label: 'Calculators' },
  { value: '100%',   label: 'Free Always' },
];

const QUICK_LINKS = [
  { label: 'Pension',      href: '/pension'    },
  { label: 'Pay Revision', href: '/prc'        },
  { label: 'Leave Rules',  href: '/leave'      },
  { label: 'Forms',        href: '/forms'      },
  { label: 'Govt Orders',  href: '/orders'     },
  { label: 'Income Tax',   href: '/income-tax' },
];

export default function Hero() {
  function openSearch() {
    window.dispatchEvent(new CustomEvent('open-search'));
  }

  return (
    <section className="hero-root bg-aurora relative flex flex-col items-center justify-center
                        text-center overflow-hidden
                        min-h-[64vh] md:min-h-[72vh] px-4 md:px-8
                        pt-[72px] md:pt-[88px] pb-14 md:pb-20">

      <style>{`
        .hero-search:hover {
          border-color: rgba(200,150,12,0.35) !important;
          background:   rgba(255,255,255,0.06) !important;
        }
        .hero-link:hover {
          background:   rgba(255,255,255,0.09) !important;
          color:        rgba(255,255,255,0.82) !important;
          border-color: rgba(255,255,255,0.15) !important;
        }
        /* hairline separator at section bottom */
        .hero-root::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(to right,
            transparent 0%, rgba(255,255,255,0.08) 25%,
            rgba(255,255,255,0.08) 75%, transparent 100%);
        }
      `}</style>

      {/* ── Extra depth layers on top of bg-aurora ──────────────────────── */}
      {/* Fine dot-grid texture */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />
      {/* Strong centred gold bloom — lights the heading from behind */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 65% 55% at 50% 38%, rgba(200,150,12,0.13) 0%, transparent 65%)',
      }} />
      {/* Edge vignette — stops the gradient mesh bleeding to corners */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 110% 110% at 50% 50%, transparent 50%, rgba(8,10,16,0.60) 100%)',
      }} />

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-[640px] mx-auto flex flex-col items-center">

        {/* Logo — product-icon style, not a floating orb */}
        <div className="mb-6" style={{
          width: 60, height: 60,
          borderRadius: 15,
          border: '1px solid rgba(200,150,12,0.30)',
          background: 'linear-gradient(145deg, rgba(200,150,12,0.10), rgba(200,150,12,0.04))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 20px rgba(200,150,12,0.12), inset 0 1px 0 rgba(255,255,255,0.07)',
        }}>
          <Image
            src="/logo.webp" alt="Kerala Employees Portal"
            width={40} height={40} priority
            className="rounded-xl object-cover"
          />
        </div>

        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-5 px-4 py-[7px] rounded-full" style={{
          background: 'rgba(200,150,12,0.07)',
          border: '1px solid rgba(200,150,12,0.20)',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
            background: '#d4a017',
            boxShadow: '0 0 7px rgba(200,150,12,0.80)',
          }} />
          <span style={{
            fontSize: 10, fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'rgba(212,160,23,0.85)',
          }}>
            Kerala Government Employees Portal
          </span>
        </div>

        {/* ── H1 — always one line, scales with viewport ───────────────── */}
        <h1 style={{
          fontFamily: 'var(--font-noto-malayalam), sans-serif',
          fontSize: 'clamp(32px, 9vw, 80px)',
          fontWeight: 900,
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          whiteSpace: 'nowrap',          /* ← forces single line at every viewport */
          marginBottom: 12,
          background: 'linear-gradient(155deg, #b07d0a 0%, #dbb83c 22%, #f5d060 45%, #fde98a 58%, #f5d060 74%, #c8960c 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          കേരള സർക്കാർ
        </h1>

        {/* Subtitle */}
        <p style={{
          fontFamily: 'var(--font-noto-malayalam), sans-serif',
          fontSize: 'clamp(14px, 2.2vw, 21px)',
          fontWeight: 400,
          lineHeight: 1.55,
          color: 'rgba(255,255,255,0.44)',
          letterSpacing: 0,
          marginBottom: 34,
        }}>
          ജീവനക്കാരുടെ വിജ്ഞാനകോശം
        </p>

        {/* Search */}
        <button onClick={openSearch}
          className="hero-search flex items-center gap-3 w-full rounded-[14px] cursor-text"
          style={{
            maxWidth: 520,
            padding: '13px 18px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.10)',
            backdropFilter: 'blur(14px)',
            marginBottom: 28,
            transition: 'border-color 0.18s, background 0.18s',
          }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="rgba(255,255,255,0.26)" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <span style={{
            flex: 1, textAlign: 'left', fontSize: 13.5, fontWeight: 400,
            color: 'rgba(255,255,255,0.22)',
          }}>
            Search pension, DA arrears, KSR rules, orders…
          </span>
          <kbd className="hidden md:inline-flex items-center" style={{
            fontSize: 11, fontWeight: 500,
            padding: '3px 8px', borderRadius: 6,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.20)',
            fontFamily: 'inherit', flexShrink: 0,
          }}>
            ⌘K
          </kbd>
        </button>

        {/* Stats */}
        <div className="flex items-stretch mb-6" style={{
          borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(255,255,255,0.025)',
          overflow: 'hidden',
        }}>
          {STATS.map((s, i) => (
            <div key={i} className="flex flex-col items-center justify-center" style={{
              padding: 'clamp(10px,1.8vw,14px) clamp(18px,3.5vw,34px)',
              borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
            }}>
              <span style={{
                fontSize: 'clamp(15px,2vw,21px)', fontWeight: 800,
                color: '#f5d060', letterSpacing: '-0.02em',
                lineHeight: 1, marginBottom: 5,
              }}>
                {s.value}
              </span>
              <span style={{
                fontSize: 9, fontWeight: 600,
                letterSpacing: '0.13em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.28)',
              }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap justify-center" style={{ gap: 7 }}>
          {QUICK_LINKS.map(link => (
            <Link key={link.href} href={link.href}
              className="hero-link no-underline" style={{
                padding: '6px 15px', borderRadius: 99,
                fontSize: 12, fontWeight: 500,
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.38)',
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'background 0.15s, color 0.15s, border-color 0.15s',
              }}>
              {link.label}
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
