import Link from 'next/link';
import Image from 'next/image';
import HeroSearchButton from './HeroSearchButton';

const STATS = [
  { value: '1,200+', label: 'Govt Orders' },
  { value: '15+',    label: 'Calculators' },
  { value: '100%',   label: 'Free Always'  },
];

const QUICK_LINKS = [
  { label: 'Pension',      href: '/pension'    },
  { label: 'Pay Revision', href: '/prc'        },
  { label: 'Leave',        href: '/leave'      },
  { label: 'Forms',        href: '/forms'      },
  { label: 'Govt Orders',  href: '/orders'     },
  { label: 'Income Tax',   href: '/income-tax' },
];

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden flex flex-col items-center justify-center text-center"
      style={{ minHeight: '88vh', paddingTop: 72, paddingBottom: 48, background: '#0d1117' }}
    >
      {/* Subtle radial glow — no image, just depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 55% at 50% 40%, rgba(200,150,12,0.07) 0%, transparent 65%),' +
            'radial-gradient(ellipse 60% 40% at 20% 80%, rgba(41,151,255,0.04) 0%, transparent 60%),' +
            '#0d1117',
        }}
      />

      {/* Thin top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(200,150,12,0.50) 40%, rgba(200,150,12,0.50) 60%, transparent 100%)' }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 flex flex-col items-center">

        {/* Logo */}
        <div className="relative mb-6">
          <div
            className="absolute inset-0 rounded-full blur-3xl scale-[1.8]"
            style={{ background: 'rgba(200,150,12,0.22)' }}
          />
          <Image
            src="/logo.webp"
            alt="Kerala Employees Portal"
            width={120}
            height={120}
            priority
            className="relative rounded-full object-cover"
            style={{
              width: 96, height: 96,
              boxShadow: '0 0 0 2px rgba(245,208,96,0.50), 0 0 0 5px rgba(245,208,96,0.10), 0 16px 48px rgba(0,0,0,0.60)',
            }}
          />
        </div>

        {/* Eyebrow label */}
        <p
          className="font-bold mb-5"
          style={{
            fontSize: 'clamp(13px, 2vw, 17px)',
            letterSpacing: '0.18em',
            color: 'rgba(245,208,96,0.70)',
            textTransform: 'uppercase',
          }}
        >
          Kerala Government Employees Portal
        </p>

        {/* H1 — one line, never wraps */}
        <h1
          className="font-malayalam font-black whitespace-nowrap leading-none mb-3"
          style={{
            fontSize: 'clamp(36px, 8vw, 80px)',
            background: 'linear-gradient(135deg, #c8960c 0%, #f5d060 38%, #fce38a 52%, #f5d060 68%, #c8960c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 28px rgba(200,150,12,0.30))',
            letterSpacing: '-0.01em',
          }}
        >
          കേരള സർക്കാർ
        </h1>

        {/* H2 */}
        <h2
          className="font-malayalam font-semibold leading-snug mb-8"
          style={{
            fontSize: 'clamp(15px, 3vw, 26px)',
            color: 'rgba(255,255,255,0.45)',
            letterSpacing: '0.01em',
          }}
        >
          ജീവനക്കാരുടെ വിജ്ഞാനകോശം
        </h2>

        {/* Search */}
        <div className="w-full max-w-[500px]">
          <HeroSearchButton />
        </div>

        {/* Stats row */}
        <div
          className="flex items-center divide-x mb-7"
          style={{ divideColor: 'rgba(255,255,255,0.08)' }}
        >
          {STATS.map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center px-5 md:px-7"
              style={{ borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}
            >
              <span
                className="font-black leading-none"
                style={{ fontSize: 'clamp(16px, 2.5vw, 22px)', color: '#f5d060' }}
              >
                {s.value}
              </span>
              <span
                className="uppercase tracking-wider mt-1"
                style={{ fontSize: 9, color: 'rgba(255,255,255,0.38)', fontWeight: 600 }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap justify-center gap-2">
          {QUICK_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="no-underline transition-all duration-150 hover:brightness-125"
              style={{
                padding: '6px 14px',
                borderRadius: 99,
                fontSize: 11,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.60)',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
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
