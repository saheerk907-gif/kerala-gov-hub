import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'MEDISEP Claim Process — Cashless & Reimbursement Guide',
  description:
    'Complete step-by-step guide to MEDISEP claim process for Kerala government employees — cashless treatment, reimbursement claim, required documents, time limits, and common mistakes to avoid.',
  keywords:
    'MEDISEP claim process, MEDISEP cashless treatment, MEDISEP reimbursement, MEDISEP pre-authorization, MEDISEP claim documents, Kerala employee health claim',
  alternates: { canonical: 'https://keralaemployees.in/medisep-claim-process' },
  openGraph: {
    title: 'MEDISEP Claim Process — Complete Guide for Kerala Employees',
    description: 'Step-by-step guide for MEDISEP cashless and reimbursement claims.',
    url: 'https://keralaemployees.in/medisep-claim-process',
    type: 'article',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'MEDISEP cashless claim-ന് pre-authorization നിർബന്ധമാണോ?',
      acceptedAnswer: { '@type': 'Answer', text: 'ആണ്. Planned treatment-ന് pre-authorization നിർബന്ധമാണ്. Emergency-ൽ 24 മണിക്കൂറിനകം post-authorization ലഭിക്കും.' },
    },
    {
      '@type': 'Question',
      name: 'MEDISEP reimbursement claim ചെയ്യാൻ എത്ര ദിവസം ഉണ്ട്?',
      acceptedAnswer: { '@type': 'Answer', text: 'Treatment കഴിഞ്ഞ് 90 ദിവസത്തിനകം reimbursement claim submit ചെയ്യണം.' },
    },
    {
      '@type': 'Question',
      name: 'Non-empanelled hospital-ൽ MEDISEP claim ലഭിക്കുമോ?',
      acceptedAnswer: { '@type': 'Answer', text: 'Emergency situations-ൽ മാത്രം. Hospital admit ആയ 24 മണിക്കൂറിനകം helpline-ൽ (1800-425-1530) inform ചെയ്യണം.' },
    },
    {
      '@type': 'Question',
      name: 'MEDISEP claim reject ആയാൽ എന്ത് ചെയ്യണം?',
      acceptedAnswer: { '@type': 'Answer', text: 'Rejection letter ലഭിച്ച് 30 ദിവസത്തിനകം portal-ൽ appeal ചെയ്യാം. Documents missing ആണെങ്കിൽ ചേർത്ത് resubmit ചെയ്യാം.' },
    },
  ],
};

const STEPS_CASHLESS = [
  { n: 1, title: 'Empanelled Hospital തിരഞ്ഞെടുക്കുക', body: 'medisep.kerala.gov.in-ൽ District-wise empanelled hospitals list ചെക്ക് ചെയ്ത് അടുത്തുള്ള hospital തിരഞ്ഞെടുക്കുക. Treatment specialty ആ hospital-ൽ ലഭ്യമാണോ എന്ന് confirm ചെയ്യുക.' },
  { n: 2, title: 'MEDISEP TPA Desk-ൽ report ചെയ്യുക', body: 'Hospital-ൽ admit ആകുമ്പോൾ MEDISEP/TPA Desk-ൽ പോകുക. MEDISEP E-Card, Aadhaar card, employee ID ഇവ കൊണ്ടുപോകണം. Patient-ന്റെ MEDISEP ID confirm ചെയ്യും.' },
  { n: 3, title: 'Pre-Authorization ലഭ്യമാക്കുക', body: 'Hospital TPA, treating doctor-ന്റെ recommendation, estimated cost, diagnosis code (ICD) ഇവ MEDISEP portal-ൽ submit ചെയ്യും. Planned treatment: 4–6 മണിക്കൂറിനകം approval. Emergency: 2 മണിക്കൂറിനകം approval. Approval letter-ൽ sanctioned amount, treatment name, validity കാണാം.' },
  { n: 4, title: 'Cashless Treatment ലഭിക്കുക', body: 'Pre-authorization ലഭിച്ചാൽ treatment ആരംഭിക്കാം. ഒരു rupee-ഉം advance ആയി കൊടുക്കേണ്ടതില്ല (approved package amount വരെ). Package amount exceed ആകുന്ന ഭാഗം patient-ന് pay ചെയ്യേണ്ടി വരും.' },
  { n: 5, title: 'Discharge Summary കൈപ്പറ്റുക', body: 'Discharge-ന് ശേഷം hospital MEDISEP-ൽ final claim submit ചെയ്യും. Patient discharge summary sign ചെയ്ത് കൈപ്പറ്റണം. Bills, prescriptions, investigation reports-ന്റെ copies സൂക്ഷിക്കുക.' },
];

