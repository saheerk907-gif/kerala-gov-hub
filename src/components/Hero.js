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

// Violet palette lifted from the rest of the landing page
const V1 = '#bf5af2';          // Apple-system purple — section labels
const V2 = 'rgba(140,80,240)'; // Deep violet — card border gradient start
const V3 = 'rgba(60,130,255)'; // Blue-violet — card border gradient end

export default function Hero() {
  function openSearch() {
    window.dispatchEvent(new CustomEvent('open-search'));
  }

  return (
    <section className="hero-root bg-aurora relative flex flex-col items-center
                        justify-center text-center overflow-hidden
                        min-h-[66vh] md:min-h-[74vh] px-4 md:px-8
                        pt-[72px] md:pt-[88px] pb-14 md:pb-20">

      <style>{`
        .hero-search:hover {
          border-color: rgba(140, 80, 240, 0.45) !important;
          background:   rgba(140, 80, 240, 0.06) !important;
        }
        .hero-link:hover {
          background:   rgba(140, 80, 240, 0.12) !important;
          color:        rgba(255, 255, 255, 0.82) !important;
          border-color: rgba(140, 80, 240, 0.35) !important;
        }
        .hero-root::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(to right,
            transparent 0%,
            rgba(140,80,240,0.18) 25%,
            rgba(60,130,255,0.18) 75%,
            transparent 100%);
        }
      `}</style>

      {/* ── Background depth layers ──────────────────────────────────────── */}
      {/* Fine dot-grid texture */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.042) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />
      {/* Gold bloom — centre, lights the first title */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 55% 45% at 50% 34%, rgba(200,150,12,0.11) 0%, transparent 65%)',
      }} />
      {/* Violet bloom — top-right, matches site card gradient */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 55% 50% at 85% 10%, rgba(140,80,240,0.12) 0%, transparent 60%)',
      }} />
      {/* Blue-violet bloom — bottom-left */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 50% 40% at 12% 88%, rgba(60,130,255,0.08) 0%, transparent 60%)',
      }} />
      {/* Edge vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 115% 115% at 50% 50%, transparent 48%, rgba(8,10,18,0.62) 100%)',
      }} />

      {/* ── Content ───────────────────────────────────────────��─────────── */}
      <div className="relative z-10 w-full max-w-[660px] mx-auto flex flex-col items-center">

        {/* Logo — bigger, violet-gradient border matching card borders */}
        <div className="mb-6" style={{
          padding: '1.5px',
          borderRadius: 20,
          background: 'linear-gradient(135deg, rgba(140,80,240,0.70), rgba(60,130,255,0.70))',
          boxShadow: '0 4px 32px rgba(140,80,240,0.18)',
        }}>
          <div style={{
            width: 84, height: 84,
            borderRadius: 18,
            background: 'linear-gradient(145deg, rgba(140,80,240,0.10), rgba(60,130,255,0.06))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Image
              src="/logo.webp" alt="Kerala Employees Portal"
              width={58} height={58} priority
              className="rounded-[13px] object-cover"
            />
          </div>
        </div>

        {/* Eyebrow — violet palette pill */}
        <div className="flex items-center gap-2 mb-5 px-4 py-[7px] rounded-full" style={{
          background: 'rgba(140,80,240,0.10)',
          border: '1px solid rgba(140,80,240,0.28)',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
            background: V1,
            boxShadow: `0 0 8px ${V1}`,
          }} />
          <span style={{
            fontSize: 10, fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'rgba(191,90,242,0.90)',
          }}>
            Kerala Government Employees Portal
          </span>
        </div>

        {/* ── First title — gold, dominant ─────────────────────────────── */}
        <h1 style={{
          fontFamily: 'var(--font-noto-malayalam), sans-serif',
          fontSize: 'clamp(34px, 9.5vw, 82px)',
          fontWeight: 900,
          lineHeight: 1.04,
          letterSpacing: '-0.022em',
          whiteSpace: 'nowrap',
          marginBottom: 10,
          background: 'linear-gradient(155deg, #b07d0a 0%, #dbb83c 20%, #f5d060 44%, #fde98a 58%, #f5d060 74%, #c8960c 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          കേരള സർക്കാർ
        </h1>

        {/* ── Second title — violet, prominent ─────────────────────────── */}
        <h2 style={{
          fontFamily: 'var(--font-noto-malayalam), sans-serif',
          fontSize: 'clamp(18px, 4.2vw, 40px)',
          fontWeight: 700,
          lineHeight: 1.2,
          letterSpacing: '-0.01em',
          marginBottom: 32,
          background: 'linear-gradient(140deg, rgba(140,80,240,0.90) 0%, #bf5af2 38%, #d08ef7 60%, #bf5af2 80%, rgba(60,130,255,0.90) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          ജീവനക്കാരുടെ വിജ്ഞാനകോശം
        </h2>

        {/* Search */}
        <button onClick={openSearch}
          className="hero-search flex items-center gap-3 w-full rounded-[14px] cursor-text"
          style={{
            maxWidth: 530,
            padding: '13px 18px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.10)',
            backdropFilter: 'blur(14px)',
            marginBottom: 26,
            transition: 'border-color 0.18s, background 0.18s',
          }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="rgba(255,255,255,0.26)" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <span style={{
            flex: 1, textAlign: 'left',
            fontSize: 13.5, fontWeight: 400,
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
              padding: 'clamp(10px,1.8vw,14px) clamp(18px,3.5vw,36px)',
              borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
            }}>
              <span style={{
                fontSize: 'clamp(15px,2.2vw,22px)', fontWeight: 800,
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
                background: 'rgba(140,80,240,0.06)',
                color: 'rgba(255,255,255,0.40)',
                border: '1px solid rgba(140,80,240,0.18)',
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
