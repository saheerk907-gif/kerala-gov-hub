'use client';
import { useState } from 'react';

const announcements = [
  { icon: '📢', text: '12th PRC ഉത്തരവ് — ശമ്പള പരിഷ്കരണ കാൽക്കുലേറ്റർ ഉടൻ ലഭ്യമാകും', color: '#2997ff' },
  { icon: '📋', text: 'DA Revision — July 2024 മുതൽ 35% Dearness Allowance പ്രഭാവത്തിൽ', color: '#30d158' },
  { icon: '🏥', text: 'Medisep 2025-26 — Premium Payment Deadline: April 15, 2026', color: '#ff9f0a' },
  { icon: '📌', text: 'GPF Annual Statement 2024-25 — ഇപ്പോൾ SPARK-ൽ ലഭ്യം', color: '#bf5af2' },
  { icon: '💼', text: 'Income Tax Filing — Assessment Year 2025-26 Deadline: March 31, 2026', color: '#ff453a' },
];

export default function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div
      className="relative overflow-hidden border-b"
      style={{
        background: 'rgba(41,151,255,0.06)',
        borderColor: 'rgba(41,151,255,0.15)',
      }}
    >
      <div className="flex items-center h-9 px-4">
        {/* Label */}
        <div className="flex items-center gap-1.5 flex-shrink-0 mr-4 pl-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2997ff] animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#2997ff] whitespace-nowrap">
            Announcements
          </span>
        </div>

        {/* Scrolling ticker */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex gap-12 animate-marquee whitespace-nowrap">
            {[...announcements, ...announcements].map((a, i) => (
              <span key={i} className="inline-flex items-center gap-2 text-[11px] text-white/50 font-medium" style={{ fontFamily: "'Meera', sans-serif" }}>
                <span>{a.icon}</span>
                <span>{a.text}</span>
                <span className="text-white/15 mx-2">◆</span>
              </span>
            ))}
          </div>
        </div>

        {/* Dismiss */}
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 ml-3 text-white/25 hover:text-white/60 transition-colors text-sm font-bold"
        >
          ×
        </button>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
