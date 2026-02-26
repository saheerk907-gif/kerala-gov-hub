'use client';
import { useState } from 'react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = [
    { href: '#services', label: 'സേവന ചട്ടങ്ങൾ' },
    { href: '#benefits', label: 'ആനുകൂല്യങ്ങൾ' },
    { href: '#orders', label: 'ഉത്തരവുകൾ' },
    { href: '#links', label: 'പോർട്ടലുകൾ' },
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[1000] px-4 md:px-12 h-14 flex items-center justify-between border-b border-white/[0.08]"
        style={{ background: 'rgba(5,5,5,0.75)', backdropFilter: 'saturate(180%) blur(20px)' }}
      >
        <a href="#" className="flex items-center gap-3 no-underline">
          {/* Kerala Government Emblem - inline SVG, always works */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className="w-9 h-9 flex-shrink-0"
          >
            {/* Outer circle - gold */}
            <circle cx="50" cy="50" r="48" fill="#c8960c" />
            <circle cx="50" cy="50" r="44" fill="#1a1a1a" />
            <circle cx="50" cy="50" r="40" fill="#c8960c" />
            <circle cx="50" cy="50" r="36" fill="#0a2240" />

            {/* Elephant head - simplified */}
            <ellipse cx="50" cy="52" rx="18" ry="16" fill="#c8960c" />
            {/* Elephant ears */}
            <ellipse cx="34" cy="50" rx="8" ry="10" fill="#c8960c" />
            <ellipse cx="66" cy="50" rx="8" ry="10" fill="#c8960c" />
            {/* Elephant forehead */}
            <ellipse cx="50" cy="44" rx="12" ry="9" fill="#c8960c" />
            {/* Eyes */}
            <circle cx="44" cy="46" r="2" fill="#0a2240" />
            <circle cx="56" cy="46" r="2" fill="#0a2240" />
            {/* Trunk */}
            <path d="M 44 58 Q 36 65 40 72 Q 44 78 50 74" stroke="#c8960c" strokeWidth="4" fill="none" strokeLinecap="round" />
            {/* Tusk */}
            <path d="M 42 56 Q 32 60 30 68" stroke="#f5f5f0" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Stars at top */}
            <text x="50" y="22" textAnchor="middle" fontSize="8" fill="#c8960c">★ ★ ★</text>

            {/* Bottom text arc - Kerala */}
            <path id="bottomArc" d="M 18 65 A 35 35 0 0 0 82 65" fill="none" />
            <text fontSize="7" fill="#f5f5f0" fontWeight="bold" fontFamily="serif">
              <textPath href="#bottomArc" startOffset="15%">KERALA</textPath>
            </text>
          </svg>

          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-[#f5f5f7] leading-tight">കേരള സർക്കാർ ജീവനക്കാർ</span>
            <span className="text-[9px] font-medium text-[#6e6e73] font-sans uppercase tracking-wider">Kerala Gov Employee Hub</span>
          </div>
        </a>

        <ul className="hidden md:flex items-center gap-6 list-none">
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} className="text-xs text-[#86868b] no-underline hover:text-[#f5f5f7] transition-colors font-medium">
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a href="/admin" className="text-xs text-[#86868b] no-underline hover:text-[#2997ff] transition-colors font-sans font-semibold">
              Admin
            </a>
          </li>
        </ul>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-[5px] p-2 bg-transparent border-none cursor-pointer"
        >
          <span className="w-[18px] h-[1.5px] bg-[#86868b]" />
          <span className="w-[18px] h-[1.5px] bg-[#86868b]" />
          <span className="w-[18px] h-[1.5px] bg-[#86868b]" />
        </button>
      </nav>

      {mobileOpen && (
        <div
          className="fixed top-14 inset-x-0 bottom-0 z-[999] p-6 flex flex-col"
          style={{ background: 'rgba(5,5,5,0.97)', backdropFilter: 'blur(20px)' }}
        >
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block py-4 text-base text-[#86868b] no-underline border-b border-white/[0.08] hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/admin"
            onClick={() => setMobileOpen(false)}
            className="block py-4 text-base text-[#2997ff] no-underline font-sans font-semibold"
          >
            Admin Panel
          </a>
        </div>
      )}
    </>
  );
}
