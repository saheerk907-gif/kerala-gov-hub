import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'MEDISEP FAQ Malayalam | MEDISEP സംശയങ്ങൾക്ക് ഉത്തരം | Kerala Employees',
  description:
    'MEDISEP login, card download, claim process, reimbursement, helpline number, hospitals list — കേരള ജീവനക്കാർക്കും പെൻഷണർമാർക്കുമുള്ള 20 പ്രധാന MEDISEP ചോദ്യങ്ങൾക്ക് ഉത്തരം.',
  keywords: [
    'MEDISEP FAQ Malayalam',
    'MEDISEP login',
    'MEDISEP card download',
    'MEDISEP claim process',
    'MEDISEP helpline number',
    'MEDISEP reimbursement',
    'MEDISEP hospitals list',
    'MEDISEP premium',
    'Kerala government employee health insurance',
    'മെഡിസെപ്',
  ],
  alternates: { canonical: 'https://keralaemployees.in/medisep/faq' },
  openGraph: {
    title: 'MEDISEP FAQ | 20 പ്രധാന ചോദ്യങ്ങൾക്ക് ഉത്തരം',
    description: 'MEDISEP login, claim, reimbursement, hospitals, helpline — കേരള ജീവനക്കാർക്കുള്ള complete guide.',
    url: 'https://keralaemployees.in/medisep/faq',
    type: 'article',
  },
};

