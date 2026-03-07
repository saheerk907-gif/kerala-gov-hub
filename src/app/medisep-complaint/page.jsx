import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'MEDISEP Complaint — How to File a Grievance',
  description:
    'How to file a MEDISEP complaint or grievance for Kerala government employees — online portal, helpline, email, escalation process, and resolution timeline.',
  keywords:
    'MEDISEP complaint, MEDISEP grievance, MEDISEP appeal, MEDISEP claim rejected, MEDISEP helpline 1800-425-1530, Kerala employee complaint',
  alternates: { canonical: 'https://keralaemployees.in/medisep-complaint' },
  openGraph: {
    title: 'MEDISEP Complaint — Complete Grievance Filing Guide',
    description: 'How to file MEDISEP complaint online, by phone, or by email for Kerala government employees.',
    url: 'https://keralaemployees.in/medisep-complaint',
    type: 'article',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'MEDISEP complaint ചെയ്ത ശേഷം reply കിട്ടാൻ എത്ര ദിവസം?',
      acceptedAnswer: { '@type': 'Answer', text: 'Normal complaints: 15 working days. Urgent/emergency complaints: 3–5 working days. Portal-ൽ ticket number ഉപയോഗിച്ച് status track ചെയ്യാം.' },
    },
    {
      '@type': 'Question',
      name: 'MEDISEP-ൽ claim reject ആയാൽ appeal ചെയ്യാമോ?',
      acceptedAnswer: { '@type': 'Answer', text: 'ആണ്. Rejection letter ലഭിച്ച് 30 ദിവസത്തിനകം portal-ൽ Grievance/Appeal section-ൽ appeal ചെയ്യാം. Missing documents ചേർത്ത് resubmit ചെയ്യാം.' },
    },
    {
      '@type': 'Question',
      name: 'MEDISEP helpline number എന്താണ്?',
      acceptedAnswer: { '@type': 'Answer', text: 'MEDISEP Helpline: 1800-425-1530 (Toll Free, 24×7). Email: medisep.helpdesk@kerala.gov.in. Website: medisep.kerala.gov.in.' },
    },
    {
      '@type': 'Question',
      name: 'Hospital cashless treatment deny ചെയ്താൽ എന്ത് ചെയ്യണം?',
      acceptedAnswer: { '@type': 'Answer', text: 'ഉടൻ MEDISEP helpline 1800-425-1530-ൽ call ചെയ്യുക. Hospital name, treating doctor, denial reason ഇവ note ചെയ്ത് grievance register ചെയ്യുക. Emergency ആണെങ്കിൽ treatment ആദ്യം receive ചെയ്ത് claim ചെയ്യാം.' },
    },
  ],
};

const COMPLAINT_TYPES = [
  { title: 'Claim Rejection Complaint', desc: 'Claim reject ആയതിന്റെ reason agree ചെയ്യുന്നില്ലെങ്കിൽ', color: '#ff453a' },
  { title: 'Cashless Treatment Denial', desc: 'Empanelled hospital cashless deny ചെയ്തെങ്കിൽ', color: '#ff9f0a' },
  { title: 'Delayed Payment Complaint', desc: '30 working days കഴിഞ്ഞും reimbursement ലഭിക്കുന്നില്ലെങ്കിൽ', color: '#2997ff' },
  { title: 'Hospital Quality Complaint', desc: 'Treatment quality, billing irregularity, ഇവ report ചെയ്യാൻ', color: '#30d158' },
  { title: 'Portal/Technical Issues', desc: 'Login issues, card download errors, system problems', color: '#bf5af2' },
  { title: 'Dependent Eligibility Issues', desc: 'Dependents add ചെയ്യാൻ problem ഉള്ളപ്പോൾ', color: '#ff9f0a' },
];

