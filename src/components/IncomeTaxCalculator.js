'use client';
import { useState, useMemo } from 'react';

// ─── Formatters ───────────────────────────────────────────────────────────────
const n = (v) => Number(v) || 0;
const fmt  = (v) => Math.round(Math.abs(v)).toLocaleString('en-IN');
const fmtR = (v) => `₹${fmt(v)}`;
const clamp = (v, max) => Math.min(Math.max(0, n(v)), max);

// ─── Tax Slabs ────────────────────────────────────────────────────────────────
const NEW_SLABS = [
  { min: 0,           max: 400_000,   rate: 0  },
  { min: 400_000,     max: 800_000,   rate: 5  },
  { min: 800_000,     max: 1_200_000, rate: 10 },
  { min: 1_200_000,   max: 1_600_000, rate: 15 },
  { min: 1_600_000,   max: 2_000_000, rate: 20 },
  { min: 2_000_000,   max: 2_400_000, rate: 25 },
  { min: 2_400_000,   max: Infinity,  rate: 30 },
];

const OLD_SLABS = {
  below60: [
    { min: 0,         max: 250_000,   rate: 0  },
    { min: 250_000,   max: 500_000,   rate: 5  },
    { min: 500_000,   max: 1_000_000, rate: 20 },
    { min: 1_000_000, max: Infinity,  rate: 30 },
  ],
  senior: [
    { min: 0,         max: 300_000,   rate: 0  },
    { min: 300_000,   max: 500_000,   rate: 5  },
    { min: 500_000,   max: 1_000_000, rate: 20 },
    { min: 1_000_000, max: Infinity,  rate: 30 },
  ],
  superSenior: [
    { min: 0,         max: 500_000,   rate: 0  },
    { min: 500_000,   max: 1_000_000, rate: 20 },
    { min: 1_000_000, max: Infinity,  rate: 30 },
  ],
};

function slabTax(income, slabs) {
  let tax = 0;
  const rows = [];
  for (const s of slabs) {
    if (income <= s.min) break;
    const band = Math.min(income, s.max === Infinity ? income : s.max) - s.min;
    const t    = band * s.rate / 100;
    rows.push({
      label : `${fmtR(s.min)} – ${s.max === Infinity ? 'above' : fmtR(s.max)}`,
      rate  : s.rate,
      band,
      tax   : t,
    });
    tax += t;
  }
  return { tax, rows };
}

function getSurchargeRate(income, regime) {
  if (income <= 5_000_000)                           return 0;
  if (income <= 10_000_000)                          return 10;
  if (income <= 20_000_000)                          return 15;
  if (income <= 50_000_000)                          return 25;
  return regime === 'new' ? 25 : 37;
}

function hraExempt(hraAnnual, rentAnnual, basicPlusDA, isMetro) {
  if (rentAnnual <= 0) return 0;
  return Math.max(0, Math.min(
    hraAnnual,
    rentAnnual - 0.1 * basicPlusDA,
    basicPlusDA * (isMetro ? 0.5 : 0.4),
  ));
}