const SECTIONS = [
  {
    heading: 'MEDISEP അടിസ്ഥാന ചോദ്യങ്ങൾ',
    color: '#ff9f0a',
    faqs: [
      {
        q: 'MEDISEP login എങ്ങനെ ചെയ്യാം?',
        a: 'medisep.kerala.gov.in സന്ദർശിക്കുക. "Employee Login" ക്ലിക്ക് ചെയ്ത് PEN നമ്പർ, Password ഉപയോഗിച്ച് ലോഗിൻ ചെയ്യാം. ആദ്യമായി ലോഗിൻ ചെയ്യുന്നവർ "First Time Login" ഓപ്ഷൻ ഉപയോഗിക്കണം — Date of Birth ഉം PEN നമ്പറും ഉപയോഗിച്ച് password set ചെയ്യാം. Password മറന്നാൽ "Forgot Password" ക്ലിക്ക് ചെയ്ത് registered mobile number-ലേക്ക് OTP ലഭിക്കും.',
      },
      {
        q: 'MEDISEP ID എന്താണ്?',
        a: 'MEDISEP ID ഓരോ ജീവനക്കാരനും/പെൻഷണർക്കും നൽകുന്ന unique identification number ആണ്. ഇത് MEDISEP E-Card-ൽ രേഖപ്പെടുത്തിയിരിക്കും. ആശുപത്രിയിൽ ചികിത്സ ലഭിക്കാനും claim submit ചെയ്യാനും ഈ ID നിർബന്ധമാണ്. Portal-ൽ login ചെയ്ത് My Profile section-ൽ MEDISEP ID കാണാം.',
      },
      {
        q: 'MEDISEP card download ചെയ്യാൻ എങ്ങനെ?',
        a: 'MEDISEP portal (medisep.kerala.gov.in)-ൽ login ചെയ്ത ശേഷം "My Profile" → "Download E-Card" ക്ലിക്ക് ചെയ്ത് E-Card PDF format-ൽ download ചെയ്യാം. Mobile phone-ൽ soft copy ആയി സൂക്ഷിക്കാം. ആശുപത്രിയിൽ ചികിത്സ ലഭിക്കുന്ന സമയത്ത് ഈ card കൂടെ ഉണ്ടായിരിക്കണം. Dependents-ന്റേയും separate E-Card ഡൗൺലോഡ് ചെയ്യാം.',
      },
      {
        q: 'MEDISEP claim reject ചെയ്താൽ എന്ത് ചെയ്യണം?',
        a: 'Claim reject ആയാൽ rejection letter-ൽ reason confirm ചെയ്ത് 30 ദിവസത്തിനകം appeal ചെയ്യാം. MEDISEP portal-ൽ "Grievance" section-ൽ complaint register ചെയ്യണം. Missing documents ആണ് കാരണമെങ്കിൽ ആ documents attach ചെയ്ത് resubmit ചെയ്യാം. Helpline 1800-425-1530-ൽ ബന്ധപ്പെട്ട് guidance ലഭിക്കാം. Appeal-ലും reject ആയാൽ District Level Grievance Redressal Committee-ൽ escalate ചെയ്യാം.',
      },
      {
        q: 'MEDISEP complaint എങ്ങനെ നൽകാം?',
        a: 'MEDISEP portal (medisep.kerala.gov.in) → "Grievance" section-ൽ online complaint register ചെയ്യാം. Toll-free helpline 1800-425-1530-ൽ call ചെയ്ത് complaint നൽകാം. Email: medisep.helpdesk@kerala.gov.in-ലേക്ക് written complaint അയക്കാം. Complaint register ചെയ്ത ശേഷം ticket number ലഭിക്കും — ഇത് ഉപയോഗിച്ച് status track ചെയ്യാം.',
      },
      {
        q: 'MEDISEP helpline number എന്താണ്?',
        a: 'MEDISEP Helpline: 1800-425-1530 (Toll Free, 24×7 ലഭ്യം). Star Health Insurance TPA: 044-40919898. Email: medisep.helpdesk@kerala.gov.in. Official Website: medisep.kerala.gov.in. Emergency situations-ൽ 24 മണിക്കൂറും helpline ലഭ്യമാണ്.',
      },
      {
        q: 'MEDISEP scheme ആരെല്ലാം ഉൾപ്പെടുന്നു?',
        a: 'Kerala State Government-ലെ എല്ലാ ജീവനക്കാരും (Phase I), State Pensioners, Family Pensioners ഉൾപ്പെടുന്നു. Dependents: Spouse, 25 വയസ്സ് വരെ unmarried children, financially dependent parents ഇവരെ add ചെയ്യാം. Phase II-ൽ PSU employees, Aided School/College Teachers, University employees ഉൾപ്പെടുന്നു. Coverage: ₹5 lakh per family per year.',
      },
      {
        q: 'MEDISEP monthly premium എത്രയാണ്?',
        a: 'ജീവനക്കാർ: ₹689 per month (salary-ൽ നിന്ന് automatic deduction). Pensioners: ₹517 per month (pension-ൽ നിന്ന് deduction). Family pensioners: ₹517 per month. Premium rates ഇടയ്ക്ക് revision ചെയ്യാറുണ്ട്, ഏറ്റവും പുതിയ rates medisep.kerala.gov.in-ൽ confirm ചെയ്യുക.',
      },
      {
        q: 'MEDISEP hospitals list എവിടെ കാണാം?',
        a: 'medisep.kerala.gov.in → "Empanelled Hospitals" section-ൽ state-wide hospital list ലഭ്യമാണ്. District-wise, specialty-wise (Cardiology, Orthopaedics, etc.) filter ചെയ്ത് hospitals search ചെയ്യാം. Government hospitals, private hospitals, super-specialty hospitals ഉൾപ്പെടുന്നു. ചികിൽസയ്ക്ക് മുൻപ് hospital empanelled ആണോ എന്ന് confirm ചെയ്യുക.',
      },
      {
        q: 'MEDISEP package details എങ്ങനെ അറിയാം?',
        a: 'medisep.kerala.gov.in → "Package Rates" section-ൽ 2,516-ലധികം treatment packages-ന്റെ details ലഭ്യമാണ്. Treatment name, ICD code, package rate ഇവ confirm ചെയ്യാം. ഒരു specific treatment-ന്റെ package rate അറിയാൻ helpline 1800-425-1530-ൽ call ചെയ്യാം. Hospital TPA desk-ൽ നിന്നും package information ലഭ്യമാണ്.',
      },
    ],
  },
  {
    heading: 'ചികിത്സയും Claim-ഉം',
    color: '#30d158',
    faqs: [
      {
        q: 'Cashless treatment MEDISEP-ൽ എങ്ങനെ ലഭിക്കും?',
        a: 'Empanelled hospital-ൽ MEDISEP E-Card കാണിക്കുക. Hospital TPA desk-ൽ നിന്ന് admission process ആരംഭിക്കും. Hospital MEDISEP portal-ൽ pre-authorization request submit ചെയ്യും. Approval ലഭിച്ചാൽ cashless treatment ആരംഭിക്കാം. Emergency cases-ൽ 2 മണിക്കൂറിനകം approval ലഭ്യമാണ്. Planned surgery/treatment-ന് 4-6 മണിക്കൂർ കൂടുതൽ time ആകാം.',
      },
      {
        q: 'Non-empanelled hospital-ൽ ചികിത്സ ലഭിച്ചാൽ claim ലഭിക്കുമോ?',
        a: 'Emergency situations-ൽ non-empanelled hospital-ൽ treatment ലഭിച്ചാൽ reimbursement claim ചെയ്യാം. Hospital admit ആയ 24 മണിക്കൂറിനകം MEDISEP helpline (1800-425-1530)-ൽ inform ചെയ്യണം. Discharge-ന് ശേഷം all original bills, discharge summary, prescriptions, investigation reports സഹിതം claim submit ചെയ്യാം. MEDISEP package rates അനുസരിച്ചാണ് reimbursement ലഭിക്കുക — actual bill amount-ൽ കൂടുതൽ ആണെങ്കിലും package rate-ൽ cap ഉണ്ടാകും.',
      },
      {
        q: 'MEDISEP claim process എന്താണ്?',
        a: 'Cashless claim: Empanelled hospital-ൽ admit → TPA desk-ൽ MEDISEP card show ചെയ്യുക → Pre-authorization obtain ചെയ്യുക → Treatment → Discharge summary sign → Hospital directly insurer-മായി settle ചെയ്യും. Reimbursement claim: Treatment → All documents collect ചെയ്യുക → Treatment-ന് 90 ദിവസത്തിനകം MEDISEP portal-ൽ online claim submit ചെയ്യുക → Verification → Amount bank account-ൽ credit ആകും. Required documents: Discharge summary, itemized bills, prescriptions, investigation reports, MEDISEP ID proof, cancelled cheque.',
      },
      {
        q: 'MEDISEP reimbursement എങ്ങനെ ലഭിക്കും?',
        a: 'Treatment കഴിഞ്ഞ് 90 ദിവസത്തിനകം MEDISEP portal (medisep.kerala.gov.in) → "Reimbursement Claim"-ൽ online apply ചെയ്യുക. Upload ചെയ്യേണ്ട documents: Original bills (scan), discharge summary, doctor\'s prescriptions, investigation reports, MEDISEP card copy, bank passbook/cancelled cheque. Claim verify ചെയ്ത ശേഷം 30 working days-ൽ account-ൽ credit ആകും. Status portal-ൽ track ചെയ്യാം.',
      },
      {
        q: 'Hospital pre-authorization എന്താണ്?',
        a: 'Planned treatment/surgery-ന് hospital MEDISEP/TPA-യോട് treatment approval ആവശ്യപ്പെടുന്ന process ആണ് pre-authorization. Hospital TPA desk treatment details, estimated cost, treating doctor name ഇവ submit ചെയ്യും. TPA MEDISEP package rates confirm ചെയ്ത് approval നൽകും. Pre-authorization letter-ൽ approved amount, treatment name, validity period ഉണ്ടാകും. Emergency admission-ൽ ആദ്യം treat ചെയ്ത് 24 മണിക്കൂറിനകം post-authorization apply ചെയ്യാം.',
      },
    ],
  },
  {
    heading: 'ജീവനക്കാരും പെൻഷണർമാരും',
    color: '#2997ff',
    faqs: [
      {
        q: 'Retirement കഴിഞ്ഞാൽ MEDISEP തുടരുമോ?',
        a: 'ആണ്, retirement-ന് ശേഷവും MEDISEP benefit ലഭ്യമാണ്. Retired employees State Pensioners ആകും. ₹517 per month premium pension-ൽ നിന്ന് automatic deduction ആകും. Same coverage (₹5 lakh per family per year) ലഭ്യമാണ്. Retirement-ന് മുൻപ് MEDISEP portal-ൽ pensioner mode-ലേക്ക് transfer process DDO വഴി ചെയ്യണം.',
      },
      {
        q: 'Family pensioner MEDISEP benefit ലഭിക്കുമോ?',
        a: 'ആണ്, deceased government employee-ന്റെ spouse (family pensioner) MEDISEP scheme-ൽ ഉൾപ്പെടും. Family pensioner premium: ₹517/month (pension-ൽ നിന്ന് deduction). Regular pensioner-ക്ക് ലഭിക്കുന്ന അതേ ₹5 lakh coverage ലഭ്യമാണ്. Treasury/AG office-ൽ family pension process ചെയ്ത ശേഷം MEDISEP automatically update ആകും.',
      },
      {
        q: 'Dependents എങ്ങനെ add ചെയ്യാം?',
        a: 'MEDISEP portal-ൽ login → "My Family" → "Add Dependent" ക്ലിക്ക് ചെയ്ത് details enter ചെയ്യുക. Add ചെയ്യാവുന്ന dependents: Spouse, unmarried children (25 വയസ്സ് വരെ), financially dependent parents. Upload ചെയ്യേണ്ട documents: Aadhaar card, birth certificate (children), marriage certificate (spouse), income certificate (parents). DDO approval-ന് ശേഷം dependent activate ആകും.',
      },
      {
        q: 'MEDISEP policy period എത്രയാണ്?',
        a: 'MEDISEP policy period April 1 മുതൽ March 31 വരെ ആണ് (ഒരു financial year). Annual renewal automatic ആണ് — premium deduction continue ചെയ്യുന്ന ജീവനക്കാർക്ക് separate renewal ആവശ്യമില്ല. Coverage: ₹5 lakh per family per policy year. ഒരു policy year-ൽ ഉപയോഗിക്കാത്ത balance amount next year-ലേക്ക് carry forward ആകില്ല.',
      },
      {
        q: 'MEDISEP Phase II എന്താണ്?',
        a: 'MEDISEP Phase I-ൽ Kerala State Government Employees ഉം State Pensioners ഉം ഉൾപ്പെട്ടിരുന്നു. Phase II-ൽ PSU (Public Sector Undertaking) employees, Aided School Teachers, Aided College Teachers, University employees, Quasi-government employees ഇവരെ scheme-ൽ ഉൾപ്പെടുത്തി. Phase II-ലും coverage amount, benefits, claim process ഇവ Phase I-ന് തുല്യമാണ്. Premium rate institutional contribution ഉൾപ്പെടെ structure-ൽ ചെറിയ വ്യത്യാസങ്ങൾ ഉണ്ടാകാം.',
      },
    ],
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: SECTIONS.flatMap((s) =>
    s.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    }))
  ),
};