const ONLINE_STEPS = [
  { n: 1, title: 'Portal-ൽ Login ചെയ്യുക', body: 'medisep.kerala.gov.in → Employee/Pensioner Login → PEN നമ്പർ, Password ഉപയോഗിച്ച് login ചെയ്യുക.' },
  { n: 2, title: 'Grievance Section-ൽ പോകുക', body: 'Dashboard-ൽ "Grievance" അല്ലെങ്കിൽ "Complaint" menu ക്ലിക്ക് ചെയ്ത് "New Grievance" select ചെയ്യുക.' },
  { n: 3, title: 'Complaint Details Enter ചെയ്യുക', body: 'Complaint type select ചെയ്ത് — claim reference number, treatment date, hospital name, issue description (Malayalam/English-ൽ) enter ചെയ്യുക.' },
  { n: 4, title: 'Supporting Documents Upload ചെയ്യുക', body: 'Rejection letter, bills, discharge summary, communication records ഇവ scan ചെയ്ത് PDF/JPG format-ൽ upload ചെയ്യുക (max 5MB per file).' },
  { n: 5, title: 'Submit ചെയ്ത് Ticket Number Save ചെയ്യുക', body: 'Submit ചെയ്ത ശേഷം Grievance Reference Number ലഭിക്കും. ഈ number SMS/email-ൽ ലഭിക്കും. Status track ചെയ്യാൻ ഈ number ആവശ്യമാണ്.' },
];

const ESCALATION = [
  { level: 'Level 1', title: 'MEDISEP Portal / Helpline', contact: '1800-425-1530 | medisep.kerala.gov.in', time: '15 working days', color: '#30d158' },
  { level: 'Level 2', title: 'Star Health Insurance TPA', contact: '044-40919898 | claims@starhealth.in', time: '7 working days', color: '#2997ff' },
  { level: 'Level 3', title: 'MEDISEP Nodal Officer', contact: 'medisep.helpdesk@kerala.gov.in (Subject: Escalation)', time: '5 working days', color: '#ff9f0a' },
  { level: 'Level 4', title: 'Finance Department / Insurance Ombudsman', contact: 'ciokerala@ecoi.co.in (Insurance Ombudsman, Kochi)', time: '30 days', color: '#ff453a' },
];

