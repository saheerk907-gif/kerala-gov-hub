'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ── Dropdown data ─────────────────────────────────────────────
const NAV_ITEMS = [
  {
    label: 'ടൂളുകൾ',
    en: 'Tools',
    href: '#tools',
    dropdown: [
      { icon: '💰', label: '12th PRC കാൽക്കുലേറ്റർ',   sub: 'Pay Revision',          href: '/prc',       badge: 'NEW',  color: '#2997ff' },
      { icon: '📊', label: 'NPS vs APS',                  sub: 'Pension Comparison',    href: '/nps-aps',   badge: 'NEW',  color: '#ff453a' },
      { icon: '💰', label: 'Pension Calculator',          sub: 'Monthly Pension',       href: '/pension',   badge: 'NEW',  color: '#2997ff' },
      { icon: '🎖️', label: 'DCRG Calculator',             sub: 'Retirement Gratuity',   href: '/dcrg',      badge: 'NEW',  color: '#c8960c' },
      { icon: '📊', label: 'DA Arrear Calculator',        sub: '11th PRC · Mar 2021',   href: '/da-arrear', badge: 'NEW',  color: '#ff9f0a' },
      { icon: '🏦', label: 'GPF കാൽക്കുലേറ്റർ',         sub: 'Provident Fund',        href: '/gpf',       badge: null,   color: '#30d158' },
      { icon: '🏥', label: 'Medisep',                     sub: 'Health Insurance',      href: '/medisep',   badge: null,   color: '#ff9f0a' },
      { icon: '📖', label: 'Kerala Service Rules',        sub: 'KSR Parts I–III',       href: '/ksr',       badge: null,   color: '#bf5af2' },
      { icon: '📋', label: 'സർക്കാർ ഉത്തരവുകൾ',         sub: 'Government Orders',     href: '#orders',    badge: null,   color: '#c8960c' },
      { icon: '📅', label: 'Leave Calculator',            sub: 'EL, CL, ML',            href: '/prc',       badge: 'SOON', color: '#64d2ff' },
    ],
  },
  {
    label: 'ഉത്തരവുകൾ',
    en: 'Govt Orders',
    href: '#orders',
    dropdown: [
      { icon: '📋', label: 'എല്ലാ ഉത്തരവുകളും',    sub: 'All GOs',           href: '#orders',  color: '#ff9f0a' },
      { icon: '💵', label: 'ക്ഷാമബത്ത (DA)',         sub: 'DA Orders',         href: '#orders',  color: '#ff9f0a' },
      { icon: '🎁', label: 'ബോണസ് / ഉത്സവബത്ത',   sub: 'Bonus / Festival',  href: '#orders',  color: '#30d158' },
      { icon: '🏥', label: 'മെഡിസെപ്',             sub: 'Medisep Orders',    href: '#orders',  color: '#2997ff' },
      { icon: '🧓', label: 'പെൻഷൻ',               sub: 'Pension Orders',    href: '#orders',  color: '#bf5af2' },
      { icon: '💰', label: 'ശമ്പളം / Pay',          sub: 'Pay Orders',        href: '#orders',  color: '#64d2ff' },
      { icon: '🏦', label: 'GPF / NPS',             sub: 'PF Orders',         href: '#orders',  color: '#ff453a' },
      { icon: '🏖️', label: 'അവധി / Leave',          sub: 'Leave Orders',      href: '#orders',  color: '#c8960c' },
    ],
  },
  {
    label: 'പദ്ധതികൾ',
    en: 'Schemes',
    href: '#services',
    dropdown: [
      { icon: '📜', label: 'കേരള സർവ്വീസ് ചട്ടങ്ങൾ', sub: 'KSR',     href: '/ksr',      color: '#2997ff' },
      { icon: '🏥', label: 'മെഡിസെപ്',               sub: 'MEDISEP', href: '/medisep',  color: '#30d158' },
      { icon: '🏦', label: 'ജി.പി.എഫ്',              sub: 'GPF',     href: '/gpf',      color: '#ff9f0a' },
      { icon: '📊', label: 'എൻ.പി.എസ്',              sub: 'NPS',     href: '/nps-aps',  color: '#bf5af2' },
      { icon: '🛡️', label: 'എസ്.എൽ.ഐ',              sub: 'SLI',     href: '#services', color: '#64d2ff' },
      { icon: '🔒', label: 'ജി.ഐ.എസ്',              sub: 'GIS',     href: '#services', color: '#ff453a' },
    ],
  },
  {
    label: 'ടെസ്റ്റ്',
    en: 'Dept Tests',
    href: '/departmental-tests',
    dropdown: [
      { icon: '📋', label: 'പൊതു (Common)',         sub: 'MOP, KSR, KFC…',  href: '/departmental-tests?dept=common',       color: '#2997ff' },
      { icon: '🏛️', label: 'റവന്യൂ',               sub: 'Revenue Test',     href: '/departmental-tests?dept=revenue',      color: '#ff9f0a' },
      { icon: '🏘️', label: 'പഞ്ചായത്ത്',            sub: 'Panchayat Test',   href: '/departmental-tests?dept=panchayat',    color: '#bf5af2' },
      { icon: '⚖️', label: 'ജുഡീഷ്യറി',            sub: 'Judicial Test',    href: '/departmental-tests?dept=judiciary',    color: '#ffd60a' },
      { icon: '👮', label: 'പോലീസ്',               sub: 'Police Manual',    href: '/departmental-tests?dept=police',       color: '#0071e3' },
      { icon: '🎓', label: 'വിദ്യാഭ്യാസം (KER)',    sub: 'Education Rules',  href: '/departmental-tests?dept=education',    color: '#34c759' },
      { icon: '🌿', label: 'വനം',                   sub: 'Forest Test',      href: '/departmental-tests?dept=forest',       color: '#30d158' },
      { icon: '📝', label: 'രജിസ്ട്രേഷൻ',          sub: 'Registration',     href: '/departmental-tests?dept=registration', color: '#64d2ff' },
      { icon: '🗂️', label: 'എല്ലാ ടെസ്റ്റുകളും', sub: '64 tests',         href: '/departmental-tests',                   color: '#86868b' },
    ],
  },
  {
    label: 'പോർട്ടലുകൾ',
    en: 'Portals',
    href: '#links',
    dropdown: [
      { icon: '⚡', label: 'SPARK',         sub: 'spark.gov.in',                href: 'https://spark.gov.in',                       color: '#2997ff', external: true },
      { icon: '🏛️', label: 'e-Treasury',    sub: 'treasury.kerala.gov.in',      href: 'https://treasury.kerala.gov.in',             color: '#30d158', external: true },
      { icon: '🏥', label: 'MEDISEP',       sub: 'medisep.kerala.gov.in',       href: 'https://medisep.kerala.gov.in',              color: '#ff9f0a', external: true },
      { icon: '📊', label: 'NPS / CRA',     sub: 'npscra.nsdl.co.in',           href: 'https://www.npscra.nsdl.co.in',             color: '#bf5af2', external: true },
      { icon: '💼', label: 'Finance Dept',  sub: 'finance.kerala.gov.in',       href: 'https://www.finance.kerala.gov.in',         color: '#64d2ff', external: true },
      { icon: '🧓', label: 'Pension Portal',sub: 'pension.treasury.kerala.gov.in', href: 'https://pension.treasury.kerala.gov.in', color: '#c8960c', external: true },
      { icon: '🛡️', label: 'SLI Portal',   sub: 'sli.kerala.gov.in',           href: 'https://sli.kerala.gov.in',                 color: '#ff453a', external: true },
      { icon: '🌐', label: 'Kerala.gov.in', sub: 'Official Portal',             href: 'https://www.kerala.gov.in',                 color: '#30d158', external: true },
    ],
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleNavClick(href) {
    setMobileOpen(false);
    setOpenDropdown(null);
    if (href.startsWith('#')) {
      const id = href.slice(1);
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  }

  return (
    <>
      <header
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${scrolled ? 'shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : ''}`}
        style={{
          background: scrolled ? 'rgba(18,20,22,0.97)' : 'rgba(18,20,22,0.85)',
          backdropFilter: 'saturate(180%) blur(24px)',
          WebkitBackdropFilter: 'saturate(180%) blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="flex items-center justify-between px-4 md:px-6 h-14">

          {/* Brand */}
          <a href="/" className="flex items-center gap-3 no-underline group flex-shrink-0">
            <img src="/logo.png" alt="Kerala Gov Logo" width={36} height={36}
              className="w-9 h-9 rounded-full object-cover ring-1 ring-[#c8960c]/40 shadow-[0_0_14px_rgba(200,150,12,0.2)] group-hover:ring-[#c8960c]/70 transition-all" />
            <div className="flex flex-col leading-tight">
              <span className="text-[14px] font-bold text-white/90 group-hover:text-white transition-colors" style={{ fontFamily: "'Meera', sans-serif" }}>
                കേരള സർക്കാർ ജീവനക്കാർ
              </span>
              <span className="text-[9px] font-semibold text-white/30 uppercase tracking-widest font-sans hidden sm:block">
                Kerala Gov Employee Hub
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isOpen = openDropdown === item.en;
              return (
                <div key={item.en} className="relative">
                  <button
                    onClick={() => setOpenDropdown(isOpen ? null : item.en)}
                    className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-[13px] font-semibold text-white/55 hover:text-white hover:bg-white/[0.07] transition-all border-none bg-transparent cursor-pointer"
                    style={{ fontFamily: "'Meera', sans-serif", color: isOpen ? '#fff' : undefined }}
                  >
                    {item.label}
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"
                      className="opacity-40 transition-transform duration-200 mt-0.5"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                      <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                    </svg>
                  </button>

                  {/* Dropdown panel */}
                  {isOpen && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-50 min-w-[280px]"
                      style={{ background: 'rgba(22,24,28,0.98)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(30px)' }}
                    >
                      {/* Panel header */}
                      <div className="px-4 py-3 border-b border-white/[0.06]">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{item.en}</div>
                      </div>

                      {/* Items grid — 2 columns if >5 items */}
                      <div className={`p-2 ${item.dropdown.length > 5 ? 'grid grid-cols-2 gap-0.5' : 'flex flex-col gap-0.5'}`}>
                        {item.dropdown.map((d) => (
                          <a
                            key={d.label}
                            href={d.href}
                            target={d.external ? '_blank' : undefined}
                            rel={d.external ? 'noopener noreferrer' : undefined}
                            onClick={() => handleNavClick(d.href)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl no-underline group/item transition-all hover:bg-white/[0.06]"
                          >
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                              style={{ background: d.color + '18', border: `1px solid ${d.color}25` }}>
                              {d.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="text-[12px] font-semibold text-white/75 group-hover/item:text-white transition-colors leading-tight flex items-center gap-1.5"
                                style={{ fontFamily: "'Meera', sans-serif" }}>
                                {d.label}
                                {d.badge && (
                                  <span className="text-[8px] font-black px-1 py-0.5 rounded"
                                    style={{ background: d.badge === 'NEW' ? '#2997ff25' : '#ffffff10', color: d.badge === 'NEW' ? '#2997ff' : '#ffffff40' }}>
                                    {d.badge}
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-white/25 font-sans">{d.sub}</div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu"
            className="lg:hidden flex flex-col gap-[5px] p-2 bg-transparent border-none cursor-pointer">
            <span className={`block w-5 h-[1.5px] bg-white/60 transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
            <span className={`block w-5 h-[1.5px] bg-white/60 transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block w-5 h-[1.5px] bg-white/60 transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[999] flex flex-col pt-14 overflow-y-auto"
          style={{ background: 'rgba(14,16,18,0.99)', backdropFilter: 'blur(24px)' }}>
          <div className="px-4 py-3 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isExpanded = mobileExpanded === item.en;
              return (
                <div key={item.en}>
                  {/* Section header */}
                  <button
                    onClick={() => setMobileExpanded(isExpanded ? null : item.en)}
                    className="w-full flex items-center justify-between py-3.5 px-4 rounded-xl text-[15px] font-semibold text-white/70 border-none bg-transparent cursor-pointer transition-all hover:bg-white/[0.04] hover:text-white"
                    style={{ fontFamily: "'Meera', sans-serif' " }}
                  >
                    <div className="flex items-center gap-2">
                      <span style={{ fontFamily: "'Meera', sans-serif" }}>{item.label}</span>
                      <span className="text-[10px] text-white/30 font-sans">{item.en}</span>
                    </div>
                    <svg width="12" height="12" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                      className="opacity-40 transition-transform duration-200"
                      style={{ transform: isExpanded ? 'rotate(180deg)' : 'none' }}>
                      <path d="M1 3l4 4 4-4"/>
                    </svg>
                  </button>

                  {/* Expanded sub-items */}
                  {isExpanded && (
                    <div className="pl-3 pb-2 flex flex-col gap-0.5">
                      {item.dropdown.map((d) => (
                        <a
                          key={d.label}
                          href={d.href}
                          target={d.external ? '_blank' : undefined}
                          rel={d.external ? 'noopener noreferrer' : undefined}
                          onClick={() => handleNavClick(d.href)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl no-underline transition-all hover:bg-white/[0.05]"
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                            style={{ background: d.color + '18' }}>
                            {d.icon}
                          </div>
                          <div>
                            <div className="text-[13px] font-semibold text-white/65" style={{ fontFamily: "'Meera', sans-serif" }}>
                              {d.label}
                            </div>
                            <div className="text-[10px] text-white/25 font-sans">{d.sub}</div>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
