'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const F1 = '#2a3552';
const F2 = '#1e2a44';
const D  = '#162038';

function ResourcesIllustration() {
  return (
    <svg viewBox="0 0 600 420" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden="true">

      {/* Stacked books — right side */}
      {/* Book 4 (bottom) */}
      <g transform="translate(490,310)">
        <rect x="-80" y="-16" width="160" height="32" rx="5" fill="#253048"/>
        <rect x="-80" y="-16" width="14"  height="32" rx="3" fill={D}/>
      </g>
      {/* Book 3 */}
      <g transform="translate(487,272)">
        <rect x="-76" y="-16" width="152" height="32" rx="5" fill={F2}/>
        <rect x="-76" y="-16" width="13"  height="32" rx="3" fill={D}/>
      </g>
      {/* Book 2 */}
      <g transform="translate(492,234)">
        <rect x="-78" y="-16" width="156" height="32" rx="5" fill={F1}/>
        <rect x="-78" y="-16" width="14"  height="32" rx="3" fill={D}/>
        {/* Title lines */}
        <rect x="-52" y="-8" width="80" height="6" rx="3" fill={D}/>
        <rect x="-52" y="3"  width="55" height="5" rx="3" fill={D}/>
      </g>
      {/* Book 1 (top) */}
      <g transform="translate(486,196)">
        <rect x="-74" y="-16" width="148" height="32" rx="5" fill="#2e3f60"/>
        <rect x="-74" y="-16" width="13"  height="32" rx="3" fill={D}/>
        <rect x="-50" y="-8" width="72" height="6" rx="3" fill={D}/>
        <rect x="-50" y="3"  width="48" height="5" rx="3" fill={D}/>
      </g>

      {/* Open book — center right */}
      <g transform="translate(448,100)">
        {/* Left page */}
        <path d="M-90,0 Q-45,-18 0,0 L0,110 Q-45,92 -90,110 Z" fill={F1}/>
        {/* Right page */}
        <path d="M0,0 Q45,-18 90,0 L90,110 Q45,92 0,110 Z" fill={F2}/>
        {/* Spine */}
        <line x1="0" y1="0" x2="0" y2="110" stroke={D} strokeWidth="3"/>
        {/* Left page lines */}
        {[20,34,48,62,76,90].map((y,i)=>(
          <line key={`l${i}`} x1={-80} y1={y} x2={i%3===2?-28:-12} y2={y}
            stroke={D} strokeWidth="4" strokeLinecap="round"/>
        ))}
        {/* Right page lines */}
        {[20,34,48,62,76,90].map((y,i)=>(
          <line key={`r${i}`} x1={12} y1={y} x2={i%4===3?52:80} y2={y}
            stroke={D} strokeWidth="4" strokeLinecap="round"/>
        ))}
        {/* Page curl shadow */}
        <path d="M-90,110 Q-45,92 0,110" fill="none" stroke={D} strokeWidth="2" opacity="0.5"/>
        <path d="M0,110 Q45,92 90,110"  fill="none" stroke={D} strokeWidth="2" opacity="0.5"/>
      </g>

      {/* Folder stack — bottom left of cluster */}
      <g transform="translate(356,320)">
        {/* Back folder */}
        <path d="M-52,-42 L-52,42 Q-52,50 -44,50 L52,50 Q60,50 60,42 L60,-28 Q60,-36 52,-36 L-10,-36 L-22,-42 Z"
          fill={F2}/>
        {/* Front folder */}
        <path d="M-58,-32 L-58,46 Q-58,54 -50,54 L50,54 Q58,54 58,46 L58,-18 Q58,-26 50,-26 L-8,-26 L-20,-32 Z"
          fill={F1}/>
        {/* Tab */}
        <path d="M-58,-32 L-38,-32 L-26,-26 L-58,-26 Z" fill="#2e3f60"/>
        {/* Lines on folder */}
        <rect x="-44" y="-10" width="88" height="6" rx="3" fill={D}/>
        <rect x="-44" y="4"   width="70" height="6" rx="3" fill={D}/>
        <rect x="-44" y="18"  width="80" height="6" rx="3" fill={D}/>
      </g>

      {/* Magnifying glass — top area */}
      <g transform="translate(370,76)">
        <circle r="26" fill="none" stroke={F1} strokeWidth="10"/>
        <line x1="18" y1="18" x2="40" y2="40" stroke={F1} strokeWidth="10" strokeLinecap="round"/>
        <circle r="16" fill={D}/>
      </g>

      {/* Accent dots */}
      <circle cx="330" cy="185" r="4"   fill={F1}/>
      <circle cx="340" cy="202" r="2.5" fill={F2}/>
      <circle cx="576" cy="370" r="5"   fill={F1}/>
      <circle cx="564" cy="388" r="3"   fill={F2}/>
    </svg>
  );
}

