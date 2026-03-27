'use client';
import { useState } from 'react';

const FAQ_DATA = [
  {
    q: 'What are the income tax slabs for Kerala government employees under the New Regime in FY 2025-26?',
    a: 'Under the New Regime (Section 115BAC) as revised by Budget 2025, the tax slabs for FY 2025-26 (AY 2026-27) are: ₹0–₹4,00,000 — Nil; ₹4,00,001–₹8,00,000 — 5%; ₹8,00,001–₹12,00,000 — 10%; ₹12,00,001–₹16,00,000 — 15%; ₹16,00,001–₹20,00,000 — 20%; ₹20,00,001–₹24,00,000 — 25%; Above ₹24,00,000 — 30%. A standard deduction of ₹75,000 is available. Importantly, if the net taxable income is ₹12,00,000 or below, a full rebate under Section 87A makes the effective tax liability zero.',
  },
  {
    q: 'Which tax regime — New or Old — is better for Kerala government employees in FY 2025-26?',
    a: 'The New Regime is generally better for employees with taxable income up to ₹12,75,000 (gross salary up to approximately ₹13.5L with standard deduction), as the effective tax is zero due to the Section 87A rebate. The Old Regime becomes beneficial when total deductions exceed approximately ₹3.75 lakh — for example, employees with a home loan interest of ₹2L, GPF/LIC of ₹1.5L (80C), NPS ₹50K (80CCD-1B), and mediclaim ₹25K (80D) may save more under the Old Regime. Use our calculator above to compare both regimes with your actual figures.',
  },
  {
    q: 'What is the standard deduction for salaried government employees in FY 2025-26?',
    a: 'The standard deduction for salaried employees in FY 2025-26 is ₹75,000 under the New Regime (increased from ₹50,000 by Budget 2024) and ₹50,000 under the Old Regime. This deduction is automatically available to all salaried employees including Kerala state government employees — no proof or investment is required. It is deducted from gross salary before computing tax.',
  },
  {
    q: 'How is HRA exemption calculated for Kerala government employees under the Old Regime?',
    a: 'HRA exemption under Section 10(13A) is the least of three amounts: (1) Actual HRA received from the employer, (2) Rent paid minus 10% of (Basic Pay + DA), and (3) 50% of (Basic Pay + DA) for employees living in metro cities (Mumbai, Delhi, Kolkata, Chennai), or 40% for non-metro cities. Since Thiruvananthapuram, Kochi, and other Kerala cities are non-metro, most Kerala government employees get 40% of Basic+DA as the ceiling. HRA exemption is available only under the Old Regime — it cannot be claimed under the New Regime.',
  },
  {
    q: 'Can Kerala government employees claim GPF contribution under Section 80C?',
    a: 'Yes. General Provident Fund (GPF) contributions made by Kerala government employees (those under the Old Pension Scheme, i.e., pre-2013 appointees) are fully deductible under Section 80C of the Income Tax Act. The combined ceiling for all Section 80C investments — including GPF, SLI premium, LIC premium, PPF, ELSS, NSC, housing loan principal, children\'s tuition fees — is ₹1,50,000 per year. NPS employee contributions (for post-2013 Kerala govt employees) also qualify under Section 80CCD(1), which falls within the ₹1,50,000 ceiling.',
  },
  {
    q: 'Is SLI (State Life Insurance) premium deductible for Kerala government employees?',
    a: 'Yes. State Life Insurance (SLI) premiums paid by Kerala government employees are deductible under Section 80C of the Income Tax Act, along with other qualifying investments such as GPF, LIC, PPF, and ELSS. The total deduction under Section 80C is capped at ₹1,50,000 per year. SLI premiums are eligible under the Old Regime only — the New Regime does not allow Section 80C deductions.',
  },
  {
    q: 'What is the Section 87A rebate for FY 2025-26 and how does it benefit Kerala government employees?',
    a: 'Under the New Regime for FY 2025-26 (Budget 2025), a full rebate under Section 87A is available if the net taxable income does not exceed ₹12,00,000 — making the effective tax liability zero. For salaried employees with a standard deduction of ₹75,000, this means a gross salary of up to ₹12,75,000 (approximately ₹1,06,250/month) results in zero tax under the New Regime. Additionally, marginal relief is provided for income between ₹12,00,000 and ₹12,70,588 so that the tax payable does not exceed the income above ₹12 lakh. Under the Old Regime, the rebate is a maximum of ₹12,500 for taxable income up to ₹5,00,000.',
  },
  {
    q: 'How much professional tax can Kerala government employees deduct from taxable income?',
    a: 'Kerala government employees pay professional tax at the rate of ₹2,400 per year (₹200 per month). This is fully deductible under Section 16(iii) of the Income Tax Act in the Old Regime before arriving at the net income from salary. The maximum professional tax deductible under Section 16(iii) is ₹5,000 per year. Professional tax deduction is not available under the New Regime. The professional tax is deducted automatically from salary by the Treasury/DDO.',
  },
  {
    q: 'What is Section 80CCD(2) and how does it benefit NPS-enrolled Kerala government employees?',
    a: 'Section 80CCD(2) allows a deduction for the employer\'s contribution to the National Pension System (NPS). For Kerala state government employees appointed after April 2013 (who are under NPS), the state government contributes 10% of (Basic Pay + DA) to the employee\'s NPS Tier-I account. This employer contribution is deductible under Section 80CCD(2) — and crucially, this deduction is available under the New Regime as well as the Old Regime. It is over and above the ₹1,50,000 Section 80C ceiling. For example, if Basic+DA is ₹80,000/month, the annual employer NPS contribution of ₹96,000 is fully deductible from income.',
  },
  {
    q: 'Is Medisep (MEDISEP) health insurance premium deductible under Section 80D for Kerala government employees?',
    a: 'Yes. MEDISEP (Medical Service for Pensioners and Employees) is a group health insurance scheme for Kerala government employees. The premium paid by the employee (currently ₹689 per month / ₹8,268 per year for a family of 4) is deductible under Section 80D of the Income Tax Act. Under the Old Regime, the maximum deduction under 80D is ₹25,000 for self and family (₹50,000 if the employee is a senior citizen), plus an additional ₹25,000 for parents (₹50,000 if parents are senior citizens). Section 80D deductions are not available under the New Regime.',
  },
  {
    q: 'How is monthly TDS (Tax Deducted at Source) from salary calculated for Kerala government employees?',
    a: 'The DDO (Drawing and Disbursing Officer) calculates annual tax liability based on the Anticipatory Income Tax Statement submitted by the employee. The monthly TDS is: (Total Annual Tax − Tax Already Deducted) ÷ Remaining Months. For example, if the total tax for the year is ₹60,000, and ₹15,000 has already been deducted in April–June (3 months), the balance is ₹45,000 to be recovered in the remaining 9 months — monthly TDS = ₹5,000. Employees must submit a revised anticipatory statement whenever there is a change in income or investments.',
  },
  {
    q: 'What is Form 12BB and when should Kerala government employees submit it?',
    a: 'Form 12BB is the statement of claims for deductions by an employee to the employer (DDO) under Rule 26C of the Income Tax Rules, 1962. Kerala government employees must submit this at the beginning of the financial year (April), declaring their planned investments (80C, 80D, HRA details, housing loan interest) so the DDO can compute and deduct the correct monthly TDS. A revised statement should be submitted if there is any change in income or deductions during the year. The Anticipatory Income Tax Statement used by Kerala government DDOs serves the same purpose as Form 12BB.',
  },
  {
    q: 'Are DA (Dearness Allowance) arrears taxable for Kerala government employees?',
    a: 'Yes. DA arrears received by Kerala government employees are fully taxable as income from salary in the year of receipt. However, employees can claim relief under Section 89(1) of the Income Tax Act if the DA arrears relate to earlier years and their inclusion in the current year results in higher tax compared to what would have been payable if the arrears were received in the respective years. To claim this relief, employees must file Form 10E online on the Income Tax e-filing portal before filing their ITR. The relief computation is complex and is typically handled by the DDO upon submission of Form 10E details.',
  },
  {
    q: 'What additional NPS deduction can Kerala government employees claim under Section 80CCD(1B)?',
    a: 'Kerala government employees enrolled under NPS (appointed after April 2013) can claim an additional deduction of up to ₹50,000 per year under Section 80CCD(1B) for voluntary NPS Tier-I contributions over and above the mandatory 10% employee contribution. This ₹50,000 deduction is in addition to the ₹1,50,000 ceiling under Section 80C, effectively allowing a total deduction of ₹2,00,000 through NPS-related sections alone. This deduction is available only under the Old Regime — employees opting for the New Regime cannot claim Section 80CCD(1B).',
  },
];

