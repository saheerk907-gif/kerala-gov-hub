import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'NPS vs APS Comparison — Kerala Government Employees',
  description: 'Compare National Pension System (NPS) and Assured Pension Scheme (APS) for Kerala government employees. Benefits, contributions, and retirement corpus analysis.',
  path: '/nps-aps',
  keywords: ['NPS vs APS Kerala', 'Assured Pension Scheme Kerala', 'NPS APS comparison', 'Kerala pension scheme comparison'],
});

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is the difference between NPS and APS for Kerala government employees?', acceptedAnswer: { '@type': 'Answer', text: 'NPS is market-linked and corpus depends on investment returns. APS guarantees 50% of last drawn salary as pension, similar to the old pension scheme.' } },
    { '@type': 'Question', name: 'Which is better — NPS or APS for Kerala government employees?', acceptedAnswer: { '@type': 'Answer', text: 'APS guarantees 50% of last salary as pension. NPS can give higher returns if markets perform well but comes with uncertainty. APS suits those who prefer certainty.' } },
    { '@type': 'Question', name: 'What is the employer contribution in NPS for Kerala?', acceptedAnswer: { '@type': 'Answer', text: 'Employee contributes 10% of Basic Pay + DA, and the government contributes 14% of Basic Pay + DA to the NPS corpus.' } },
    { '@type': 'Question', name: 'What happens to NPS corpus after retirement in Kerala?', acceptedAnswer: { '@type': 'Answer', text: 'At least 40% must be used to purchase an annuity. The remaining 60% can be withdrawn as a lump sum, which is tax-free.' } },
    { '@type': 'Question', name: 'Can I switch from NPS to APS in Kerala?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, eligible NPS employees in Kerala can opt for APS as per the state government notification. Check the latest GO from Finance Department for current procedures.' } },
  ],
};

export default function NpsApsLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {children}
    </>
  );
}