const FALLBACK = [
  {
    id: 'f1', icon: '💼', color: '#2997ff', title_ml: 'ശമ്പളം & ബത്ത', subtitle_en: 'Salary & Allowances',
    resource_links: [
      { id: 'l1', label: 'Basic Pay Scale', href: '#calculator' },
      { id: 'l2', label: 'DA Rates History', href: '#benefits' },
      { id: 'l3', label: 'HRA Zone List', href: '#benefits' },
      { id: 'l4', label: 'TA / Travelling Allowance', href: '#benefits' },
      { id: 'l5', label: 'Overtime Allowance', href: '#benefits' },
      { id: 'l6', label: 'Uniform Allowance', href: '#benefits' },
    ],
  },
  {
    id: 'f2', icon: '🏦', color: '#30d158', title_ml: 'പ്രോവിഡന്റ് ഫണ്ട്', subtitle_en: 'GPF / NPS',
    resource_links: [
      { id: 'l7', label: 'GPF Calculator', href: '/gpf' },
      { id: 'l8', label: 'DA Arrear Calculator', href: '/da-arrear' },
      { id: 'l9', label: 'NPS Contribution', href: '/nps' },
      { id: 'l10', label: 'NPS vs OPS Comparison', href: '/nps' },
      { id: 'l11', label: 'GPF Interest Rates', href: '/gpf' },
      { id: 'l12', label: 'Nomination Form', href: '/gpf' },
    ],
  },
  {
    id: 'f3', icon: '🏥', color: '#ff9f0a', title_ml: 'ആരോഗ്യ ഇൻഷുറൻസ്', subtitle_en: 'Medisep & Medical',
    resource_links: [
      { id: 'l13', label: 'Medisep Coverage', href: '/medisep' },
      { id: 'l14', label: 'Empanelled Hospitals', href: '/medisep' },
      { id: 'l15', label: 'Cashless Treatment', href: '/medisep' },
      { id: 'l16', label: 'Claim Procedure', href: '/medisep' },
      { id: 'l17', label: 'Dependant Coverage', href: '/medisep' },
      { id: 'l18', label: 'Premium Rates', href: '/medisep' },
    ],
  },
  {
    id: 'f4', icon: '📖', color: '#bf5af2', title_ml: 'സർവ്വീസ് ചട്ടങ്ങൾ', subtitle_en: 'Kerala Service Rules',
    resource_links: [
      { id: 'l19', label: 'KSR Part I — General', href: '/ksr' },
      { id: 'l20', label: 'KSR Part II — Leave', href: '/ksr' },
      { id: 'l21', label: 'KSR Part III — Pay', href: '/ksr' },
      { id: 'l22', label: 'Leave Encashment', href: '/ksr' },
      { id: 'l23', label: 'Earned Leave Rules', href: '/leave' },
      { id: 'l24', label: 'Study Leave', href: '/ksr' },
    ],
  },
  {
    id: 'f5', icon: '🎖️', color: '#ff453a', title_ml: 'പെൻഷൻ & വിരമിക്കൽ', subtitle_en: 'Pension & Retirement',
    resource_links: [
      { id: 'l25', label: 'Pension Calculation', href: '#benefits' },
      { id: 'l26', label: 'Gratuity Rules', href: '#benefits' },
      { id: 'l27', label: 'Family Pension', href: '#benefits' },
      { id: 'l28', label: 'DCRG', href: '#benefits' },
      { id: 'l29', label: 'Commutation of Pension', href: '#benefits' },
      { id: 'l30', label: 'Retirement Age', href: '#benefits' },
    ],
  },
  {
    id: 'f6', icon: '📋', color: '#c8960c', title_ml: 'ഉത്തരവുകൾ & ഫോമുകൾ', subtitle_en: 'GOs & Forms',
    resource_links: [
      { id: 'l31', label: 'Latest Finance GOs', href: '#orders' },
      { id: 'l32', label: 'Pay Revision GOs', href: '#orders' },
      { id: 'l33', label: 'Leave Application Form', href: '#orders' },
      { id: 'l34', label: 'GPF Withdrawal Form', href: '#orders' },
      { id: 'l35', label: 'Service Certificate Form', href: '#orders' },
      { id: 'l36', label: 'Pension Application', href: '#orders' },
    ],
  },
];