const STEPS_REIMBURSE = [
  { n: 1, title: 'Treatment Documents സൂക്ഷിക്കുക', body: 'All original bills, prescriptions, discharge summary, investigation reports (blood test, scan, etc.), doctor\'s certificate ഇവ safely സൂക്ഷിക്കുക. Originals submit ചെയ്യണം, photocopy ആകില്ല.' },
  { n: 2, title: 'Helpline-ൽ Inform ചെയ്യുക (non-empanelled hospital)', body: 'Non-empanelled hospital-ൽ admit ആയെങ്കിൽ 24 മണിക്കൂറിനകം 1800-425-1530-ൽ call ചെയ്ത് inform ചെയ്യണം. Reference number note ചെയ്തു വെക്കുക.' },
  { n: 3, title: 'Online Claim Submit ചെയ്യുക', body: 'medisep.kerala.gov.in → Login → "Reimbursement Claim" → "New Claim" ക്ലിക്ക് ചെയ്ത് treatment details enter ചെയ്യുക. Documents scan ചെയ്ത് upload ചെയ്യുക. Bank account details (IFSC, account number) enter ചെയ്യുക.' },
  { n: 4, title: 'Claim Status Track ചെയ്യുക', body: 'Submit ചെയ്ത ശേഷം claim reference number ലഭിക്കും. Portal-ൽ "Track Claim" section-ൽ status monitor ചെയ്യാം. TPA additional documents ആവശ്യപ്പെട്ടാൽ 15 ദിവസത്തിനകം submit ചെയ്യണം.' },
  { n: 5, title: 'Payment ലഭിക്കുക', body: 'Claim verify ചെയ്ത ശേഷം 30 working days-ൽ registered bank account-ൽ amount credit ആകും. SMS notification ലഭിക്കും. Amount shortfall ആണെങ്കിൽ reason explanation ലഭിക്കും.' },
];

const DOCS = [
  'MEDISEP E-Card (original/soft copy)',
  'Aadhaar card (patient)',
  'Discharge Summary (hospital letterhead-ൽ)',
  'Itemized bill (ഓരോ item-ഉം separately listed)',
  'Doctor\'s prescriptions (all)',
  'Investigation reports (lab, scan, X-ray)',
  'Operation Theatre notes (surgery cases)',
  'Referring doctor\'s letter',
  'Cancelled cheque / Bank passbook copy',
  'Pre-authorization letter (cashless cases)',
];

const MISTAKES = [
  { title: '90 ദിവസം കഴിഞ്ഞ് claim ചെയ്യുക', fix: 'Treatment കഴിഞ്ഞ ഉടൻ claim process ആരംഭിക്കുക.' },
  { title: 'Non-empanelled hospital-ൽ inform ചെയ്യാതിരിക്കുക', fix: 'Emergency admit ആയ 24 മണിക്കൂറിനകം 1800-425-1530-ൽ call ചെയ്യണം.' },
  { title: 'Original documents നഷ്ടപ്പെടുത്തുക', fix: 'Treatment-ന്റെ ദിവസം മുതൽ എല്ലാ papers-ഉം ഒരു folder-ൽ സൂക്ഷിക്കുക.' },
  { title: 'Package limit അറിയാതിരിക്കുക', fix: 'Treatment-ന് മുൻപ് hospital TPA-യോട് package rate confirm ചെയ്യുക.' },
  { title: 'Dependent add ചെയ്യാതിരിക്കുക', fix: 'Family members-ന് treatment ലഭിക്കുന്നതിന് മുൻപ് portal-ൽ dependent add ചെയ്തിരിക്കണം.' },
];