export default function IncomeTaxFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section aria-label="Frequently Asked Questions on Income Tax for Kerala Government Employees" className="mt-8">
      <div className="mb-6">
        <h2
          className="text-[clamp(18px,2.5vw,26px)] font-[900] text-white mb-2 leading-tight"
          style={{ fontFamily: "var(--font-noto-malayalam), sans-serif" }}
        >
          Frequently Asked Questions — Income Tax for Kerala Government Employees
        </h2>
        <p className="text-sm text-white/60 leading-relaxed">
          Answers to the most common income tax questions for Kerala state government employees — New Regime vs Old Regime, Section 80C deductions, HRA exemption, NPS benefits, TDS calculation, and more. All answers are based on Income Tax Act 1961 provisions for FY 2025-26 (AY 2026-27).
        </p>
      </div>

      <div className="space-y-2">
        {FAQ_DATA.map((item, i) => (
          <div
            key={i}
            className="glass-card rounded-[16px] overflow-hidden border border-white/[0.07]"
            itemScope
            itemType="https://schema.org/Question"
          >
            <button
              className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 group"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              aria-expanded={openIndex === i}
            >
              <h3
                className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors leading-snug"
                itemProp="name"
              >
                {item.q}
              </h3>
              <span
                className={`flex-shrink-0 w-5 h-5 rounded-full border border-[#ff9f0a]/40 flex items-center justify-center text-[#ff9f0a]/70 text-xs font-bold transition-transform duration-200 mt-0.5 ${openIndex === i ? 'rotate-45 bg-[#ff9f0a]/10' : ''}`}
              >
                +
              </span>
            </button>

            {openIndex === i && (
              <div
                className="px-5 pb-5"
                itemScope
                itemType="https://schema.org/Answer"
              >
                <p className="text-sm text-white/55 leading-relaxed" itemProp="text">
                  {item.a}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="mt-6 text-[11px] text-white/40 leading-relaxed text-center">
        All information is based on Income Tax Act 1961, Income Tax Rules 1962, and Finance Act 2025 (Budget 2025) for FY 2025-26 / AY 2026-27. Consult a qualified tax professional for personalised advice.
      </p>
    </section>
  );
}