export default function MedisepComplaintPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Navbar />
      <main className="min-h-screen bg-black text-white">

        {/* Hero */}
        <div className="relative pt-32 pb-14 px-6 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1a0008 0%, #0d0005 60%, #000 100%)' }}>
          <div className="absolute inset-0 opacity-20"
            style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, #ff453a20, transparent)' }} />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #ff453a40, transparent)' }} />
          <div className="relative max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-xs text-[#6e6e73] mb-8">
              <a href="/" className="hover:text-white no-underline text-[#6e6e73] transition-colors">Home</a>
              <span>›</span>
              <a href="/medisep" className="hover:text-white no-underline text-[#6e6e73] transition-colors">MEDISEP</a>
              <span>›</span>
              <span className="text-[#ff453a]">Complaint</span>
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-5"
              style={{ background: '#ff453a15', color: '#ff453a', border: '1px solid #ff453a30' }}>
              Grievance Redressal Guide
            </div>
            <h1 className="text-[clamp(26px,4.5vw,48px)] font-black tracking-tight leading-[1.1] mb-4">
              MEDISEP Complaint — Grievance Filing Guide
            </h1>
            <p className="text-[16px] text-[#86868b] leading-relaxed max-w-2xl" style={{ fontFamily: "'Meera', sans-serif" }}>
              MEDISEP-ൽ claim reject ആയോ? Cashless treatment deny ആയോ? Payment delay ഉണ്ടോ? ഇവിടെ complaint ചെയ്യാനുള്ള complete guide — online portal, helpline, escalation process, time limits.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="tel:18004251530" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold no-underline"
                style={{ background: 'rgba(255,69,58,0.1)', color: '#ff453a', border: '1px solid rgba(255,69,58,0.25)' }}>
                Helpline: 1800-425-1530 ↗
              </a>
              <a href="https://medisep.kerala.gov.in" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold no-underline"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                MEDISEP Portal ↗
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-14 space-y-16">

          {/* Intro */}
          <section>
            <h2 className="text-[22px] font-black text-white mb-4">MEDISEP Complaint എന്തിനൊക്കെ ചെയ്യാം?</h2>
            <div className="space-y-4 text-[15px] text-[#aeaeb2] leading-[1.85]" style={{ fontFamily: "'Meera', Georgia, serif" }}>
              <p>MEDISEP scheme-ൽ ഉൾപ്പെടുന്ന ജീവനക്കാർക്കും pensioners-നും treatment-മായി ബന്ധപ്പെട്ട ഏത് problem-നും formal complaint ചെയ്യാൻ അവകാശം ഉണ്ട്. Grievance register ചെയ്ത ശേഷം ticket number ലഭിക്കും. ഇത് ഉപയോഗിച്ച് status track ചെയ്യാം.</p>
              <p>Complaint ചെയ്യാൻ മടിക്കരുത് — ഇത് നിങ്ങളുടെ legal right ആണ്. MEDISEP-ൽ ഒരു proper grievance redressal mechanism ഉണ്ട്.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              {COMPLAINT_TYPES.map(c => (
                <div key={c.title} className="flex gap-3 p-4 rounded-xl"
                  style={{ background: `${c.color}08`, border: `1px solid ${c.color}20` }}>
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: c.color }} />
                  <div>
                    <div className="text-[13px] font-bold text-white/90">{c.title}</div>
                    <div className="text-[11px] text-[#86868b] mt-0.5" style={{ fontFamily: "'Meera', serif" }}>{c.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Online complaint */}
          <section>
            <h2 className="text-[22px] font-black text-white mb-2">Online Complaint ചെയ്യുന്ന വിധം</h2>
            <p className="text-[13px] text-[#6e6e73] mb-8">MEDISEP portal-ൽ complaint register ചെയ്യുന്ന fastest method</p>
            <div className="space-y-4">
              {ONLINE_STEPS.map(s => (
                <div key={s.n} className="flex gap-4 p-5 rounded-2xl"
                  style={{ background: 'rgba(255,69,58,0.03)', border: '1px solid rgba(255,69,58,0.1)' }}>
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black"
                    style={{ background: 'rgba(255,69,58,0.12)', color: '#ff453a' }}>
                    {s.n}
                  </div>
                  <div>
                    <div className="font-bold text-white mb-1">{s.title}</div>
                    <p className="text-[14px] text-[#aeaeb2] leading-relaxed" style={{ fontFamily: "'Meera', serif" }}>{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Phone/email */}
          <section>
            <h2 className="text-[22px] font-black text-white mb-6">Phone / Email വഴി Complaint</h2>
            <div className="grid gap-4">
              {[
                {
                  method: 'Toll-Free Helpline',
                  contact: '1800-425-1530',
                  details: '24×7 ലഭ്യം. Call ചെയ്ത് complaint register ചെയ്യാം. Complaint reference number note ചെയ്ത് വെക്കുക.',
                  color: '#30d158',
                  href: 'tel:18004251530',
                },
                {
                  method: 'Email Complaint',
                  contact: 'medisep.helpdesk@kerala.gov.in',
                  details: 'Subject: "Grievance — [Claim Reference / Employee ID]". Email-ൽ name, PEN, complaint details, supporting documents attach ചെയ്ത് അയക്കുക.',
                  color: '#2997ff',
                  href: 'mailto:medisep.helpdesk@kerala.gov.in',
                },
                {
                  method: 'Star Health TPA',
                  contact: '044-40919898',
                  details: 'TPA-related issues (pre-authorization, cashless denial) direct ആയി Star Health TPA-ൽ report ചെയ്യാം.',
                  color: '#ff9f0a',
                  href: 'tel:04440919898',
                },
              ].map(m => (
                <div key={m.method} className="p-5 rounded-2xl"
                  style={{ background: `${m.color}06`, border: `1px solid ${m.color}20` }}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-widest mb-1" style={{ color: m.color }}>{m.method}</div>
                      <a href={m.href} className="text-[17px] font-black text-white no-underline hover:underline">{m.contact}</a>
                      <p className="text-[13px] text-[#86868b] mt-2 leading-relaxed" style={{ fontFamily: "'Meera', serif" }}>{m.details}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Escalation */}
          <section>
            <h2 className="text-[22px] font-black text-white mb-2">Problem Solve ആകുന്നില്ലെങ്കിൽ — Escalation Path</h2>
            <p className="text-[13px] text-[#6e6e73] mb-8" style={{ fontFamily: "'Meera', serif" }}>
              Level 1-ൽ response ലഭിക്കുന്നില്ലെങ്കിൽ ഓരോ level-ലേക്ക് escalate ചെയ്യാം
            </p>
            <div className="space-y-3">
              {ESCALATION.map((e, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-2xl items-start"
                  style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${e.color}25` }}>
                  <div className="flex-shrink-0 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider"
                    style={{ background: `${e.color}15`, color: e.color }}>
                    {e.level}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white text-sm">{e.title}</div>
                    <div className="text-[12px] text-[#6e6e73] mt-0.5">{e.contact}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-[11px] text-[#6e6e73]">Response</div>
                    <div className="text-[13px] font-bold" style={{ color: e.color }}>{e.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tips */}
          <section>
            <h2 className="text-[22px] font-black text-white mb-6">Complaint Effective ആക്കാൻ Tips</h2>
            <div className="space-y-3">
              {[
                'Complaint-ൽ employee ID (PEN), claim reference number, treatment date ഇവ specify ചെയ്യുക.',
                'Supporting documents (rejection letter, bills) scan ചെയ്ത് attach ചെയ്യുക — complaint weak ആകാതിരിക്കാൻ.',
                'Ticket/reference number note ചെയ്ത് status regularly track ചെയ്യുക.',
                'Written/email complaint always better — evidence ആയി ഉപകരിക്കും.',
                'Response deadline കഴിഞ്ഞ ഉടൻ next level-ലേക്ക് escalate ചെയ്യുക, കാത്തിരിക്കരുത്.',
                'Insurance Ombudsman-ൽ complain ചെയ്യുന്നത് free of cost ആണ്.',
              ].map((tip, i) => (
                <div key={i} className="flex gap-3 p-4 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <span className="text-[#2997ff] font-black text-xs mt-0.5 flex-shrink-0">{i + 1}.</span>
                  <p className="text-[13px] text-[#c7c7cc] leading-relaxed" style={{ fontFamily: "'Meera', serif" }}>{tip}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-[22px] font-black text-white mb-6">MEDISEP Complaint — FAQ</h2>
            <div className="space-y-3">
              {faqJsonLd.mainEntity.map((faq, i) => (
                <details key={i} className="rounded-2xl overflow-hidden group"
                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none select-none">
                    <span className="text-[14px] font-bold text-white/90" style={{ fontFamily: "'Meera', sans-serif" }}>{faq.name}</span>
                    <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black transition-transform group-open:rotate-45"
                      style={{ background: 'rgba(255,69,58,0.12)', color: '#ff453a' }}>+</span>
                  </summary>
                  <div className="px-5 pb-5 pt-1">
                    <p className="text-[13px] text-[#aeaeb2] leading-relaxed" style={{ fontFamily: "'Meera', serif" }}>
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
                { label: 'Claim Process', href: '/medisep-claim-process' },
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
              style={{ background: '#ff453a15', color: '#ff453a', border: '1px solid #ff453a30' }}>
              ← MEDISEP Overview
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