// ─── Main computation ─────────────────────────────────────────────────────────
function computeTax(inp) {
  const {
    regime, ageCategory,
    basicMonthly, daPercent, hraMonthly, otherAllow, otherAllowTaxable,
    otherIncome,
    // old regime deductions
    rentAnnual, isMetro,
    profTax,
    hlInterest,
    gpf, sli, lic, ppf, elss, hlPrincipal, otherC, npsC,
    npsAdditional,
    employerNPS,
    medSelf, medParents, seniorParents,
    eduLoan,
    donations,
    savingsInterest,
    tdsPaid,
  } = inp;

  const basicAnnual  = n(basicMonthly) * 12;
  const daAnnual     = basicAnnual * (n(daPercent) / 100);
  const hraAnnual    = n(hraMonthly) * 12;
  const otherAnn     = n(otherAllow) * 12;
  const basicPlusDA  = basicAnnual + daAnnual;
  const grossSalary  = basicAnnual + daAnnual + hraAnnual + otherAnn;

  // ── NEW REGIME ──────────────────────────────────────────────────────────────
  if (regime === 'new') {
    const stdDed  = 75_000;
    // Only 80CCD(2) employer NPS allowed; 10% for state govt
    const empNPS  = clamp(n(employerNPS) || basicPlusDA * 0.10, basicPlusDA * 0.14);
    const taxable = Math.max(0, grossSalary - stdDed - empNPS + n(otherIncome));

    const { tax: rawTax, rows } = slabTax(taxable, NEW_SLABS);
    const rebate87A  = taxable <= 1_200_000 ? rawTax : 0;
    const taxNoRebate = Math.max(0, rawTax - rebate87A);
    const scRate     = getSurchargeRate(taxable, 'new');
    const sc         = taxNoRebate * scRate / 100;
    const cess       = (taxNoRebate + sc) * 0.04;
    const totalTax   = Math.round(taxNoRebate + sc + cess);

    return {
      regime: 'new', grossSalary, basicAnnual, daAnnual, hraAnnual, otherAnn,
      stdDed, hraExemptAmt: 0, profTaxDed: 0,
      salaryIncome: grossSalary - stdDed - empNPS,
      otherIncomeAmt: n(otherIncome),
      grossTotalIncome: taxable,
      hlInterestDed: 0, c80: 0, npsAddDed: 0, empNPSDed: empNPS,
      d80: 0, eduLoanDed: 0, donationDed: 0, savingsDed: 0,
      totalChapterVIA: empNPS,
      taxableIncome: taxable,
      slabRows: rows, rawTax, rebate87A,
      taxAfterRebate: taxNoRebate,
      scRate, sc, cess, totalTax,
      monthlyTDS: totalTax / 12,
      balanceTax: totalTax - n(tdsPaid),
    };
  }

  // ── OLD REGIME ──────────────────────────────────────────────────────────────
  const slabs   = OLD_SLABS[ageCategory] ?? OLD_SLABS.below60;
  const stdDed  = 50_000;
  const hraEx   = hraExempt(hraAnnual, n(rentAnnual), basicPlusDA, isMetro);
  const profTaxDed = Math.min(n(profTax), 5_000);
  const salaryIncome = Math.max(0, grossSalary - stdDed - hraEx - profTaxDed);
  const grossTotalIncome = salaryIncome + n(otherIncome);

  // Section 24(b) housing loan interest — self-occupied max ₹2L
  const hlInterestDed = clamp(n(hlInterest), 200_000);

  // 80C (cap ₹1,50,000)
  const c80 = Math.min(
    n(gpf) + n(sli) + n(lic) + n(ppf) + n(elss) + n(hlPrincipal) + n(otherC) + n(npsC),
    150_000,
  );
  // 80CCD(1B) additional NPS
  const npsAddDed = clamp(n(npsAdditional), 50_000);
  // 80CCD(2) employer NPS (10% for state govt)
  const empNPSDed = clamp(n(employerNPS) || 0, basicPlusDA * 0.14);

  // 80D mediclaim
  const selfMed   = clamp(n(medSelf),    ageCategory === 'below60' ? 25_000 : 50_000);
  const parentMed = clamp(n(medParents), seniorParents              ? 50_000 : 25_000);
  const d80       = selfMed + parentMed;

  // 80E education loan (unlimited)
  const eduLoanDed = Math.max(0, n(eduLoan));
  // 80G donations (50%)
  const donationDed = Math.round(n(donations) * 0.5);
  // 80TTA / 80TTB savings interest
  const savingsDed = clamp(n(savingsInterest), ageCategory === 'below60' ? 10_000 : 50_000);

  const totalChapterVIA = c80 + npsAddDed + empNPSDed + d80 + eduLoanDed + donationDed + savingsDed;
  const taxableIncome   = Math.max(0, grossTotalIncome - hlInterestDed - totalChapterVIA);

  const { tax: rawTax, rows } = slabTax(taxableIncome, slabs);
  const rebate87A      = taxableIncome <= 500_000 ? Math.min(rawTax, 12_500) : 0;
  const taxAfterRebate = Math.max(0, rawTax - rebate87A);
  const scRate         = getSurchargeRate(taxableIncome, 'old');
  const sc             = taxAfterRebate * scRate / 100;
  const cess           = (taxAfterRebate + sc) * 0.04;
  const totalTax       = Math.round(taxAfterRebate + sc + cess);

  return {
    regime: 'old', grossSalary, basicAnnual, daAnnual, hraAnnual, otherAnn,
    stdDed, hraExemptAmt: hraEx, profTaxDed,
    salaryIncome, otherIncomeAmt: n(otherIncome),
    grossTotalIncome,
    hlInterestDed, c80, npsAddDed, empNPSDed,
    d80, eduLoanDed, donationDed, savingsDed,
    totalChapterVIA,
    taxableIncome,
    slabRows: rows, rawTax, rebate87A,
    taxAfterRebate, scRate, sc, cess, totalTax,
    monthlyTDS: totalTax / 12,
    balanceTax: totalTax - n(tdsPaid),
  };
}

