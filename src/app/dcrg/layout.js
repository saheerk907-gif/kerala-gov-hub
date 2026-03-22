import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'DCRG Calculator — Death-cum-Retirement Gratuity Kerala',
  description: 'Calculate Death-cum-Retirement Gratuity (DCRG) for Kerala government employees. Based on latest rules under Kerala Service Rules.',
  path: '/dcrg',
  keywords: ['DCRG calculator Kerala', 'death cum retirement gratuity', 'retirement gratuity Kerala', 'DCRG കണക്കുകൂട്ടൽ'],
});

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is DCRG for Kerala government employees?', acceptedAnswer: { '@type': 'Answer', text: 'DCRG (Death-cum-Retirement Gratuity) is a lump sum payment on retirement or to the family on death in service, governed by Rule 77 of KSR.' } },
    { '@type': 'Question', name: 'How is DCRG calculated in Kerala?', acceptedAnswer: { '@type': 'Answer', text: 'DCRG = (Last Month Emoluments ÷ 2) × Qualifying Service (years). Maximum DCRG is ₹14,00,000.' } },
    { '@type': 'Question', name: 'What is the maximum DCRG amount in Kerala?', acceptedAnswer: { '@type': 'Answer', text: 'The maximum DCRG payable to a Kerala government employee is ₹14,00,000 (Fourteen Lakh Rupees).' } },
    { '@type': 'Question', name: 'Is DCRG taxable in Kerala?', acceptedAnswer: { '@type': 'Answer', text: 'No. Gratuity received by government employees is fully exempt from income tax under Section 10(10)(i) of the Income Tax Act.' } },
    { '@type': 'Question', name: 'What is the minimum qualifying service for DCRG?', acceptedAnswer: { '@type': 'Answer', text: 'A minimum of 5 years of qualifying service is required for DCRG on retirement.' } },
  ],
};

export default function DcrgLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {children}
    </>
  );
}
