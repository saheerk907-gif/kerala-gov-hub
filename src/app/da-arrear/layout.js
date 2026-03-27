import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Kerala DA Arrear Calculator 2021–2026 – Calculate Salary Arrears with Latest G.O.',
  description: 'Kerala govt employee DA arrear calculator 2026 — compute month-wise Dearness Allowance arrears from March 2021 based on 11th PRC G.O.s. Supports increments, promotions and latest G.O.(P)No.27/2026.',
  path: '/da-arrear',
  keywords: [
    'DA arrear calculator Kerala',
    'Kerala DA arrear 2026',
    'dearness allowance arrear Kerala govt',
    '11th PRC DA arrear',
    'Kerala DA arrear 2021 to 2026',
    'G.O.27/2026 DA arrear',
    'DA arrear calculation formula Kerala',
    'DA arrear GPF credit Kerala',
    'DA കണക്കുകൂട്ടൽ',
    'കേരള DA arrear',
  ],
});

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is DA arrear for Kerala government employees?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'DA arrear is the difference between DA due and DA paid for each month under the 11th PRC. Formula: DA Arrear = (DA Due% − DA Paid%) × Basic Pay × Number of months.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why does the Kerala DA arrear start from March 2021?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'DA arrears for July 2019 to February 2021 were settled via G.O.(P)No.27/2021 as part of the 11th PRC implementation. Remaining arrears from March 2021 onwards are covered by subsequent G.O.s up to G.O.(P)No.27/2026.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many installments is the 2026 DA arrear paid in Kerala?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'As per G.O.(P)No.27/2026/Fin dated 20/02/2026, DA arrear for January 2024, July 2024, and January 2025 slabs is credited to the employee\'s GPF/PF account. Pensioners receive DR arrears as per the same G.O.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is DA arrear credited to PF or paid in cash in Kerala?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'DA arrears under Kerala 11th PRC are credited to the GPF/PF account, not paid as cash. The credit is subject to a lock-in period as per the Finance Department G.O.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is DA arrear taxable for Kerala government employees?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, DA arrear is taxable as salary income. Employees can claim relief under Section 89(1) by filing Form 10E to reduce the tax burden by spreading liability across the relevant years.',
      },
    },
  ],
};

const softwareAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Kerala DA Arrear Calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  url: 'https://keralaemployees.in/da-arrear',
  description: 'Calculate month-wise Dearness Allowance arrears for Kerala government employees from March 2021 to 2026 based on 11th PRC G.O.s including the latest G.O.(P)No.27/2026.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function DaArrearLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }} />
      {children}
    </>
  );
}
