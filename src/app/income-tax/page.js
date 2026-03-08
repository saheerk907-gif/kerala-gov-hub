import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import IncomeTaxCalculator from '@/components/IncomeTaxCalculator';

export const metadata = {
  title: 'Income Tax Calculator FY 2025-26 — Kerala Government Employees | Printable Anticipatory Statement',
  description:
    'Free printable income tax calculator for Kerala government employees for FY 2025-26 (AY 2026-27). Generate official Anticipatory Income Tax Statement with New Regime (Budget 2025 slabs, ₹75K standard deduction, 87A rebate up to ₹12L) and Old Regime (HRA exemption, 80C GPF/SLI/LIC, 80D Medisep, NPS 80CCD, Section 24(b), professional tax). Supports increment mid-year, arrears, and monthly TDS schedule.',
  alternates: { canonical: 'https://keralaemployees.in/income-tax' },
  keywords:
    'income tax calculator Kerala government employees 2025-26, anticipatory income tax statement Kerala, FY 2025-26 tax calculator Kerala, new regime old regime tax Kerala, HRA exemption calculator Kerala, 80C GPF SLI LIC tax deduction, NPS 80CCD tax Kerala, Kerala salary tax calculator, monthly TDS calculation Kerala, section 87A rebate new regime, Kerala DA 49 percent tax, printable tax statement Kerala govt',
  openGraph: {
    title: 'Income Tax Calculator FY 2025-26 — Kerala Govt Employees | Printable Statement',
    description:
      'Calculate income tax for FY 2025-26 under New or Old Regime and print the official Anticipatory Income Tax Statement. Covers all Kerala govt salary components: Basic, DA, HRA, GPF, SLI, NPS, professional tax, arrears, and all deductions with monthly TDS schedule.',
    url: 'https://keralaemployees.in/income-tax',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Income Tax Calculator FY 2025-26 — Kerala Govt Employees | Printable',
    description: 'New Regime vs Old Regime tax calculator for Kerala state government employees. Generate and print official Anticipatory Income Tax Statement with full slab-wise breakdown and monthly TDS schedule.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Anticipatory Income Tax Calculator for Kerala Government Employees FY 2025-26',
  url: 'https://keralaemployees.in/income-tax',
  description: metadata.description,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function IncomeTaxPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-[100px]">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex items-center gap-2 text-xs text-[#6e6e73] mb-8">
            <a href="/" className="hover:text-white transition-colors no-underline text-[#6e6e73]">Home</a>
            <span>›</span>
            <span className="text-[#ff9f0a]">Income Tax Calculator</span>
          </div>
          <IncomeTaxCalculator />
        </div>
      </main>
      <Footer />
    </>
  );
}
