'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
    <section className="relative py-20 px-4 md:px-6">
      <div className="max-w-[1300px] mx-auto">

        {/* Header */}
        <div className="mb-12">
          <div className="section-label mb-3">Resources by Department</div>
          <h2 className="text-[clamp(26px,4vw,44px)] font-[900] tracking-[-0.03em] text-white leading-tight" style={{ fontFamily: "'Meera', sans-serif" }}>
            വകുപ്പ് അനുസരിച്ചുള്ള{' '}
            <span className="text-white/40">വിവര ശേഖരം</span>
          </h2>
        </div>

        {/* Department grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="glass-card rounded-[22px] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(0,0,0,0.3)] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-5 pb-4" style={{ borderBottom: `1px solid ${dept.color}20` }}>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: dept.color + '18', border: `1px solid ${dept.color}30` }}
                >
                  {dept.icon}
                </div>
                <div>
                  <div className="text-[14px] font-bold text-white/85" style={{ fontFamily: "'Meera', sans-serif" }}>
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
                    <span className="text-[12px] text-white/50 group-hover:text-white/80 transition-colors font-medium" style={{ fontFamily: "'Meera', sans-serif" }}>
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
    </section>
  );
}
