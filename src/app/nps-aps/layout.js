import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'NPS vs APS Calculator 2026 — Kerala Government Employees Pension Comparison',
  description: 'Compare NPS and Assured Pension Scheme (APS) for Kerala govt employees. Calculate monthly pension, NPS corpus, lump sum and post-retirement income based on 12th PRC pay revision schedule and G.O.(P) No.33/2026.',
  path: '/nps-aps',
  keywords: [
    'NPS vs APS Kerala',
    'Assured Pension Scheme Kerala 2026',
    'Kerala NPS APS comparison calculator',
    'APS Kerala G.O. 2026',
    'NPS corpus calculator Kerala',
    'Kerala pension scheme comparison 2026',
    'NPS APS which is better Kerala',
    'Kerala govt employee pension projection',
    'NPS APS കേരള',
    'ഉറപ്പ് പെൻഷൻ കേരള',
  ],
});

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the difference between NPS and APS for Kerala government employees?',
      acceptedAnswer: { '@type': 'Answer', text: 'NPS is market-linked and corpus depends on investment returns. APS guarantees 50% of last drawn basic salary as pension, similar to the old pension scheme. APS provides certainty while NPS can yield higher returns.' },
    },
    {
      '@type': 'Question',
      name: 'Who is eligible for APS in Kerala?',
      acceptedAnswer: { '@type': 'Answer', text: 'Kerala government employees who joined service on or after 01-04-2013 (covered under NPS) are eligible to opt for APS as per G.O.(P) No.33/2026/F.N dated 28.02.2026.' },
    },
    {
      '@type': 'Question',
      name: 'Which is better — NPS or APS for Kerala government employees?',
      acceptedAnswer: { '@type': 'Answer', text: 'APS guarantees 50% of last basic salary as pension and grows with Dearness Relief annually. NPS can give higher returns if markets perform well and provides a 60% tax-free lump sum. APS suits those who prefer certainty; NPS suits those comfortable with market risk.' },
    },
    {
      '@type': 'Question',
      name: 'What is the employer contribution in NPS for Kerala?',
      acceptedAnswer: { '@type': 'Answer', text: 'Employee contributes 10% of Basic Pay + DA, and the government contributes 10% of Basic Pay + DA to the NPS corpus monthly.' },
    },
    {
      '@type': 'Question',
      name: 'Can I switch from NPS to APS in Kerala?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes, eligible NPS employees in Kerala can opt for APS as per G.O.(P) No.33/2026/F.N (28.02.2026). Check the latest Finance Department circular for the current opt-in window and procedure.' },
    },
    {
      '@type': 'Question',
      name: 'What happens to NPS corpus after retirement in Kerala?',
      acceptedAnswer: { '@type': 'Answer', text: 'At least 40% of the NPS corpus must be used to purchase an annuity. The remaining 60% can be withdrawn as a tax-free lump sum. The annuity provides a fixed monthly pension which does not grow with inflation, unlike APS which grows with Dearness Relief.' },
    },
  ],
};

const softwareAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Kerala NPS vs APS Calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  url: 'https://keralaemployees.in/nps-aps',
  description: 'Compare NPS and Assured Pension Scheme (APS) for Kerala government employees. Projects monthly pension, NPS corpus, lump sum and post-retirement income over 25 years based on actual pay revision schedule.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function NpsApsLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }} />
      {children}
    </>
  );
}
