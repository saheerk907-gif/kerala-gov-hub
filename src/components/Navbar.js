'use client';
import { useState, useEffect } from 'react';

const socials = [
  {
    label: 'WhatsApp', href: 'https://wa.me/', color: '#25D366',
    icon: <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
  },
  {
    label: 'Facebook', href: 'https://facebook.com/', color: '#1877F2',
    icon: <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  },
  {
    label: 'YouTube', href: 'https://youtube.com/', color: '#FF0000',
    icon: <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
  },
  {
    label: 'Telegram', href: 'https://t.me/', color: '#0088cc',
    icon: <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>,
  },
];

const navLinks = [
  { href: '#services',   label: 'സേവന ചട്ടങ്ങൾ' },
  { href: '#benefits',   label: 'ആനുകൂല്യങ്ങൾ' },
  { href: '#orders',     label: 'ഉത്തരവുകൾ' },
  { href: '#calculator', label: 'PRC കാൽക്കുലേറ്റർ' },
  { href: '/da-arrear',  label: 'DA Arrear' },
  { href: '/nps-aps',   label: 'NPS vs APS' },
  { href: '#links',      label: 'പോർട്ടലുകൾ' },
];

const ticker = [
  '📢 12th PRC — ശമ്പള പരിഷ്കരണ കാൽക്കുലേറ്റർ ലഭ്യം',
  '📋 DA Revision — July 2024 മുതൽ 35% DA',
  '🏥 Medisep Premium Payment Deadline Extended',
  '📌 GPF Annual Statement — March 2025 Available',
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [scrolled,   setScrolled]     = useState(false);
  const [newsIdx,    setNewsIdx]       = useState(0);
  const [dateStr,    setDateStr]       = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setDateStr(new Date().toLocaleDateString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    }));
    const t = setInterval(() => setNewsIdx(i => (i + 1) % ticker.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      {/* ── Single unified header ──────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${
          scrolled ? 'shadow-[0_4px_30px_rgba(0,0,0,0.4)]' : ''
        }`}
        style={{
          background: scrolled ? 'rgba(18,20,22,0.95)' : 'rgba(18,20,22,0.75)',
          backdropFilter: 'saturate(180%) blur(24px)',
          WebkitBackdropFilter: 'saturate(180%) blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* ── Top strip — ticker + socials + date ─────────── */}
        <div
          className="hidden lg:flex items-center justify-between px-8 h-8"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          {/* Social icons */}
          <div className="flex items-center gap-0.5">
            {socials.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.label}
                className="flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200 text-white/30 hover:scale-110"
                onMouseEnter={e => { e.currentTarget.style.color = s.color; e.currentTarget.style.background = `${s.color}18`; }}
                onMouseLeave={e => { e.currentTarget.style.color = ''; e.currentTarget.style.background = ''; }}
              >
                {s.icon}
              </a>
            ))}
            {/* Divider */}
            <div className="w-px h-3.5 bg-white/10 mx-2" />
            {/* News ticker */}
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-[#2997ff]/20 text-[#2997ff] whitespace-nowrap">
                LIVE
              </span>
              <span
                key={newsIdx}
                className="text-[11px] text-white/45 font-medium animate-fade-up"
                style={{ fontFamily: "'Meera', sans-serif" }}
              >
                {ticker[newsIdx]}
              </span>
            </div>
          </div>

          {/* Right — quick portals + date */}
          <div className="flex items-center gap-1">
            {['SPARK|https://spark.gov.in', 'e-Treasury|https://treasury.kerala.gov.in', 'Finance Dept|https://www.finance.kerala.gov.in'].map(item => {
              const [label, href] = item.split('|');
              return (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="text-[10px] font-semibold text-white/35 no-underline hover:text-white/75 transition-colors px-2 py-1 rounded hover:bg-white/[0.05]">
                  {label}
                </a>
              );
            })}
            <div className="w-px h-3.5 bg-white/10 mx-1" />
            <span className="text-[10px] text-white/28 whitespace-nowrap font-medium">
              {dateStr}
            </span>
          </div>
        </div>

        {/* ── Main nav row ─────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 md:px-8 h-14">

          {/* Brand */}
          <a href="#" className="flex items-center gap-3 no-underline group flex-shrink-0">
            <img
              src="/logo.png"
              alt="Kerala Gov Logo"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover ring-1 ring-[#c8960c]/40 shadow-[0_0_14px_rgba(200,150,12,0.2)] group-hover:ring-[#c8960c]/70 transition-all"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-[15px] font-bold text-white/90 group-hover:text-white transition-colors" style={{ fontFamily: "'Meera', sans-serif" }}>
                കേരള സർക്കാർ ജീവനക്കാർ
              </span>
              <span className="text-[10px] font-semibold text-white/35 uppercase tracking-widest font-sans">
                Kerala Gov Employee Hub
              </span>
            </div>
          </a>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(l => (
              <a
                key={l.href}
                href={l.href}
                className="px-3.5 py-1.5 text-[13px] font-semibold text-white/55 no-underline hover:text-white hover:bg-white/[0.07] rounded-lg transition-all duration-200"
                style={{ fontFamily: "'Meera', sans-serif" }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            className="lg:hidden flex flex-col gap-[5px] p-2 bg-transparent border-none cursor-pointer"
          >
            <span className={`block w-5 h-[1.5px] bg-white/60 transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
            <span className={`block w-5 h-[1.5px] bg-white/60 transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block w-5 h-[1.5px] bg-white/60 transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
          </button>
        </div>
      </header>

      {/* ── Mobile drawer ─────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[999] flex flex-col pt-[56px]"
          style={{ background: 'rgba(18,20,22,0.98)', backdropFilter: 'blur(24px)' }}
        >
          <div className="px-6 py-4 flex flex-col gap-1">
            {navLinks.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block py-3.5 px-4 text-[16px] font-semibold text-white/65 no-underline border-b border-white/[0.06] hover:text-white hover:bg-white/[0.04] rounded-lg transition-all"
                style={{ fontFamily: "'Meera', sans-serif" }}
              >
                {l.label}
              </a>
            ))}
            {/* Social icons in mobile */}
            <div className="flex items-center gap-3 pt-6 px-2">
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-xl text-white/40 hover:text-white transition-all"
                  style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}
                  onMouseEnter={e => { e.currentTarget.style.color = s.color; }}
                  onMouseLeave={e => { e.currentTarget.style.color = ''; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
