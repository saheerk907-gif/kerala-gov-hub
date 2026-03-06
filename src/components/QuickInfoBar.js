'use client';
import { useEffect, useRef, useState } from 'react';

const INFO_ITEMS = [
  {
    label: 'ക്ഷാമബത്ത (DA)',
    value: '35%',
    sub: 'July 2024 മുതൽ',
    color: '#2997ff',
    icon: '📈',
    note: '11th PRC — Current Rate',
  },
  {
    label: 'GPF പലിശ നിരക്ക്',
    value: '7.1%',
    sub: '2024-25 FY',
    color: '#30d158',
    icon: '🏦',
    note: 'Government Notification',
  },
  {
    label: 'വിരമിക്കൽ പ്രായം',
    value: '56',
    sub: 'വർഷം',
    color: '#ff9f0a',
    icon: '🎖️',
    note: 'KSR Rule 60',
  },
  {
    label: 'Medisep Coverage',
    value: '₹5L',
    sub: 'per family / year',
    color: '#ff453a',
    icon: '🏥',
    note: 'Cashless at empanelled hospitals',
  },
  {
    label: 'HRA (തിരുവനന്തപുരം)',
    value: '30%',
    sub: 'of Basic Pay',
    color: '#bf5af2',
    icon: '🏠',
    note: 'Grade A City',
  },
  {
    label: 'പെൻഷൻ — max service',
    value: '30 yr',
    sub: '60 half-year units',
    color: '#64d2ff',
    icon: '📋',
    note: 'KSR Part III',
  },
];

function InfoCard({ item, index }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => setVisible(true), index * 80);
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      className={`group relative flex flex-col rounded-2xl p-5 transition-all duration-500 cursor-default hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${item.color}10, transparent)` }}
      />

      {/* Top row: icon + label */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: item.color + '15', border: `1px solid ${item.color}25` }}
        >
          {item.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="text-[11px] font-bold text-white/50 leading-tight"
            style={{ fontFamily: "'Meera', sans-serif" }}
          >
            {item.label}
          </div>
          <div className="text-[9px] text-white/25 font-medium mt-0.5 uppercase tracking-wider">
            {item.note}
          </div>
        </div>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1.5 mt-auto">
        <span
          className="text-[28px] font-[900] tracking-tight leading-none"
          style={{ color: item.color }}
        >
          {item.value}
        </span>
        <span className="text-[11px] text-white/35 font-medium">{item.sub}</span>
      </div>

      {/* Bottom accent */}
      <div
        className="absolute bottom-0 left-4 right-4 h-[1.5px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${item.color}60, transparent)` }}
      />
    </div>
  );
}

export default function QuickInfoBar() {
  return (
    <section className="relative py-14 px-4 md:px-6">
      {/* Subtle separator */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }}
      />

      <div className="max-w-[1300px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="section-label mb-2">Quick Reference</div>
            <h2
              className="text-[clamp(20px,3vw,32px)] font-[900] tracking-[-0.02em] text-white leading-tight"
              style={{ fontFamily: "'Meera', sans-serif" }}
            >
              ഇപ്പോഴത്തെ നിരക്കുകൾ &amp;{' '}
              <span className="text-white/40">നിയമ വ്യവസ്ഥകൾ</span>
            </h2>
          </div>
          <p className="text-[11px] text-white/30 font-medium uppercase tracking-widest">
            Updated · FY 2025-26
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {INFO_ITEMS.map((item, i) => (
            <InfoCard key={item.label} item={item} index={i} />
          ))}
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-[10px] text-white/20 text-center">
          * ഔദ്യോഗിക വിജ്ഞാപനങ്ങൾ അടിസ്ഥാനമാക്കി — സ്ഥിരീകരണത്തിന് finance.kerala.gov.in സന്ദർശിക്കുക
        </p>
      </div>
    </section>
  );
}
