'use client';

import Image from 'next/image';
import Link from 'next/link';

// ─── Data ─────────────────────────────────────────────────────────────────────
const STATS = [
  { value: '1,200+', label: 'Govt Orders'  },
  { value: '15+',    label: 'Calculators'  },
  { value: '100%',   label: 'Free Always'  },
];

const QUICK_LINKS = [
  { label: 'Pension',      href: '/pension'     },
  { label: 'Pay Revision', href: '/prc'         },
  { label: 'Leave Rules',  href: '/leave'       },
  { label: 'Forms',        href: '/forms'       },
  { label: 'Govt Orders',  href: '/orders'      },
  { label: 'Income Tax',   href: '/income-tax'  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function Hero() {
  function openSearch() {
    window.dispatchEvent(new CustomEvent('open-search'));
  }

  return (
    <section className="hero-root relative flex flex-col items-center justify-center text-center overflow-hidden
                        min-h-[62vh] md:min-h-[72vh] px-4 md:px-8
                        pt-[72px] md:pt-[88px] pb-14 md:pb-20">

      {/* ── Hover-state stylesheet ─────────────────────────────────────────── */}
      <style>{`
        /* Search bar hover */
        .hero-search:hover {
          border-color: rgba(200, 150, 12, 0.28) !important;
          background: rgba(255, 255, 255, 0.055) !important;
        }
        /* Quick link hover */
        .hero-link:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          color: rgba(255, 255, 255, 0.80) !important;
          border-color: rgba(255, 255, 255, 0.14) !important;
        }
        /* Thin bottom separator */
        .hero-root::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 70%, transparent 100%);
        }
      `}</style>

      {/* ── Background: CSS dot-grid + gradient depth (zero JS, zero SVG) ─── */}
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />
      {/* Gold radial bloom — top centre */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 70% 55% at 50% -5%, rgba(200,150,12,0.11) 0%, transparent 65%)',
      }} />
      {/* Cool blue depth — bottom */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 40% at 50% 110%, rgba(41,151,255,0.05) 0%, transparent 65%)',
      }} />
      {/* Vignette edges */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 55%, rgba(6,8,12,0.55) 100%)',
      }} />

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-[600px] mx-auto flex flex-col items-center">

        {/* Logo — clean icon treatment */}
        <div className="mb-6 md:mb-7" style={{
          width: 60, height: 60,
          borderRadius: 16,
          border: '1px solid rgba(200,150,12,0.28)',
          background: 'rgba(200,150,12,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 1px 24px rgba(200,150,12,0.10), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}>
          <Image
            src="/logo.webp"
            alt="Kerala Employees Portal"
            width={40} height={40}
            priority
            className="rounded-lg object-cover"
          />
        </div>

        {/* Eyebrow badge */}
        <div className="flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full" style={{
          background: 'rgba(200,150,12,0.07)',
          border: '1px solid rgba(200,150,12,0.18)',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#c8960c', flexShrink: 0,
            boxShadow: '0 0 6px rgba(200,150,12,0.7)',
          }} />
          <span style={{
            fontSize: 10, fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(200,150,12,0.80)',
          }}>
            Kerala Government Employees Portal
          </span>
        </div>

        {/* Primary heading — the LCP element */}
        <h1 style={{
          fontFamily: 'var(--font-noto-malayalam), sans-serif',
          fontSize: 'clamp(38px, 7vw, 76px)',
          fontWeight: 900,
          lineHeight: 1.08,
          letterSpacing: '-0.025em',
          marginBottom: 14,
          background: 'linear-gradient(160deg, #b8820a 0%, #e8c247 28%, #f5d060 50%, #fce38a 62%, #f5d060 76%, #c8960c 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          കേരള സർക്കാർ
        </h1>

        {/* Sub-heading */}
        <h2 style={{
          fontFamily: 'var(--font-noto-malayalam), sans-serif',
          fontSize: 'clamp(15px, 2.4vw, 22px)',
          fontWeight: 400,
          lineHeight: 1.5,
          color: 'rgba(255,255,255,0.46)',
          letterSpacing: '-0.01em',
          marginBottom: 36,
        }}>
          ജീവനക്കാരുടെ വിജ്ഞാനകോശം
        </h2>

        {/* Search bar — primary CTA */}
        <button
          onClick={openSearch}
          className="hero-search flex items-center gap-3 w-full rounded-2xl cursor-text"
          style={{
            maxWidth: 520,
            padding: '14px 18px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.10)',
            backdropFilter: 'blur(12px)',
            marginBottom: 32,
            transition: 'border-color 0.2s ease, background 0.2s ease',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="rgba(255,255,255,0.28)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>

          <span style={{
            flex: 1, textAlign: 'left',
            fontSize: 14, fontWeight: 400,
            color: 'rgba(255,255,255,0.24)',
            letterSpacing: '0.01em',
          }}>
            Search pension, DA arrears, KSR rules, orders…
          </span>

          <kbd className="hidden md:inline-flex items-center" style={{
            fontSize: 11, fontWeight: 500,
            padding: '3px 8px', borderRadius: 7,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.22)',
            letterSpacing: '0.02em',
            fontFamily: 'inherit',
            flexShrink: 0,
          }}>
            ⌘K
          </kbd>
        </button>

        {/* Stats row */}
        <div className="flex items-stretch mb-7" style={{
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(255,255,255,0.02)',
          overflow: 'hidden',
        }}>
          {STATS.map((s, i) => (
            <div key={i}
              className="flex flex-col items-center justify-center"
              style={{
                padding: 'clamp(10px, 2vw, 14px) clamp(20px, 4vw, 36px)',
                borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              }}>
              <span style={{
                display: 'block',
                fontSize: 'clamp(16px, 2.2vw, 22px)',
                fontWeight: 800,
                color: '#f5d060',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                marginBottom: 5,
              }}>
                {s.value}
              </span>
              <span style={{
                display: 'block',
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.30)',
              }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Quick-access links */}
        <div className="flex flex-wrap justify-center" style={{ gap: 8 }}>
          {QUICK_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="hero-link no-underline"
              style={{
                padding: '7px 16px',
                borderRadius: 99,
                fontSize: 12,
                fontWeight: 500,
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.40)',
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'background 0.15s ease, color 0.15s ease, border-color 0.15s ease',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