// ─── UI helpers ───────────────────────────────────────────────────────────────
const iCls = 'w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#ff9f0a]/60 focus:ring-1 focus:ring-[#ff9f0a]/30 transition-all';
const lCls = 'block text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1';

function Field({ label, hint, children, span2 }) {
  return (
    <div className={span2 ? 'md:col-span-2' : ''}>
      <label className={lCls}>{label}</label>
      {children}
      {hint && <p className="mt-1 text-[10px] text-white/25">{hint}</p>}
    </div>
  );
}

function Input({ value, onChange, placeholder, min = 0, step = 1, max }) {
  return (
    <input
      type="number" min={min} step={step} max={max}
      value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={iCls}
    />
  );
}

function SectionHead({ title, sub }) {
  return (
    <div className="md:col-span-2 mt-2 pb-2 border-b border-white/[0.08]">
      <p className="text-xs font-bold text-[#ff9f0a]">{title}</p>
      {sub && <p className="text-[10px] text-white/30 mt-0.5">{sub}</p>}
    </div>
  );
}

function ResRow({ label, value, sub, accent, bold, neg, indent, border }) {
  const color = accent ? 'text-[#ff9f0a]' : neg ? 'text-red-400' : 'text-white';
  return (
    <div className={`flex justify-between items-center py-1.5 ${border ? 'border-t border-white/10 mt-1 pt-2' : 'border-b border-white/[0.04]'}`}>
      <span className={`text-xs ${indent ? 'pl-3 text-white/35' : bold ? 'font-semibold text-white/70' : 'text-white/50'}`}>{label}{sub && <span className="ml-1 text-[10px] text-white/25">{sub}</span>}</span>
      <span className={`text-sm tabular-nums font-bold ${color}`}>{value}</span>
    </div>
  );
}

