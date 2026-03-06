'use client';
import { useEffect, useRef, useState } from 'react';

// Kerala 11th PRC DA revision history
const DA_HISTORY = [
  { label: 'Jan 2022', value: 28 },
  { label: 'Jul 2022', value: 31 },
  { label: 'Jan 2023', value: 33 },
  { label: 'Jan 2024', value: 35 },
  { label: 'Jul 2024', value: 35 },
];

const STATS = [
  { label: 'GPF പലിശ', value: '7.1%', sub: '2024-25', color: '#30d158' },
  { label: 'HRA — TVM', value: '30%', sub: 'of Basic Pay', color: '#ff9f0a' },
  { label: 'വിരമിക്കൽ', value: '56 yrs', sub: 'KSR Rule 60', color: '#bf5af2' },
  { label: 'Medisep', value: '₹5L', sub: 'family / year', color: '#ff453a' },
  { label: 'Max Pension', value: '50%', sub: 'of Basic Pay', color: '#64d2ff' },
  { label: 'DCRG Max', value: '₹20L', sub: 'KSR Rule 77', color: '#c8960c' },
];

// Build SVG sparkline path from data points
function buildSparkline(data, w, h, pad = 8) {
  const vals = data.map(d => d.value);
  const min = Math.min(...vals) - 2;
  const max = Math.max(...vals) + 2;
  const xStep = (w - pad * 2) / (vals.length - 1);
  const points = vals.map((v, i) => {
    const x = pad + i * xStep;
    const y = h - pad - ((v - min) / (max - min)) * (h - pad * 2);
    return [x, y];
  });
  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  const area = `${line} L${points[points.length-1][0]},${h} L${points[0][0]},${h} Z`;
  return { line, area, points };
}

function DACard() {
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(28);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true);
        // Animate count from first DA value to current
        const start = performance.now();
        const from = 28, to = 35, dur = 1600;
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setCount(Math.round(from + (to - from) * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const { line, area, points } = buildSparkline(DA_HISTORY, 200, 70);

  return (
    <div
      ref={ref}
      className={`relative rounded-2xl p-6 overflow-hidden transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ background: 'linear-gradient(135deg, rgba(41,151,255,0.12) 0%, rgba(41,151,255,0.04) 100%)', border: '1px solid rgba(41,151,255,0.2)' }}
    >
      {/* Background glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[50px] pointer-events-none" style={{ background: 'rgba(41,151,255,0.15)' }} />

      <div className="relative flex flex-col h-full">
        <div className="flex items-start justify-between mb-1">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2997ff]/70 mb-1">Current DA Rate</div>
            <div className="text-[11px] text-white/40">11th PRC · ക്ഷാമബത്ത</div>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-bold text-[#30d158] px-2 py-1 rounded-full"
            style={{ background: 'rgba(48,209,88,0.1)', border: '1px solid rgba(48,209,88,0.2)' }}>
            ↑ Revised
          </span>
        </div>

        <div className="flex items-end gap-2 my-3">
          <span className="text-[56px] font-[900] tracking-[-0.04em] leading-none text-white">{count}</span>
          <span className="text-[28px] font-black text-[#2997ff] mb-2">%</span>
        </div>

        <div className="text-[12px] text-white/40 mb-4">Effective <span className="text-white/70 font-semibold">July 2024</span> onwards</div>

        {/* Sparkline */}
        <div className="mt-auto">
          <svg width="100%" viewBox="0 0 200 70" className="overflow-visible">
            <defs>
              <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2997ff" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#2997ff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={area} fill="url(#spark-fill)" />
            <path d={line} fill="none" stroke="#2997ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {points.map((p, i) => (
              <g key={i}>
                <circle cx={p[0]} cy={p[1]} r={i === points.length - 1 ? 5 : 3}
                  fill={i === points.length - 1 ? '#2997ff' : 'rgba(41,151,255,0.5)'}
                  stroke={i === points.length - 1 ? 'rgba(41,151,255,0.3)' : 'none'}
                  strokeWidth="4" />
                <text x={p[0]} y={p[1] - 8} textAnchor="middle"
                  fontSize="8" fill="rgba(255,255,255,0.4)" fontWeight="700">
                  {DA_HISTORY[i].value}%
                </text>
              </g>
            ))}
          </svg>
          <div className="flex justify-between mt-1">
            {DA_HISTORY.map((d, i) => (
              <span key={i} className="text-[8px] text-white/25 font-medium">{d.label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatPill({ stat, index }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => setVisible(true), index * 60);
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-500 hover:-translate-y-0.5 cursor-default ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', transitionDelay: `${index * 60}ms` }}
    >
      <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: stat.color }} />
      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-white/35 font-semibold uppercase tracking-wider truncate">{stat.label}</div>
        <div className="text-[11px] text-white/25 truncate">{stat.sub}</div>
      </div>
      <div className="text-[20px] font-[900] tracking-tight flex-shrink-0" style={{ color: stat.color }}>
        {stat.value}
      </div>
    </div>
  );
}

export default function QuickInfoBar() {
  return (
    <section className="relative py-12 px-4 md:px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />

      <div className="max-w-[1300px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <div className="section-label mb-2">Live Rates</div>
            <h2 className="text-[clamp(20px,3vw,30px)] font-[900] tracking-[-0.02em] text-white"
              style={{ fontFamily: "'Meera', sans-serif" }}>
              ഇപ്പോഴത്തെ നിരക്കുകൾ{' '}<span className="text-white/35">ഒറ്റ നോട്ടത്തിൽ</span>
            </h2>
          </div>
          <span className="text-[10px] text-white/25 font-bold uppercase tracking-widest">FY 2025-26</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4">
          {/* Left: DA featured card */}
          <DACard />

          {/* Right: stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 content-start">
            {STATS.map((s, i) => <StatPill key={s.label} stat={s} index={i} />)}
          </div>
        </div>

        <p className="mt-5 text-[10px] text-white/15 text-center">
          * ഔദ്യോഗിക G.O. അടിസ്ഥാനമാക്കി — confirmation: finance.kerala.gov.in
        </p>
      </div>
    </section>
  );
}
