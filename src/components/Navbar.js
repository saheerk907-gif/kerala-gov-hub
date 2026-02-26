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
      <nav className="fixed top-0 left-0 right-0 z-[1000] px-4 md:px-12 h-14 flex items-center justify-between border-b border-white/[0.08]"
        style={{ background: 'rgba(5,5,5,0.75)', backdropFilter: 'saturate(180%) blur(20px)' }}>
        <a href="#" className="flex items-center gap-3 no-underline">
         <img 
  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Emblem_of_Kerala.svg/120px-Emblem_of_Kerala.svg.png"
  alt="Kerala Government Emblem"
  className="w-9 h-9 object-contain"
/>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-[#f5f5f7] leading-tight">കേരള സർക്കാർ ജീവനക്കാർ</span>
            <span className="text-[9px] font-medium text-[#6e6e73] font-sans uppercase tracking-wider">Kerala Gov Employee Hub</span>
          </div>
        </a>

        <ul className="hidden md:flex items-center gap-6 list-none">
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} className="text-xs text-[#86868b] no-underline hover:text-[#f5f5f7] transition-colors font-medium">{l.label}</a>
            </li>
          ))}
          <li>
            <a href="/admin" className="text-xs text-[#86868b] no-underline hover:text-[#2997ff] transition-colors font-sans font-semibold">Admin</a>
          </li>
        </ul>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden flex flex-col gap-[5px] p-2 bg-transparent border-none cursor-pointer">
          <span className="w-[18px] h-[1.5px] bg-[#86868b]" />
          <span className="w-[18px] h-[1.5px] bg-[#86868b]" />
          <span className="w-[18px] h-[1.5px] bg-[#86868b]" />
        </button>
      </nav>

      {mobileOpen && (
        <div className="fixed top-14 inset-x-0 bottom-0 z-[999] p-6 flex flex-col"
          style={{ background: 'rgba(5,5,5,0.97)', backdropFilter: 'blur(20px)' }}>
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
              className="block py-4 text-base text-[#86868b] no-underline border-b border-white/[0.08] hover:text-white transition-colors">
              {l.label}
            </a>
          ))}
          <a href="/admin" onClick={() => setMobileOpen(false)}
            className="block py-4 text-base text-[#2997ff] no-underline font-sans font-semibold">
            Admin Panel
          </a>
        </div>
      )}
    </>
  );
}