export default function MedisepClaimProcessPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Navbar />
      <main className="min-h-screen bg-black text-white">

        {/* Hero */}
        <div className="relative pt-32 pb-14 px-6 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #001a0f 0%, #000d06 60%, #000 100%)' }}>
          <div className="absolute inset-0 opacity-20"
            style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, #30d15825, transparent)' }} />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #30d15840, transparent)' }} />
          <div className="relative max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-xs text-[#6e6e73] mb-8">
              <a href="/" className="hover:text-white no-underline text-[#6e6e73] transition-colors">Home</a>
              <span>›</span>
              <a href="/medisep" className="hover:text-white no-underline text-[#6e6e73] transition-colors">MEDISEP</a>
              <span>›</span>
              <span className="text-[#30d158]">Claim Process</span>
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-5"
              style={{ background: '#30d15815', color: '#30d158', border: '1px solid #30d15830' }}>
              Complete Guide · Updated 2025–26
            </div>
            <h1 className="text-[clamp(26px,4.5vw,48px)] font-black tracking-tight leading-[1.1] mb-4">
              MEDISEP Claim Process — Step-by-Step Guide
            </h1>
            <p className="text-[16px] text-[#86868b] leading-relaxed max-w-2xl" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              കേരള ജീവനക്കാർക്ക് MEDISEP-ൽ cashless treatment ലഭിക്കാനും reimbursement claim ചെയ്യാനും ഉള്ള complete step-by-step guide. Documents, time limits, common mistakes — എല്ലാം ഒരിടത്ത്.
            </p>
            <div className="flex flex-wrap gap-2 mt-6 text-[11px]">
              {['Cashless Treatment', 'Reimbursement Claim', 'Documents List', 'Common Mistakes'].map(t => (
                <span key={t} className="px-3 py-1 rounded-full"
                  style={{ background: 'rgba(48,209,88,0.08)', color: '#30d158', border: '1px solid rgba(48,209,88,0.2)' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-14 space-y-16">

          {/* Intro */}
          <section>
            <h2 className="text-[22px] font-black text-white mb-4">MEDISEP Claim എന്താണ്?</h2>
            <div className="space-y-4 text-[15px] text-[#aeaeb2] leading-[1.85]" style={{ fontFamily: "var(--font-noto-malayalam), Georgia, serif" }}>
              <p>MEDISEP (Medical Insurance Scheme for Employees and Pensioners) ആണ് കേരള സർക്കാർ ജീവനക്കാർക്കും pensioners-നും ഉള്ള health insurance scheme. ഈ scheme-ൽ ₹5 lakh വരെ coverage ലഭ്യമാണ്. Claim process-ൽ രണ്ട് types ഉണ്ട്: Cashless Claim ഉം Reimbursement Claim ഉം.</p>
              <p><strong className="text-white">Cashless Claim:</strong> Empanelled hospital-ൽ ചികിത്സ ലഭിക്കുമ്പോൾ advance payment ഒന്നും ആവശ്യമില്ല. Hospital directly MEDISEP-ൽ നിന്ന് payment receive ചെയ്യും.</p>
              <p><strong className="text-white">Reimbursement Claim:</strong> Non-empanelled hospital-ൽ (emergency situations-ൽ) ചികിത്സ ലഭിക്കുമ്പോൾ ആദ്യം patient pay ചെയ്ത ശേഷം MEDISEP portal-ൽ claim submit ചെയ്ത് amount return ലഭിക്കുന്ന process.</p>
            </div>
          </section>

          {/* Cashless steps */}
          <section>
            <h2 className="text-[22px] font-black text-white mb-2">Cashless Treatment — Step by Step</h2>
            <p className="text-[13px] text-[#6e6e73] mb-8">Empanelled hospital-ൽ ചികിത്സ ലഭിക്കാൻ follow ചെയ്യേണ്ട steps</p>
            <div className="space-y-4">
              {STEPS_CASHLESS.map(s => (
                <div key={s.n} className="flex gap-4 p-5 rounded-2xl"
                  style={{ background: 'rgba(48,209,88,0.03)', border: '1px solid rgba(48,209,88,0.1)' }}>
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black"
                    style={{ background: 'rgba(48,209,88,0.12)', color: '#30d158' }}>
                    {s.n}
                  </div>
                  <div>
                    <div className="font-bold text-white mb-1">{s.title}</div>
                    <p className="text-[14px] text-[#aeaeb2] leading-relaxed" style={{ fontFamily: "var(--font-noto-malayalam), serif" }}>{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Reimbursement steps */}
          <section>
            <h2 className="text-[22px] font-black text-white mb-2">Reimbursement Claim — Step by Step</h2>
            <p className="text-[13px] text-[#6e6e73] mb-8">Non-empanelled hospital-ൽ emergency treatment-ന് ശേഷം claim ചെയ്യാൻ</p>
            <div className="space-y-4">
              {STEPS_REIMBURSE.map(s => (
                <div key={s.n} className="flex gap-4 p-5 rounded-2xl"
                  style={{ background: 'rgba(41,151,255,0.03)', border: '1px solid rgba(41,151,255,0.1)' }}>
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black"
                    style={{ background: 'rgba(41,151,255,0.12)', color: '#2997ff' }}>
                    {s.n}
                  </div>
                  <div>
                    <div className="font-bold text-white mb-1">{s.title}</div>
                    <p className="text-[14px] text-[#aeaeb2] leading-relaxed" style={{ fontFamily: "var(--font-noto-malayalam), serif" }}>{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Documents */}
          <section>
            <h2 className="text-[22px] font-black text-white mb-4">Claim-ന് ആവശ്യമായ Documents</h2>
            <p className="text-[14px] text-[#86868b] mb-6" style={{ fontFamily: "var(--font-noto-malayalam), serif" }}>
              Claim reject ആകുന്നതിന്റെ ഏറ്റവും വലിയ കാരണം incomplete documents ആണ്. ഈ list കൂടെ കൊണ്ടുപോകുക:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DOCS.map((d, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl"
                  style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-xs)' }}>
                  <span className="text-[#30d158] mt-0.5 flex-shrink-0 text-xs">✓</span>
                  <span className="text-[13px] text-[#c7c7cc]" style={{ fontFamily: "var(--font-noto-malayalam), serif" }}>{d}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Time limits */}
          <section>
            <h2 className="text-[22px] font-black text-white mb-6">Important Time Limits</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { limit: '90 ദിവസം', desc: 'Treatment-ന് ശേഷം reimbursement claim submit ചെയ്യാനുള്ള deadline', color: '#ff9f0a' },
                { limit: '24 മണിക്കൂർ', desc: 'Non-empanelled hospital-ൽ admit ആയാൽ helpline-ൽ inform ചെയ്യാൻ', color: '#ff453a' },
                { limit: '30 ദിവസം', desc: 'Claim reject ആയാൽ appeal ചെയ്യാൻ ഉള്ള സമയം', color: '#2997ff' },
              ].map(t => (
                <div key={t.limit} className="p-5 rounded-2xl text-center"
                  style={{ background: `${t.color}08`, border: `1px solid ${t.color}25` }}>
                  <div className="text-2xl font-black mb-2" style={{ color: t.color }}>{t.limit}</div>
                  <p className="text-[12px] text-[#86868b] leading-relaxed" style={{ fontFamily: "var(--font-noto-malayalam), serif" }}>{t.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Common mistakes */}
          <section>
            <h2 className="text-[22px] font-black text-white mb-6">Claim Reject ആകുന്ന Common Mistakes</h2>
            <div className="space-y-3">
              {MISTAKES.map((m, i) => (
                <div key={i} className="p-5 rounded-2xl"
                  style={{ background: 'rgba(255,69,58,0.04)', border: '1px solid rgba(255,69,58,0.12)' }}>
                  <div className="flex items-start gap-3">
                    <span className="text-[#ff453a] flex-shrink-0 font-black text-sm mt-0.5">✕</span>
                    <div>
                      <div className="font-bold text-white/90 text-sm mb-1">{m.title}</div>
                      <p className="text-[13px] text-[#86868b]" style={{ fontFamily: "var(--font-noto-malayalam), serif" }}>
                        <span className="text-[#30d158] font-bold">Fix: </span>{m.fix}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-[22px] font-black text-white mb-6">MEDISEP Claim — സാധാരണ ചോദ്യങ്ങൾ</h2>
            <div className="space-y-3">
              {faqJsonLd.mainEntity.map((faq, i) => (
                <details key={i} className="rounded-2xl overflow-hidden group"
                  style={{ background: 'var(--surface-xs)', border: '1px solid var(--surface-xs)' }}>
                  <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none select-none">
                    <span className="text-[14px] font-bold text-white/90" style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>{faq.name}</span>
                    <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black transition-transform group-open:rotate-45"
                      style={{ background: 'rgba(48,209,88,0.12)', color: '#30d158' }}>+</span>
                  </summary>
                  <div className="px-5 pb-5 pt-1">
                    <p className="text-[13px] text-[#aeaeb2] leading-relaxed" style={{ fontFamily: "var(--font-noto-malayalam), serif" }}>
                      {faq.acceptedAnswer.text}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Related */}
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,159,10,0.04)', border: '1px solid rgba(255,159,10,0.15)' }}>
            <div className="text-[10px] font-black uppercase tracking-widest text-[#ff9f0a] mb-4">Related MEDISEP Pages</div>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'MEDISEP Overview', href: '/medisep' },
                { label: 'MEDISEP Complaint', href: '/medisep-complaint' },
                { label: 'MEDISEP FAQ', href: '/medisep/faq' },
              ].map(l => (
                <a key={l.href} href={l.href}
                  className="px-4 py-2 rounded-xl text-[13px] font-bold no-underline transition-all hover:scale-[1.03]"
                  style={{ background: 'rgba(255,159,10,0.1)', color: '#ff9f0a', border: '1px solid rgba(255,159,10,0.2)' }}>
                  {l.label} →
                </a>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06]">
            <a href="/medisep" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold no-underline"
              style={{ background: '#30d15815', color: '#30d158', border: '1px solid #30d15830' }}>
              ← MEDISEP Overview
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