export default function DepartmentResourcesSection() {
  const [departments, setDepartments] = useState(FALLBACK);

  useEffect(() => {
    if (!SUPABASE_URL || !SUPABASE_KEY) return;
    fetch(`${SUPABASE_URL}/rest/v1/resource_departments?select=*,resource_links(*)&order=sort_order&is_active=eq.true`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
    })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          data.forEach(d => {
            if (Array.isArray(d.resource_links)) {
              d.resource_links = d.resource_links
                .filter(l => l.is_active !== false)
                .sort((a, b) => a.sort_order - b.sort_order);
            }
          });
          setDepartments(data);
        }
      })
      .catch(() => {/* keep fallback */});
  }, []);

  return (
    <section className="relative py-3 md:py-4 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">

        {/* Gradient border wrapper */}
        <div style={{
          background: 'linear-gradient(135deg,rgba(140,80,240,0.55),rgba(60,130,255,0.55))',
          padding: '1.5px', borderRadius: 28,
        }}>
          {/* SVG illustrated card */}
          <div className="relative overflow-hidden" style={{
            background: '#080c14',
            borderRadius: 26,
          }}>
            {/* SVG illustration — behind everything */}
            <ResourcesIllustration />
            {/* Corner fades — lighter so the full-width grid stays readable */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 1,
              background: 'radial-gradient(ellipse at top left, rgba(8,12,20,0.70) 0%, transparent 60%)' }}/>
            <div style={{ position: 'absolute', inset: 0, zIndex: 1,
              background: 'radial-gradient(ellipse at bottom right, rgba(8,12,20,0.80) 0%, transparent 55%)' }}/>
            <div style={{ position: 'absolute', inset: 0, zIndex: 1,
              background: 'linear-gradient(to bottom, rgba(8,12,20,0.60) 0%, transparent 18%, rgba(8,12,20,0.55) 100%)' }}/>
            {/* Purple accent glow */}
            <div style={{ position: 'absolute', top: 0, right: 0, width: '45%', height: '35%', zIndex: 1,
              background: 'radial-gradient(ellipse at top right, rgba(140,80,240,0.08) 0%, transparent 70%)' }}/>

            {/* Content */}
            <div className="relative p-5 md:p-7" style={{ zIndex: 2 }}>

              {/* Header */}
              <div className="mb-5">
                <div className="section-label mb-1" style={{ color: '#bf5af2', opacity: 1, fontWeight: 800 }}>Resources by Department</div>
                <h2 className="text-[clamp(26px,4vw,38px)] font-[900] tracking-[-0.03em] text-white leading-tight"
                  style={{ fontFamily: "var(--font-noto-malayalam), sans-serif", textShadow: '0 2px 20px rgba(0,0,0,0.9)' }}>
                  വകുപ്പ് അനുസരിച്ചുള്ള{' '}
                  <span className="text-white/60">വിവര ശേഖരം</span>
                </h2>
                <div className="h-[3px] w-12 mt-2 rounded-full"
                  style={{ background: 'linear-gradient(to right, #bf5af2, transparent)' }}/>
              </div>

              {/* Department grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {departments.map((dept) => (
                  <div
                    key={dept.id}
                    className="rounded-[18px] p-4 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', backdropFilter: 'blur(10px)' }}
                  >
                    {/* Dept header */}
                    <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: `1px solid ${dept.color}20` }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                        style={{ background: dept.color + '18', border: `1px solid ${dept.color}30` }}>
                        {dept.icon}
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-white/85" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                          {dept.title_ml}
                        </div>
                        <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: dept.color + 'aa' }}>
                          {dept.subtitle_en}
                        </div>
                      </div>
                    </div>

              {/* Links */}
              <div className="flex flex-col gap-1">
                {(dept.resource_links || []).map((link) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    className="group flex items-center justify-between py-1.5 px-2 rounded-lg no-underline hover:bg-white/[0.05] transition-all duration-150"
                  >
                    <span className="text-[12px] text-white/50 group-hover:text-white/80 transition-colors font-medium" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                      {link.label}
                    </span>
                    <span className="text-white/15 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all text-[11px]">→</span>
                  </Link>
                ))}
              </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
