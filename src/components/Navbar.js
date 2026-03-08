'use client';
import { useState, useEffect, useRef } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import SearchModal from '@/components/SearchModal';

const NAV_ITEMS = [
  {
    label: 'Tools',
    en: 'Tools',
    href: '#tools',
    dropdown: [
      { label: '12th PRC Calculator',   sub: 'Pay Revision 2024',      href: '/prc',       badge: 'NEW'  },
      { label: 'NPS vs APS',            sub: 'Pension Comparison',      href: '/nps-aps',   badge: 'NEW'  },
      { label: 'Pension Calculator',    sub: 'Monthly Pension',         href: '/pension',   badge: 'NEW'  },
      { label: 'DCRG Calculator',       sub: 'Retirement Gratuity',     href: '/dcrg',      badge: 'NEW'  },
      { label: 'DA Arrear Calculator',  sub: '11th PRC · Mar 2021',     href: '/da-arrear', badge: 'NEW'  },
      { label: 'GPF Calculator',        sub: 'Provident Fund',          href: '/gpf',       badge: null   },
      { label: 'Leave Calculator',      sub: 'EL, CL, ML',              href: '/prc',       badge: 'SOON' },
      { label: 'Medisep',              sub: 'Health Insurance Info',    href: '/medisep',   badge: null   },
    ],
  },
  {
    label: 'Govt Orders',
    en: 'Govt Orders',
    href: '#orders',
    dropdown: [
      { label: 'All Orders',            sub: 'All Government Orders',    href: '#orders'  },
      { label: 'DA Orders',            sub: 'Dearness Allowance',       href: '#orders'  },
      { label: 'Bonus / Festival',     sub: 'Bonus & Festival Allowance', href: '#orders' },
      { label: 'MEDISEP',             sub: 'Medical Insurance Orders', href: '#orders'  },
      { label: 'Pension',             sub: 'Pension Orders',            href: '#orders'  },
      { label: 'Pay Revision',         sub: 'Pay Revision Orders',      href: '#orders'  },
      { label: 'GPF / NPS',            sub: 'Provident Fund Orders',    href: '#orders'  },
      { label: 'Leave',                sub: 'Leave Rule Orders',        href: '#orders'  },
    ],
  },
  {
    label: 'Schemes',
    en: 'Schemes',
    href: '#services',
    dropdown: [
      { label: 'Kerala Service Rules',  sub: 'KSR Parts I, II, III',    href: '/ksr'      },
      { label: 'MEDISEP',              sub: 'Medical Insurance Scheme', href: '/medisep'  },
      { label: 'GPF',                  sub: 'General Provident Fund',   href: '/gpf'      },
      { label: 'NPS',                  sub: 'National Pension System',  href: '/nps-aps'  },
      { label: 'SLI',                  sub: 'State Life Insurance',     href: '#services' },
      { label: 'GIS',                  sub: 'Group Insurance Scheme',   href: '#services' },
    ],
  },
  {
    label: 'Dept Tests',
    en: 'Dept Tests',
    href: '/departmental-tests',
    dropdown: [
      { label: 'Common Tests',         sub: 'MOP, KSR, KFC, KTC…',     href: '/departmental-tests?dept=common'       },
      { label: 'Revenue Department',   sub: 'Revenue Test Papers I–IV', href: '/departmental-tests?dept=revenue'      },
      { label: 'Panchayat',           sub: 'Panchayat Test Papers',    href: '/departmental-tests?dept=panchayat'    },
      { label: 'Judiciary',           sub: 'Civil & Criminal Tests',   href: '/departmental-tests?dept=judiciary'    },
      { label: 'Police',              sub: 'Police Manual Test',       href: '/departmental-tests?dept=police'       },
      { label: 'Education',           sub: 'Kerala Education Rules',   href: '/departmental-tests?dept=education'    },
      { label: 'Forest',              sub: 'Forest Department Test',   href: '/departmental-tests?dept=forest'       },
      { label: 'Registration',        sub: 'Registration Test',        href: '/departmental-tests?dept=registration' },
      { label: 'All 64 Tests',        sub: 'Browse all departments',   href: '/departmental-tests'                   },
    ],
  },
  {
    label: 'Forms',
    en: 'Forms',
    href: '/forms',
    dropdown: [
      { label: 'All Forms',             sub: 'All 65+ Government Forms',      href: '/forms',           badge: 'NEW' },
      { label: 'Pension Forms (PRISM)', sub: 'Form 2, 4B, 5, 6, 8, 11…',     href: '/pension-forms',   badge: 'NEW' },
      { label: 'GPF Forms',             sub: 'PF Form A, B, B1, D, J',        href: '/forms?cat=GPF'               },
      { label: 'Leave Forms',           sub: 'Form 13 · Medical Certificate', href: '/forms?cat=Leave'             },
      { label: 'HBA Forms',             sub: 'House Building Advance',        href: '/forms?cat=HBA'               },
      { label: 'KFC Forms',             sub: 'KFC Form 1A–40',                href: '/forms?cat=KFC'               },
      { label: 'Treasury / TR Forms',   sub: 'TR 46, 47, 59C, 83B, 103, 104', href: '/forms?cat=Treasury'         },
      { label: 'NPS / GIS / SLI',       sub: 'PRAN, Option, Revival Forms',   href: '/forms?cat=NPS'              },
    ],
  },
  {
    label: 'Articles',
    en: 'Articles',
    href: '/articles',
    dropdown: [
      { label: 'All Articles',        sub: 'All published articles',     href: '/articles'               },
      { label: 'MEDISEP Articles',    sub: 'Claim, complaint, FAQ',       href: '/articles?cat=medisep'  },
      { label: 'Pension Articles',    sub: 'Calculation, rules',          href: '/articles?cat=pension'  },
      { label: 'KSR Articles',        sub: 'Service rule updates',        href: '/articles?cat=ksr'      },
      { label: 'DA / Pay Articles',   sub: 'Dearness allowance updates',  href: '/articles?cat=da'       },
      { label: 'Latest News',         sub: 'Government news feed',        href: '/news'                  },
    ],
  },
  {
    label: 'Portals',
    en: 'Portals',
    href: '#links',
    dropdown: [
      { label: 'SPARK',               sub: 'spark.gov.in',                       href: 'https://spark.gov.in',                    external: true },
      { label: 'e-Treasury',          sub: 'treasury.kerala.gov.in',             href: 'https://treasury.kerala.gov.in',          external: true },
      { label: 'MEDISEP Portal',      sub: 'medisep.kerala.gov.in',              href: 'https://medisep.kerala.gov.in',           external: true },
      { label: 'NPS / CRA',           sub: 'npscra.nsdl.co.in',                  href: 'https://www.npscra.nsdl.co.in',          external: true },
      { label: 'Finance Department',  sub: 'finance.kerala.gov.in',             href: 'https://www.finance.kerala.gov.in',       external: true },
      { label: 'Pension Portal',      sub: 'pension.treasury.kerala.gov.in',    href: 'https://pension.treasury.kerala.gov.in', external: true },
      { label: 'SLI Portal',          sub: 'sli.kerala.gov.in',                  href: 'https://sli.kerala.gov.in',              external: true },
      { label: 'Kerala.gov.in',       sub: 'Official Government Portal',        href: 'https://www.kerala.gov.in',              external: true },
    ],
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [scrolled, setScrolled]           = useState(false);
  const [openDropdown, setOpenDropdown]   = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [searchOpen, setSearchOpen]       = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenDropdown(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
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
            <picture>
              <source srcSet="/logo.webp" type="image/webp" />
              <img src="/logo.png" alt="Kerala Gov Logo" width={36} height={36}
                className="w-9 h-9 rounded-full object-cover ring-1 ring-[#c8960c]/40 shadow-[0_0_14px_rgba(200,150,12,0.2)] group-hover:ring-[#c8960c]/70 transition-all" />
            </picture>
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
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => {
              const isOpen = openDropdown === item.en;
              const cols = item.dropdown.length > 5 ? 2 : 1;
              return (
                <div key={item.en} className="relative">
                  <button
                    onClick={() => setOpenDropdown(isOpen ? null : item.en)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-all border-none bg-transparent cursor-pointer"
                    style={{
                      fontFamily: "'Meera', sans-serif",
                      color: isOpen ? '#ffffff' : 'rgba(255,255,255,0.55)',
                      background: isOpen ? 'rgba(255,255,255,0.07)' : 'transparent',
                    }}
                  >
                    {item.label}
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
                      className="opacity-40 transition-transform duration-200"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                      <path d="M1 3l3.5 3.5L8 3" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div
                      className="absolute top-full mt-2 rounded-xl overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.55)] z-50"
                      style={{
                        left: '50%',
                        transform: 'translateX(-50%)',
                        minWidth: cols === 2 ? '460px' : '240px',
                        background: 'rgba(20,22,26,0.99)',
                        border: '1px solid rgba(255,255,255,0.09)',
                        backdropFilter: 'blur(32px)',
                      }}
                    >
                      {/* Header */}
                      <div className="px-4 py-2.5 border-b border-white/[0.06]">
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">{item.en}</span>
                      </div>

                      {/* Items */}
                      <div className={`p-1.5 ${cols === 2 ? 'grid grid-cols-2' : 'flex flex-col'}`}>
                        {item.dropdown.map((d) => (
                          <a
                            key={d.label}
                            href={d.href}
                            target={d.external ? '_blank' : undefined}
                            rel={d.external ? 'noopener noreferrer' : undefined}
                            onClick={() => handleNavClick(d.href)}
                            className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg no-underline group/item transition-all duration-150 hover:bg-white/[0.06]"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[12.5px] font-semibold text-white/70 group-hover/item:text-white transition-colors leading-snug"
                                  style={{ fontFamily: "'Meera', sans-serif" }}>
                                  {d.label}
                                </span>
                                {d.badge && (
                                  <span className="text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wide flex-shrink-0"
                                    style={{
                                      background: d.badge === 'NEW' ? 'rgba(41,151,255,0.18)' : 'rgba(255,255,255,0.07)',
                                      color: d.badge === 'NEW' ? '#2997ff' : 'rgba(255,255,255,0.35)',
                                    }}>
                                    {d.badge}
                                  </span>
                                )}
                              </div>
                              <div className="text-[10.5px] text-white/28 mt-0.5 leading-none">{d.sub}</div>
                            </div>
                            {d.external && (
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                className="opacity-20 group-hover/item:opacity-50 flex-shrink-0 transition-opacity">
                                <path d="M1 9L9 1M9 1H4M9 1V6" />
                              </svg>
                            )}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Theme toggle + Mobile hamburger */}
          <div className="flex items-center gap-2">
          {/* Search button */}
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            title="Search (Ctrl+K)"
            className="flex items-center gap-2 rounded-lg px-2.5 h-8 transition-all duration-200 border-none cursor-pointer flex-shrink-0 hidden sm:flex"
            style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}
          >
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <span className="text-[11px] font-medium hidden md:block">Search</span>
            <kbd className="hidden lg:flex items-center text-[10px] text-white/25 border border-white/10 rounded px-1 py-0.5 font-mono leading-none">⌘K</kbd>
          </button>
          {/* Mobile search icon only */}
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="flex sm:hidden items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 border-none cursor-pointer flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
          <ThemeToggle />
          <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu"
            className="lg:hidden flex flex-col gap-[5px] p-2 bg-transparent border-none cursor-pointer">
            <span className={`block w-5 h-[1.5px] bg-white/60 transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
            <span className={`block w-5 h-[1.5px] bg-white/60 transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block w-5 h-[1.5px] bg-white/60 transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
          </button>
          </div>
        </div>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[999] flex flex-col pt-14 overflow-y-auto"
          style={{ background: 'rgba(14,16,18,0.99)', backdropFilter: 'blur(24px)' }}>
          <div className="px-3 py-3 flex flex-col">
            {NAV_ITEMS.map((item) => {
              const isExpanded = mobileExpanded === item.en;
              return (
                <div key={item.en} className="border-b border-white/[0.05] last:border-0">
                  <button
                    onClick={() => setMobileExpanded(isExpanded ? null : item.en)}
                    className="w-full flex items-center justify-between py-4 px-2 text-left border-none bg-transparent cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[15px] font-semibold text-white/75">{item.label}</span>
                    </div>
                    <svg width="12" height="12" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
                      className="text-white/30 transition-transform duration-200"
                      style={{ transform: isExpanded ? 'rotate(180deg)' : 'none' }}>
                      <path d="M1 3l4 4 4-4" />
                    </svg>
                  </button>

                  {isExpanded && (
                    <div className="pb-3 flex flex-col gap-0.5 pl-2">
                      {item.dropdown.map((d) => (
                        <a
                          key={d.label}
                          href={d.href}
                          target={d.external ? '_blank' : undefined}
                          rel={d.external ? 'noopener noreferrer' : undefined}
                          onClick={() => handleNavClick(d.href)}
                          className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg no-underline transition-all hover:bg-white/[0.05]"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-medium text-white/60" style={{ fontFamily: "'Meera', sans-serif" }}>{d.label}</span>
                              {d.badge && (
                                <span className="text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wide"
                                  style={{ background: d.badge === 'NEW' ? 'rgba(41,151,255,0.18)' : 'rgba(255,255,255,0.07)', color: d.badge === 'NEW' ? '#2997ff' : 'rgba(255,255,255,0.35)' }}>
                                  {d.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-white/25 mt-0.5">{d.sub}</div>
                          </div>
                          {d.external && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                              className="opacity-20 flex-shrink-0">
                              <path d="M1 9L9 1M9 1H4M9 1V6" />
                            </svg>
                          )}
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