export default function MedisepFaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />
      <main className="min-h-screen bg-black text-white">

        {/* Hero */}
        <div className="relative pt-32 pb-16 px-6 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1a0f00 0%, #0d0800 60%, #000 100%)' }}>
          <div className="absolute inset-0 opacity-25"
            style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, #ff9f0a25, transparent)' }} />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #ff9f0a50, transparent)' }} />

          <div className="relative max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-xs text-[#6e6e73] mb-8">
              <a href="/" className="hover:text-white transition-colors no-underline text-[#6e6e73]">Home</a>
              <span>›</span>
              <a href="/medisep" className="hover:text-white transition-colors no-underline text-[#6e6e73]">MEDISEP</a>
              <span>›</span>
              <span className="text-[#ff9f0a]">FAQ</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-5"
              style={{ color: '#ff9f0a', border: '1px solid #ff9f0a30', background: '#ff9f0a10' }}>
              20 ചോദ്യങ്ങൾ · ഉത്തരങ്ങൾ
            </div>
            <h1 className="text-[clamp(28px,5vw,52px)] font-black tracking-tight leading-[1.1] mb-4"
              style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
              MEDISEP സംശയങ്ങൾക്ക് ഉത്തരം
            </h1>
            <p className="text-base text-[#86868b] max-w-xl leading-relaxed">
              Login, card download, claim process, reimbursement, hospitals list — കേരള ജീവനക്കാർ ഏറ്റവും കൂടുതൽ ചോദിക്കുന്ന 20 MEDISEP ചോദ്യങ്ങൾക്ക് വ്യക്തമായ ഉത്തരങ്ങൾ.
            </p>

            {/* Quick links */}
            <div className="flex flex-wrap gap-2 mt-8">
              {[
                { label: 'Login Portal', href: 'https://medisep.kerala.gov.in' },
                { label: 'Helpline: 1800-425-1530', href: 'tel:18004251530' },
                { label: 'Hospital List', href: 'https://medisep.kerala.gov.in' },
              ].map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-bold no-underline transition-all hover:scale-[1.03]"
                  style={{ background: 'rgba(255,159,10,0.1)', color: '#ff9f0a', border: '1px solid rgba(255,159,10,0.25)' }}>
                  {l.label} ↗
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="max-w-3xl mx-auto px-6 py-14 space-y-14">
          {SECTIONS.map((section) => (
            <section key={section.heading}>
              <h2 className="text-[18px] font-black uppercase tracking-widest mb-6 pb-3 border-b"
                style={{ color: section.color, borderColor: `${section.color}25`, fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                {section.heading}
              </h2>
              <div className="space-y-3">
                {section.faqs.map((faq, i) => (
                  <details key={i} className="group rounded-2xl overflow-hidden"
                    style={{ border: `1px solid rgba(255,255,255,0.07)`, background: 'rgba(255,255,255,0.025)' }}>
                    <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none select-none"
                      style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}>
                      <span className="text-[15px] font-bold text-white/90 leading-snug">{faq.q}</span>
                      <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-transform group-open:rotate-45"
                        style={{ background: `${section.color}18`, color: section.color, border: `1px solid ${section.color}30` }}>
                        +
                      </span>
                    </summary>
                    <div className="px-6 pb-6 pt-1">
                      <p className="text-[14px] text-[#aeaeb2] leading-[1.85]"
                        style={{ fontFamily: "var(--font-noto-malayalam), Georgia, serif" }}>
                        {faq.a}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}

          {/* Official links card */}
          <div className="rounded-2xl p-6"
            style={{ background: 'rgba(255,159,10,0.04)', border: '1px solid rgba(255,159,10,0.15)' }}>
            <div className="text-[10px] font-black uppercase tracking-widest text-[#ff9f0a] mb-4">Official Links</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'MEDISEP Portal', sub: 'Login, E-Card, Claims', href: 'https://medisep.kerala.gov.in' },
                { label: 'Empanelled Hospitals', sub: 'District-wise hospital list', href: 'https://medisep.kerala.gov.in' },
                { label: 'Package Rates', sub: '2516+ treatment packages', href: 'https://medisep.kerala.gov.in' },
                { label: 'Grievance Portal', sub: 'File complaint online', href: 'https://medisep.kerala.gov.in' },
              ].map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                  className="flex flex-col gap-0.5 p-4 rounded-xl no-underline transition-all hover:scale-[1.02]"
                  style={{ background: 'rgba(255,159,10,0.07)', border: '1px solid rgba(255,159,10,0.12)' }}>
                  <span className="text-[13px] font-bold text-white/90">{l.label} ↗</span>
                  <span className="text-[11px] text-[#86868b]">{l.sub}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Related tools */}
          <div className="rounded-2xl p-5"
            style={{ background: 'rgba(41,151,255,0.04)', border: '1px solid rgba(41,151,255,0.12)' }}>
            <div className="text-[10px] font-black uppercase tracking-widest text-[#2997ff] mb-3">Related Tools</div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Pension Calculator', href: '/pension' },
                { label: 'PRC Calculator', href: '/prc' },
                { label: 'GPF Calculator', href: '/gpf' },
                { label: 'NPS vs APS', href: '/nps-aps' },
                { label: 'Departmental Tests', href: '/departmental-tests' },
              ].map((t) => (
                <a key={t.href} href={t.href}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold no-underline transition-all hover:scale-105"
                  style={{ background: 'rgba(41,151,255,0.08)', color: '#2997ff', border: '1px solid rgba(41,151,255,0.2)' }}>
                  {t.label}
                </a>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex flex-wrap gap-3">
            <a href="/medisep"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold no-underline transition-all"
              style={{ background: '#ff9f0a15', color: '#ff9f0a', border: '1px solid #ff9f0a30' }}>
              ← MEDISEP Overview
            </a>
            <a href="/"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold no-underline transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
              Home
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
