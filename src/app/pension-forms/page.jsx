'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';

const PRISM_BASE = 'https://prism.kerala.gov.in/DownloadDocumentsServlet';

// All pension forms from PRISM (prism.kerala.gov.in/PenForms.jsp)
const FORMS = [
  { id: 1,  formNo: '2',                  file: 'FORM2.pdf',             title: 'Application for Pension/Gratuity, Death-cum-Retirement and Family Pension',                  category: 'Pension' },
  { id: 2,  formNo: '3',                  file: 'FORM2.pdf',             title: 'Form for Sending Pension Papers',                                                             category: 'Pension' },
  { id: 3,  formNo: '4B',                 file: 'FORM4B.pdf',            title: 'Nomination for D.C.R. Gratuity',                                                             category: 'Gratuity' },
  { id: 4,  formNo: '4D',                 file: 'FORM4D.pdf',            title: 'Nomination for D.C.R. Gratuity (when the employee has no family)',                           category: 'Gratuity' },
  { id: 5,  formNo: '5',                  file: 'FORM5.pdf',             title: 'Nomination for Non-Contributory Family Pension',                                             category: 'Family Pension' },
  { id: 6,  formNo: '5A',                 file: 'FORM5A.pdf',            title: 'Details of Family Pension',                                                                  category: 'Family Pension' },
  { id: 7,  formNo: '6',                  file: 'FORM6.pdf',             title: 'Application for Family Pension / Contributory Family Pension D.C.R. Gratuity',              category: 'Family Pension' },
  { id: 8,  formNo: '6A',                 file: 'FORM6A.pdf',            title: 'Form of Intimation',                                                                         category: 'Family Pension' },
  { id: 9,  formNo: '8',                  file: 'FORM8.pdf',             title: 'Indemnity Bond',                                                                             category: 'Bond' },
  { id: 10, formNo: '8A',                 file: 'FORM8A.pdf',            title: 'Indemnity Bond to be Executed by the Guardian of a Minor',                                  category: 'Bond' },
  { id: 11, formNo: '11',                 file: 'FORM11.pdf',            title: 'Formal Application for Pension / Commutation',                                              category: 'Pension' },
  { id: 12, formNo: '15',                 file: 'FORM15.pdf',            title: 'Nomination for Payment of Arrears of Pension',                                              category: 'Nomination' },
  { id: 13, formNo: '16',                 file: 'FORM16.pdf',            title: 'Nomination for Payment of Arrears of Family Pension',                                       category: 'Nomination' },
  { id: 14, formNo: '17',                 file: 'FORM17.pdf',            title: 'Notice of Modification of Nomination',                                                       category: 'Nomination' },
  { id: 15, formNo: 'Form A',             file: 'FORMA.pdf',             title: 'Commutation of Pension on Medical Examination',                                             category: 'Commutation' },
  { id: 16, formNo: 'Form B',             file: 'FORMB.pdf',             title: 'Form B',                                                                                     category: 'Commutation' },
  { id: 17, formNo: 'Form C',             file: 'FORMC.pdf',             title: 'Statement to be Filled in by the Applicant for Commutation of a Portion of Pension',       category: 'Commutation' },
  { id: 18, formNo: 'Form D',             file: 'FORMD.pdf',             title: 'Application for Commutation of Pension without Medical Examination',                        category: 'Commutation' },
  { id: 19, formNo: 'Form E(1)',           file: 'FORME(1).pdf',          title: 'Nomination',                                                                                 category: 'Nomination' },
  { id: 20, formNo: 'Form E',             file: 'FORME.pdf',             title: 'Application for Restoration of Commuted Portion of Pension',                               category: 'Commutation' },
  { id: 21, formNo: 'Schedule IV Form A', file: 'SCHEDULEIVFORMA.pdf',   title: 'Application for Injury Pension or Gratuity',                                                category: 'Special' },
  { id: 22, formNo: 'Schedule IV Form B', file: 'SCHEDULEIVFORMB.pdf',   title: 'Application for Family Pension (Extra Ordinary Pension)',                                   category: 'Special' },
  { id: 23, formNo: 'Schedule IV Form C', file: 'SCHEDULEIVFORMC.pdf',   title: 'Forms to be Used by the Medical Board when Reporting on Injuries',                         category: 'Special' },
  { id: 24, formNo: 'Nodal Proforma',     file: 'nodalnewproforma.pdf',  title: 'Proforma for Nodal Officer Change',                                                         category: 'Administrative' },
];

const CATEGORIES = ['All', ...Array.from(new Set(FORMS.map(f => f.category)))];

const CATEGORY_COLORS = {
  'Pension':        '#2997ff',
  'Family Pension': '#30d158',
  'Gratuity':       '#ff9f0a',
  'Commutation':    '#bf5af2',
  'Nomination':     '#64d2ff',
  'Bond':           '#ff453a',
  'Special':        '#ff6b00',
  'Administrative': '#8e8e93',
};

