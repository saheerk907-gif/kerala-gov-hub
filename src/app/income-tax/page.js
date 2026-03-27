import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import IncomeTaxCalculator from '@/components/IncomeTaxCalculator';
import IncomeTaxFAQ from '@/components/IncomeTaxFAQ';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Income Tax Calculator FY 2025-26 — Kerala Govt Employees',
  description: 'Free printable income tax calculator for Kerala govt employees FY 2025-26. New and Old Regime with all deductions, arrears, and monthly TDS schedule.',
  path: '/income-tax',
  keywords: ['income tax calculator Kerala government employees 2025-26', 'anticipatory income tax statement Kerala', 'new regime old regime tax Kerala', 'section 87A rebate new regime'],
});

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Anticipatory Income Tax Calculator for Kerala Government Employees FY 2025-26',
  url: 'https://keralaemployees.in/income-tax',
  description: 'Free printable income tax calculator for Kerala govt employees FY 2025-26. New and Old Regime with all deductions, arrears, and monthly TDS schedule.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What are the income tax slabs for Kerala government employees under the New Regime in FY 2025-26?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Under the New Regime (Section 115BAC) as revised by Budget 2025, the tax slabs for FY 2025-26 are: ₹0–₹4,00,000 — Nil; ₹4,00,001–₹8,00,000 — 5%; ₹8,00,001–₹12,00,000 — 10%; ₹12,00,001–₹16,00,000 — 15%; ₹16,00,001–₹20,00,000 — 20%; ₹20,00,001–₹24,00,000 — 25%; Above ₹24,00,000 — 30%. A standard deduction of ₹75,000 is available. If taxable income is ₹12,00,000 or below, Section 87A rebate makes the effective tax liability zero.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which tax regime — New or Old — is better for Kerala government employees in FY 2025-26?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The New Regime is generally better for employees with gross salary up to approximately ₹12,75,000 as effective tax is zero due to the Section 87A rebate. The Old Regime becomes beneficial when total deductions exceed approximately ₹3.75 lakh — employees with home loan interest of ₹2L, GPF/LIC of ₹1.5L (80C), NPS ₹50K (80CCD-1B), and mediclaim ₹25K (80D) may save more under the Old Regime.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the standard deduction for salaried government employees in FY 2025-26?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The standard deduction for salaried employees in FY 2025-26 is ₹75,000 under the New Regime (increased from ₹50,000 by Budget 2024) and ₹50,000 under the Old Regime. This deduction is automatically available to all salaried employees — no proof or investment is required.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is HRA exemption calculated for Kerala government employees?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'HRA exemption under Section 10(13A) is the least of: (1) Actual HRA received, (2) Rent paid minus 10% of (Basic Pay + DA), and (3) 40% of (Basic Pay + DA) for non-metro cities like Thiruvananthapuram and Kochi, or 50% for metro cities. HRA exemption is available only under the Old Regime.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can Kerala government employees claim GPF contribution under Section 80C?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. GPF contributions by Kerala government employees (pre-2013 appointees under the Old Pension Scheme) are fully deductible under Section 80C. The combined ceiling for all 80C investments — including GPF, SLI premium, LIC, PPF, ELSS, NSC, housing loan principal, and tuition fees — is ₹1,50,000 per year.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is SLI (State Life Insurance) premium deductible for Kerala government employees?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. State Life Insurance (SLI) premiums paid by Kerala government employees are deductible under Section 80C, subject to the overall cap of ₹1,50,000 per year. SLI is eligible only under the Old Regime — the New Regime does not allow Section 80C deductions.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the Section 87A rebate for FY 2025-26?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Under the New Regime for FY 2025-26 (Budget 2025), a full rebate under Section 87A applies if net taxable income does not exceed ₹12,00,000, making effective tax liability zero. For salaried employees with ₹75,000 standard deduction, gross salary up to ₹12,75,000 results in zero tax. Marginal relief is provided for income between ₹12,00,000 and ₹12,70,588. Under the Old Regime, the rebate is maximum ₹12,500 for taxable income up to ₹5,00,000.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is Section 80CCD(2) and how does it benefit NPS-enrolled Kerala government employees?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Section 80CCD(2) allows deduction for the employer\'s NPS contribution. For Kerala state government employees under NPS (appointed after April 2013), the state contributes 10% of (Basic Pay + DA) to the NPS account. This is deductible under Section 80CCD(2) — available under both the New and Old Regime — and is over and above the ₹1,50,000 Section 80C ceiling.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Medisep premium deductible under Section 80D for Kerala government employees?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. MEDISEP premiums paid by Kerala government employees (currently ₹689/month / ₹8,268/year for a family) are deductible under Section 80D. The maximum deduction is ₹25,000 for self and family (₹50,000 if senior citizen), plus ₹25,000 for parents (₹50,000 if senior citizen parents). Section 80D is available only under the Old Regime.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is monthly TDS from salary calculated for Kerala government employees?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The DDO calculates annual tax based on the Anticipatory Income Tax Statement submitted by the employee. Monthly TDS = (Total Annual Tax − TDS Already Deducted) ÷ Remaining Months. Employees must submit a revised statement whenever income or investment details change during the year.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are DA arrears taxable for Kerala government employees?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. DA arrears are fully taxable as salary income in the year of receipt. However, employees can claim relief under Section 89(1) if the arrears relate to earlier years and their inclusion results in higher tax. To claim this, employees must file Form 10E online on the Income Tax e-filing portal before filing their ITR.',
      },
    },
    {
      '@type': 'Question',
      name: 'What additional NPS deduction can Kerala government employees claim under Section 80CCD(1B)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'NPS-enrolled Kerala government employees can claim an additional deduction of up to ₹50,000 per year under Section 80CCD(1B) for voluntary NPS Tier-I contributions. This is over and above the ₹1,50,000 Section 80C ceiling. Section 80CCD(1B) is available only under the Old Regime.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is Form 12BB and when should Kerala government employees submit it?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Form 12BB is the statement of claims for deductions submitted by an employee to the DDO under Rule 26C of the Income Tax Rules, 1962. It must be submitted at the beginning of each financial year (April) declaring planned investments (80C, 80D, HRA, housing loan interest) so the DDO can compute the correct monthly TDS. The Anticipatory Income Tax Statement used by Kerala government DDOs serves the same purpose.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much professional tax can Kerala government employees deduct?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kerala government employees pay professional tax at ₹2,400 per year (₹200/month), which is fully deductible under Section 16(iii) of the Income Tax Act. The maximum allowed under the Income Tax Act is ₹5,000 per year. This deduction is available only under the Old Regime.',
      },
    },
  ],
};

export default function IncomeTaxPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />
      <main className="min-h-screen bg-aurora text-white pt-[100px]">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex items-center gap-2 text-xs text-white/60 mb-8">
            <a href="/" className="hover:text-white transition-colors no-underline text-white/60">Home</a>
            <span>›</span>
            <span className="text-[#ff9f0a]">Income Tax Calculator</span>
          </div>
          <IncomeTaxCalculator />
          <IncomeTaxFAQ />
        </div>
      </main>
      <Footer />
    </>
  );
}
