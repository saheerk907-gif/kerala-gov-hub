'use client';
import { useState } from 'react';

export default function FAQSection({ faqs, accentColor = '#2997ff' }) {
  const [open, setOpen] = useState(null);

  return (
    <div className="mt-10 max-w-[960px] mx-auto px-4">
      <div className="section-label mb-2">FAQ</div>
      <h2 className="text-[clamp(18px,2.5vw,26px)] font-[900] tracking-[-0.02em] text-white mb-6"
        style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
        Frequently Asked Questions
      </h2>
      <div className="flex flex-col gap-2">
        {faqs.map((faq, i) => (
          <div key={i}
            className="rounded-2xl overflow-hidden transition-all duration-200"
            style={{
              border: `1px solid ${open === i ? accentColor + '35' : 'rgba(255,255,255,0.07)'}`,
              background: open === i ? accentColor + '07' : 'rgba(255,255,255,0.02)',
            }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left bg-transparent border-none cursor-pointer gap-4"
            >
              <span className="text-[14px] font-bold text-white/80 leading-snug"
                style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                {faq.q}
              </span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" className="flex-shrink-0 transition-transform duration-200"
                style={{ transform: open === i ? 'rotate(180deg)' : 'none', color: open === i ? accentColor : 'rgba(255,255,255,0.3)' }}>
                <path d="M2 5l5 5 5-5"/>
              </svg>
            </button>
            {open === i && (
              <div className="px-5 pb-5">
                <p className="text-[13px] text-white/55 leading-relaxed"
                  style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                  {faq.a}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