export default function PensionFormsPage() {
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('All');
  const [loading,  setLoading]  = useState(null); // form id being downloaded
  const formRef = useRef(null);
  const [formAction, setFormAction] = useState('');

  const filtered = FORMS.filter(f => {
    const matchCat = category === 'All' || f.category === category;
    const q = search.toLowerCase();
    const matchQ = !q || f.title.toLowerCase().includes(q) || f.formNo.toLowerCase().includes(q) || f.category.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  const download = (form) => {
    setLoading(form.id);
    const action = `${PRISM_BASE}?form,${form.id},${form.file}`;
    setFormAction(action);
    // Give React time to set the action, then submit
    setTimeout(() => {
      formRef.current?.submit();
      setTimeout(() => setLoading(null), 2000);
    }, 50);
  };

  return (
    <div className="relative min-h-screen bg-aurora overflow-x-hidden">
      {/* Hidden POST form — submits to PRISM to trigger PDF download */}
      <form
        ref={formRef}
        method="POST"
        action={formAction}
        target="_blank"
        style={{ display: 'none' }}
      />

      <div className="max-w-[960px] mx-auto px-4 pt-[100px] pb-16">

        {/* Header */}
        <div className="mb-8">
          <Link href="/"
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/30 hover:text-white/60 no-underline transition-colors mb-3">
            ← Back to Home
          </Link>
          <div className="text-[10px] font-black uppercase tracking-widest text-white/25 mb-2">Kerala Pension — PRISM</div>
          <h1 className="text-[clamp(22px,4vw,40px)] font-[900] tracking-[-0.03em] text-white leading-tight"
            style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
            Pension Forms
          </h1>
          <p className="text-[13px] text-white/35 mt-1">
            {FORMS.length} official forms — sourced from PRISM, Finance Department, Government of Kerala
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search forms by name or number..."
            className="flex-1 rounded-xl px-4 py-2.5 text-[14px] text-white outline-none focus:ring-1 focus:ring-white/20"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
          />
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className="px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all"
              style={{
                background: category === cat
                  ? (cat === 'All' ? '#2997ff' : CATEGORY_COLORS[cat] || '#2997ff')
                  : 'rgba(255,255,255,0.05)',
                color: category === cat ? '#fff' : 'rgba(255,255,255,0.45)',
                border: `1px solid ${category === cat
                  ? (cat === 'All' ? '#2997ff' : CATEGORY_COLORS[cat] || '#2997ff')
                  : 'rgba(255,255,255,0.08)'}`,
              }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Count */}
        <div className="text-[11px] text-white/25 mb-4">
          {filtered.length} of {FORMS.length} forms
        </div>

        {/* Forms table */}
        <div className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.08)' }}>

          {/* Table header — desktop only */}
          <div className="hidden md:grid grid-cols-[90px_1fr_130px_110px] gap-0 px-5 py-3"
            style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Form No.</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Title</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Category</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30 text-right">Download</div>
          </div>

          {filtered.length === 0 ? (
            <div className="px-5 py-12 text-center text-white/30 text-[14px]">
              No forms found for "{search}"
            </div>
          ) : (
            filtered.map((form, i) => {
              const color = CATEGORY_COLORS[form.category] || '#2997ff';
              const isLoading = loading === form.id;
              return (
                <div key={form.id}
                  className="px-4 py-4 transition-colors hover:bg-white/[0.02] md:grid md:grid-cols-[90px_1fr_130px_110px] md:items-center md:gap-0"
                  style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>

                  {/* Mobile: card layout — Desktop: row layout */}
                  <div className="flex items-start justify-between md:contents">

                    {/* Form number */}
                    <span className="text-[12px] font-black px-2.5 py-1 rounded-lg flex-shrink-0"
                      style={{ background: `${color}15`, color }}>
                      {form.formNo}
                    </span>

                    {/* Download button — shown top-right on mobile */}
                    <button
                      onClick={() => download(form)}
                      disabled={isLoading}
                      className="md:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black transition-all disabled:opacity-50 disabled:cursor-wait"
                      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
                      {isLoading ? (
                        <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
                      ) : (
                        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                          <path d="M6 1v7M3 6l3 3 3-3M1 10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                      PDF
                    </button>
                  </div>

                  {/* Title */}
                  <div className="mt-2 md:mt-0 md:pr-4">
                    <div className="text-[13px] text-white/75 leading-snug" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                      {form.title}
                    </div>
                  </div>

                  {/* Category badge */}
                  <div className="mt-2 md:mt-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${color}12`, color, border: `1px solid ${color}25` }}>
                      {form.category}
                    </span>
                  </div>

                  {/* Download button — desktop only */}
                  <div className="hidden md:flex md:justify-end">
                    <button
                      onClick={() => download(form)}
                      disabled={isLoading}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black transition-all hover:scale-[1.04] disabled:opacity-50 disabled:cursor-wait"
                      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
                      {isLoading ? (
                        <>
                          <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
                          <span>...</span>
                        </>
                      ) : (
                        <>
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                            <path d="M6 1v7M3 6l3 3 3-3M1 10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          PDF
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Source note */}
        <div className="mt-6 flex items-start gap-2 text-[11px] text-white/25">
          <span>ℹ</span>
          <span>
            Forms sourced from{' '}
            <a href="https://prism.kerala.gov.in/PenForms.jsp" target="_blank" rel="noopener noreferrer"
              className="no-underline hover:text-white/50 transition-colors" style={{ color: '#2997ff' }}>
              PRISM — Finance Department, Government of Kerala
            </a>.
            Results are official government documents.
          </span>
        </div>

        {/* Related */}
        <div className="mt-8 rounded-2xl p-5"
          style={{ background: 'rgba(41,151,255,0.04)', border: '1px solid rgba(41,151,255,0.12)' }}>
          <div className="text-[10px] font-black uppercase tracking-widest text-[#2997ff] mb-3">Related Tools</div>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Pension Calculator', href: '/pension' },
              { label: 'Pension Calculation Guide', href: '/pension-calculation' },
              { label: 'DCRG Calculator', href: '/dcrg' },
              { label: 'NPS vs APS', href: '/nps-aps' },
            ].map(l => (
              <Link key={l.href} href={l.href}
                className="px-4 py-2 rounded-xl text-[12px] font-bold no-underline transition-all hover:scale-[1.03]"
                style={{ background: 'rgba(41,151,255,0.10)', color: '#2997ff', border: '1px solid rgba(41,151,255,0.20)' }}>
                {l.label} →
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