function Toggle({ value, onChange, label }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <div
        onClick={() => onChange(!value)}
        className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${value ? 'bg-[#ff9f0a]' : 'bg-white/15'}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${value ? 'left-4' : 'left-0.5'}`} />
      </div>
      <span className="text-xs text-white/55">{label}</span>
    </label>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function IncomeTaxCalculator() {
  const [regime, setRegime]       = useState('new');
  const [ageCategory, setAge]     = useState('below60');

  // Salary
  const [basic,      setBasic]    = useState('');
  const [daPct,      setDaPct]    = useState('49');
  const [hraM,       setHraM]     = useState('');
  const [otherAllow, setOther]    = useState('');
  const [otherInc,   setOtherInc] = useState('');

  // Old regime — HRA
  const [rentAnn,    setRent]     = useState('');
  const [isMetro,    setMetro]    = useState(false);

  // Old regime — Sec 16
  const [profTax,    setProfTax]  = useState('2400');

  // Old regime — Sec 24(b)
  const [hlInt,      setHlInt]    = useState('');

  // Old regime — 80C
  const [gpf,  setGpf]   = useState('');
  const [sli,  setSli]   = useState('');
  const [lic,  setLic]   = useState('');
  const [ppf,  setPpf]   = useState('');
  const [elss, setElss]  = useState('');
  const [hlPrincipal, setHlPrin] = useState('');
  const [npsC, setNpsC]  = useState('');
  const [otherC, setOtherC] = useState('');

  // Old regime — 80CCD(1B) & 80CCD(2)
  const [npsAdd,     setNpsAdd]   = useState('');
  const [empNPS,     setEmpNPS]   = useState('');

  // Old regime — 80D
  const [medSelf,    setMedSelf]  = useState('');
  const [medParents, setMedPar]   = useState('');
  const [seniorPar,  setSenPar]   = useState(false);

  // Old regime — others
  const [eduLoan,    setEduLoan]  = useState('');
  const [donations,  setDon]      = useState('');
  const [savings,    setSavings]  = useState('');

  // TDS paid
  const [tdsPaid,    setTds]      = useState('');

  // Pension type helper
  const [pensionType, setPension] = useState('nps');

  const inp = {
    regime, ageCategory,
    basicMonthly: basic, daPercent: daPct, hraMonthly: hraM, otherAllow,
    otherIncome: otherInc,
    rentAnnual: rentAnn, isMetro,
    profTax,
    hlInterest: hlInt,
    gpf, sli, lic, ppf, elss, hlPrincipal, otherC, npsC,
    npsAdditional: npsAdd, employerNPS: empNPS,
    medSelf, medParents, seniorParents: seniorPar,
    eduLoan, donations, savingsInterest: savings,
    tdsPaid,
  };

  const R = useMemo(() => {
    if (!n(basic)) return null;
    return computeTax(inp);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regime, ageCategory, basic, daPct, hraM, otherAllow, otherInc,
      rentAnn, isMetro, profTax, hlInt,
      gpf, sli, lic, ppf, elss, hlPrincipal, npsC, otherC,
      npsAdd, empNPS, medSelf, medParents, seniorPar,
      eduLoan, donations, savings, tdsPaid]);

  // 80C live total
  const liveC80 = Math.min(n(gpf)+n(sli)+n(lic)+n(ppf)+n(elss)+n(hlPrincipal)+n(npsC)+n(otherC), 150_000);

  /* When pension type changes, auto-fill NPS contribution hint */
  const basicPlusDA_mon = n(basic) * (1 + n(daPct)/100);
  const npsAutoEmployee = Math.round(basicPlusDA_mon * 12 * 0.10);
  const npsAutoEmployer = Math.round(basicPlusDA_mon * 12 * 0.10);

  return (
    <div>
      {/* ── Header ── */}
      <div className="glass-card rounded-[20px] p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'rgba(255,159,10,0.15)', border: '1px solid rgba(255,159,10,0.25)' }}>💸</div>
            <div>
              <h1 className="text-lg font-[900] text-white leading-tight" style={{ fontFamily: "'Meera', sans-serif" }}>Income Tax Calculator</h1>
              <p className="text-xs text-white/40">FY 2025–26 (AY 2026–27) · Kerala Govt Employees</p>
            </div>
          </div>

          {/* Regime tabs */}
          <div className="flex gap-1 p-1 rounded-xl bg-white/[0.05] border border-white/10 w-fit">
            {[['new', 'New Regime'], ['old', 'Old Regime']].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setRegime(id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                  regime === id
                    ? 'bg-[#ff9f0a] text-black'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Regime info banner */}
        <div className={`mb-6 rounded-xl px-4 py-3 text-xs leading-relaxed ${regime === 'new' ? 'bg-[#ff9f0a]/[0.08] border border-[#ff9f0a]/20 text-[#ff9f0a]/80' : 'bg-[#2997ff]/[0.08] border border-[#2997ff]/20 text-[#2997ff]/80'}`}>
          {regime === 'new'
            ? 'New Regime (Default from FY 2023-24): Standard deduction ₹75,000. No HRA/80C/80D deductions. Rebate u/s 87A: zero tax if income ≤ ₹12,00,000. Only employer NPS (80CCD-2) allowed.'
            : 'Old Regime: Standard deduction ₹50,000. Full HRA exemption, 80C (₹1.5L), 80D, 80E, Section 24(b) and all other deductions available. Rebate u/s 87A up to ₹12,500 if income ≤ ₹5,00,000.'}
        </div>

        {/* Age category */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[['below60', 'Below 60', 'Individual'], ['senior', '60 – 79', 'Senior Citizen'], ['superSenior', '80+', 'Super Senior']].map(([id, age, label]) => (
            <button
              key={id}
              onClick={() => setAge(id)}
              className={`rounded-xl px-3 py-2.5 border text-left transition-all duration-150 ${ageCategory === id ? 'border-[#ff9f0a]/60 bg-[#ff9f0a]/10' : 'border-white/10 bg-white/[0.03] hover:border-white/20'}`}
            >
              <div className="text-xs font-bold text-white">{age}</div>
              <div className="text-[10px] text-white/35">{label}</div>
            </button>
          ))}
        </div>

        {/* ── Inputs ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <SectionHead title="Salary Income (Monthly)" sub="Enter monthly figures — annual totals computed automatically" />

          <Field label="Basic Pay (₹/month)">
            <Input value={basic} onChange={setBasic} placeholder="e.g. 45000" />
          </Field>
          <Field label="DA (%)" hint={basic ? `DA = ${fmtR(n(basic) * n(daPct) / 100)}/month` : ''}>
            <Input value={daPct} onChange={setDaPct} placeholder="49" step="0.5" />
          </Field>
          <Field label="HRA Received (₹/month)">
            <Input value={hraM} onChange={setHraM} placeholder="e.g. 9000" />
          </Field>
          <Field label="Other Allowances (₹/month)" hint="TA, Medical Allowance, etc. (taxable portion)">
            <Input value={otherAllow} onChange={setOther} placeholder="e.g. 2000" />
          </Field>
          <Field label="Other Income (Annual ₹)" hint="FD interest, rent, any other source" span2>
            <Input value={otherInc} onChange={setOtherInc} placeholder="e.g. 10000" />
          </Field>

          {/* ── Old Regime Deductions ── */}
          {regime === 'old' && (<>

            <SectionHead title="HRA Exemption — Section 10(13A)" sub="Exempt = least of: (Actual HRA, Rent paid − 10% Basic+DA, 50%/40% of Basic+DA)" />
            <Field label="Total Rent Paid (Annual ₹)">
              <Input value={rentAnn} onChange={setRent} placeholder="e.g. 120000" />
            </Field>
            <Field label="City Type">
              <select value={isMetro ? 'metro' : 'nonmetro'} onChange={e => setMetro(e.target.value === 'metro')} className={iCls}>
                <option value="nonmetro">Non-Metro (40% of Basic+DA)</option>
                <option value="metro">Metro — Mumbai/Delhi/Chennai/Kolkata (50%)</option>
              </select>
            </Field>

            <SectionHead title="Section 16 — Professional Tax" />
            <Field label="Professional Tax Paid (Annual ₹)" hint="₹2,400 is standard for Kerala Govt employees">
              <Input value={profTax} onChange={setProfTax} placeholder="2400" max={5000} />
            </Field>
            <div /> {/* spacer */}

            <SectionHead title="Section 24(b) — Housing Loan Interest" sub="Self-occupied property: max deduction ₹2,00,000" />
            <Field label="Housing Loan Interest (Annual ₹)">
              <Input value={hlInt} onChange={setHlInt} placeholder="e.g. 150000" />
            </Field>
            <div />

            <SectionHead
              title={`Section 80C — Max ₹1,50,000 | Live: ${fmtR(liveC80)} / ₹1,50,000`}
              sub="GPF, SLI, LIC, PPF, ELSS, NPS employee contribution, Housing Loan Principal, etc."
            />

            {/* Pension type helper */}
            <Field label="Pension Type" span2>
              <div className="flex gap-2">
                {[['nps', 'NPS (post-2013)'], ['gpf', 'GPF (pre-2013)']].map(([id, label]) => (
                  <button key={id} onClick={() => setPension(id)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${pensionType === id ? 'border-[#ff9f0a]/60 bg-[#ff9f0a]/10 text-white' : 'border-white/10 text-white/40 hover:border-white/20'}`}>
                    {label}
                  </button>
                ))}
              </div>
              {pensionType === 'nps' && basic && (
                <p className="mt-1.5 text-[10px] text-white/30">
                  Employee NPS 10% = {fmtR(npsAutoEmployee)}/yr · Employer NPS 10% = {fmtR(npsAutoEmployer)}/yr
                </p>
              )}
            </Field>

            <Field label="GPF Contribution (Annual ₹)" hint="Qualifying u/s 80C">
              <Input value={gpf} onChange={setGpf} placeholder="e.g. 60000" />
            </Field>
            <Field label="SLI Premium (Annual ₹)" hint="State Life Insurance — 80C">
              <Input value={sli} onChange={setSli} placeholder="e.g. 3600" />
            </Field>
            <Field label="LIC Premium (Annual ₹)">
              <Input value={lic} onChange={setLic} placeholder="e.g. 12000" />
            </Field>
            <Field label="PPF Contribution (Annual ₹)">
              <Input value={ppf} onChange={setPpf} placeholder="e.g. 50000" />
            </Field>
            <Field label="ELSS / Mutual Fund (Annual ₹)">
              <Input value={elss} onChange={setElss} placeholder="e.g. 25000" />
            </Field>
            <Field label="NPS Employee Contribution (Annual ₹)" hint="Within 80C limit">
              <Input value={npsC} onChange={setNpsC} placeholder={basic ? String(npsAutoEmployee) : 'e.g. 54000'} />
            </Field>
            <Field label="Housing Loan Principal (Annual ₹)">
              <Input value={hlPrincipal} onChange={setHlPrin} placeholder="e.g. 60000" />
            </Field>
            <Field label="Other 80C (NSC, Tuition Fees, etc.)">
              <Input value={otherC} onChange={setOtherC} placeholder="e.g. 5000" />
            </Field>

            <SectionHead title="80CCD(1B) — Additional NPS" sub="Over and above 80C — max ₹50,000" />
            <Field label="Additional NPS Contribution (₹)">
              <Input value={npsAdd} onChange={setNpsAdd} placeholder="e.g. 50000" max={50000} />
            </Field>
            <div />

            <SectionHead title="80CCD(2) — Employer NPS Contribution" sub="10% of Basic+DA for Kerala Govt — NOT part of ₹1.5L 80C limit" />
            <Field label="Employer NPS Contribution (Annual ₹)" hint={basic ? `10% of Basic+DA = ${fmtR(npsAutoEmployer)}` : 'Enter annual employer NPS'}>
              <Input value={empNPS} onChange={setEmpNPS} placeholder={basic ? String(npsAutoEmployer) : 'e.g. 54000'} />
            </Field>
            <div />

            <SectionHead title="80D — Mediclaim / Health Insurance" />
            <Field label="Self + Family Mediclaim (Annual ₹)" hint={`Max ${ageCategory === 'below60' ? '₹25,000' : '₹50,000'}`}>
              <Input value={medSelf} onChange={setMedSelf} placeholder={ageCategory === 'below60' ? '25000' : '50000'} />
            </Field>
            <Field label="Parents Mediclaim (Annual ₹)" hint={`Max ${seniorPar ? '₹50,000' : '₹25,000'}`}>
              <Input value={medParents} onChange={setMedPar} placeholder={seniorPar ? '50000' : '25000'} />
            </Field>
            <div className="md:col-span-2">
              <Toggle value={seniorPar} onChange={setSenPar} label="Parents are Senior Citizens (60+)" />
            </div>

            <SectionHead title="Other Deductions" />
            <Field label="80E — Education Loan Interest (₹)" hint="Unlimited deduction">
              <Input value={eduLoan} onChange={setEduLoan} placeholder="e.g. 30000" />
            </Field>
            <Field label="80G — Charitable Donations (₹)" hint="50% deduction applied">
              <Input value={donations} onChange={setDon} placeholder="e.g. 10000" />
            </Field>
            <Field label="80TTA/80TTB — Savings Interest (₹)" hint={ageCategory === 'below60' ? 'Max ₹10,000 (80TTA)' : 'Max ₹50,000 (80TTB — senior citizens)'}>
              <Input value={savings} onChange={setSavings} placeholder={ageCategory === 'below60' ? '10000' : '50000'} />
            </Field>
            <div />
          </>)}

          <SectionHead title="Tax Already Deducted / Advance Tax" />
          <Field label="TDS + Advance Tax Paid (Annual ₹)">
            <Input value={tdsPaid} onChange={setTds} placeholder="e.g. 20000" />
          </Field>
          <div />
        </div>
      </div>

      {/* ── Results ── */}
      {!basic && (
        <div className="glass-card rounded-[20px] p-8 text-center border border-dashed border-white/10">
          <p className="text-sm text-white/30">Enter your Basic Pay above to see the tax computation</p>
        </div>
      )}

      {R && (
        <div className="glass-card rounded-[20px] p-6 md:p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-bold text-[#ff9f0a] uppercase tracking-widest">Tax Computation — FY 2025–26</div>
            <div className="text-[10px] text-white/30">{regime === 'new' ? 'New Regime' : 'Old Regime'} · {ageCategory === 'below60' ? 'Below 60' : ageCategory === 'senior' ? '60–79 yrs' : '80+ yrs'}</div>
          </div>

          {/* Income section */}
          <div className="mb-4">
            <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-2">A. Income Computation</p>
            <ResRow label="Gross Salary (Annual)" value={fmtR(R.grossSalary)} bold />
            <ResRow label="Less: Standard Deduction" value={`−${fmtR(R.stdDed)}`} indent neg />
            {R.hraExemptAmt > 0 && <ResRow label="Less: HRA Exemption u/s 10(13A)" value={`−${fmtR(R.hraExemptAmt)}`} indent neg />}
            {R.profTaxDed  > 0 && <ResRow label="Less: Professional Tax u/s 16(iii)" value={`−${fmtR(R.profTaxDed)}`} indent neg />}
            {R.empNPSDed   > 0 && R.regime === 'new' && <ResRow label="Less: Employer NPS u/s 80CCD(2)" value={`−${fmtR(R.empNPSDed)}`} indent neg />}
            <ResRow label="Income from Salary" value={fmtR(R.salaryIncome)} bold border />
            {R.otherIncomeAmt > 0 && <ResRow label="Add: Income from Other Sources" value={`+${fmtR(R.otherIncomeAmt)}`} />}
            <ResRow label="Gross Total Income" value={fmtR(R.grossTotalIncome)} bold border />
          </div>

          {/* Deductions — old regime */}
          {R.regime === 'old' && (R.hlInterestDed + R.totalChapterVIA) > 0 && (
            <div className="mb-4">
              <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-2">B. Deductions</p>
              {R.hlInterestDed > 0 && <ResRow label="Section 24(b) — Housing Loan Interest" value={`−${fmtR(R.hlInterestDed)}`} indent neg />}
              {R.c80      > 0 && <ResRow label="Section 80C" value={`−${fmtR(R.c80)}`} indent neg />}
              {R.npsAddDed> 0 && <ResRow label="Section 80CCD(1B) — Additional NPS" value={`−${fmtR(R.npsAddDed)}`} indent neg />}
              {R.empNPSDed> 0 && <ResRow label="Section 80CCD(2) — Employer NPS" value={`−${fmtR(R.empNPSDed)}`} indent neg />}
              {R.d80      > 0 && <ResRow label="Section 80D — Mediclaim" value={`−${fmtR(R.d80)}`} indent neg />}
              {R.eduLoanDed>0 && <ResRow label="Section 80E — Education Loan" value={`−${fmtR(R.eduLoanDed)}`} indent neg />}
              {R.donationDed>0&& <ResRow label="Section 80G — Donations (50%)" value={`−${fmtR(R.donationDed)}`} indent neg />}
              {R.savingsDed>0 && <ResRow label="Section 80TTA/80TTB — Savings Interest" value={`−${fmtR(R.savingsDed)}`} indent neg />}
              <ResRow label="Total Deductions" value={`−${fmtR(R.hlInterestDed + R.totalChapterVIA)}`} bold neg border />
            </div>
          )}

          {/* Taxable income */}
          <div className="rounded-xl bg-[#ff9f0a]/[0.08] border border-[#ff9f0a]/20 px-4 py-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-white/80">Net Taxable Income</span>
              <span className="text-xl font-[900] text-[#ff9f0a] tabular-nums">{fmtR(R.taxableIncome)}</span>
            </div>
          </div>

          {/* Slab breakdown */}
          <div className="mb-4">
            <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-2">C. Tax on Total Income (Slab-wise)</p>
            {R.slabRows.map((row, i) => (
              <ResRow
                key={i}
                label={row.label}
                sub={`@ ${row.rate}%`}
                value={row.tax === 0 ? 'Nil' : fmtR(row.tax)}
                indent
              />
            ))}
            {R.slabRows.length === 0 && <ResRow label="Income within nil-tax slab" value="Nil" indent />}
            <ResRow label="Tax before Rebate" value={fmtR(R.rawTax)} bold border />
            {R.rebate87A > 0 && <ResRow label={`Less: Rebate u/s 87A (income ≤ ${R.regime === 'new' ? '₹12,00,000' : '₹5,00,000'})`} value={`−${fmtR(R.rebate87A)}`} indent neg />}
            <ResRow label="Tax after Rebate" value={fmtR(R.taxAfterRebate)} bold border />
            {R.scRate > 0 && <ResRow label={`Surcharge @ ${R.scRate}%`} value={fmtR(R.sc)} indent />}
            <ResRow label="Health & Education Cess @ 4%" value={fmtR(R.cess)} indent />
          </div>

          {/* Final */}
          <div className="rounded-xl bg-white/[0.04] border border-white/10 px-4 py-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-white/70">Total Tax Payable</span>
              <span className="text-2xl font-[900] text-white tabular-nums">{fmtR(R.totalTax)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/40">Monthly TDS Required</span>
              <span className="text-base font-bold text-[#ff9f0a] tabular-nums">{fmtR(R.monthlyTDS)}/month</span>
            </div>
            {n(tdsPaid) > 0 && (
              <div className="flex justify-between items-center border-t border-white/10 pt-2">
                <span className="text-xs text-white/40">Less: TDS / Advance Tax Paid</span>
                <span className="text-sm font-bold text-white/60 tabular-nums">−{fmtR(n(tdsPaid))}</span>
              </div>
            )}
            {n(tdsPaid) > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-white/70">{R.balanceTax >= 0 ? 'Balance Tax Payable' : 'Refund Due'}</span>
                <span className={`text-base font-[900] tabular-nums ${R.balanceTax >= 0 ? 'text-red-400' : 'text-[#30d158]'}`}>
                  {R.balanceTax >= 0 ? fmtR(R.balanceTax) : `+${fmtR(-R.balanceTax)}`}
                </span>
              </div>
            )}
          </div>

          {/* Comparison hint */}
          <p className="mt-3 text-[10px] text-white/20 leading-relaxed">
            Note: This calculator uses total salary days (gross). Actual TDS may differ based on arrears, perquisites, and employer's month-wise computation. Verify with your DDO / Pay bill officer.
          </p>
        </div>
      )}

      {/* ── Regime comparison tip ── */}
      {R && (
        <div className="glass-card rounded-[20px] p-5 mb-6 border border-white/[0.06]">
          <p className="text-xs font-bold text-white/50 mb-2 uppercase tracking-wider">Which Regime to Choose?</p>
          <p className="text-xs text-white/40 leading-relaxed">
            Switch to the other regime tab to compare. Generally, the <strong className="text-white/60">New Regime</strong> benefits employees with fewer deductions (no home loan, no large 80C investments), especially if income ≤ ₹12L (zero tax after rebate). The <strong className="text-white/60">Old Regime</strong> benefits those with GPF + SLI + LIC + housing loan interest + 80D adding up above ~₹3.75L in deductions.
          </p>
        </div>
      )}
    </div>
  );
}
