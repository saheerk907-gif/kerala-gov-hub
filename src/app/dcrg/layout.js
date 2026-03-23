import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'DCRG Calculator 2026 — Death-cum-Retirement Gratuity Kerala Government Employees',
  description: 'Kerala govt employee DCRG calculator — compute Death-cum-Retirement Gratuity instantly as per KSR Rule 77. Supports retirement DCRG and death gratuity, 10th and 11th PRC DA rates. Maximum ₹20,00,000.',
  path: '/dcrg',
  keywords: [
    'DCRG calculator Kerala',
    'death cum retirement gratuity Kerala 2026',
    'KSR Rule 77 gratuity calculation',
    'retirement gratuity Kerala government',
    'DCRG formula Kerala',
    'death gratuity Kerala govt employee',
    '11th PRC DCRG calculator',
    'DCRG maximum amount Kerala',
    'DCRG കണക്കുകൂട്ടൽ',
    'കേരള ഗ്രാറ്റുവിറ്റി',
  ],
});

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is DCRG for Kerala government employees?',
      acceptedAnswer: { '@type': 'Answer', text: 'DCRG (Death-cum-Retirement Gratuity) is a lump sum payment on retirement or to the family on death in service, governed by Rule 77 of KSR Part III. It is a one-time benefit, not a monthly pension.' },
    },
    {
      '@type': 'Question',
      name: 'How is DCRG calculated in Kerala?',
      acceptedAnswer: { '@type': 'Answer', text: 'DCRG = (Last Month Emoluments ÷ 2) × Qualifying Service (years). Last Emoluments = Basic Pay + DA. Qualifying service capped at 33 years. Maximum DCRG is ₹20,00,000.' },
    },
    {
      '@type': 'Question',
      name: 'What is the maximum DCRG amount in Kerala?',
      acceptedAnswer: { '@type': 'Answer', text: 'The maximum DCRG payable to a Kerala government employee is ₹20,00,000 (Twenty Lakh Rupees) as per current rules.' },
    },
    {
      '@type': 'Question',
      name: 'Is DCRG different from Death Gratuity in Kerala?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Retirement DCRG requires minimum 5 years service. Death Gratuity is paid to family on in-service death with no minimum. Death Gratuity formula: 2× LE (< 1 yr), 6× LE (1–5 yrs), 12× LE (5–20 yrs), LE × yrs ÷ 2 (20+ yrs).' },
    },
    {
      '@type': 'Question',
      name: 'What is the minimum qualifying service for DCRG?',
      acceptedAnswer: { '@type': 'Answer', text: 'Minimum 5 years qualifying service is required for Retirement DCRG. For Death Gratuity (in-service death), there is no minimum — family receives benefit from day one.' },
    },
    {
      '@type': 'Question',
      name: 'Is DCRG taxable for Kerala government employees?',
      acceptedAnswer: { '@type': 'Answer', text: 'No. Gratuity received by government employees is fully exempt from income tax under Section 10(10)(i) of the Income Tax Act, regardless of the amount.' },
    },
  ],
};

const softwareAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Kerala DCRG Calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  url: 'https://keralaemployees.in/dcrg',
  description: 'Calculate Death-cum-Retirement Gratuity (DCRG) for Kerala government employees as per KSR Rule 77. Supports retirement DCRG and death gratuity with 10th and 11th PRC DA rates.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function DcrgLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }} />
      {children}
    </>
  );
}
