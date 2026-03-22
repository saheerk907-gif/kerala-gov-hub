import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Kerala Pension Calculator — Retirement Benefits',
  description: 'Calculate Kerala government employee pension, commutation, gratuity, and retirement benefits. Based on latest Kerala Service Rules.',
  path: '/pension',
  keywords: ['Kerala pension calculator', 'pension commutation', 'gratuity calculator', 'retirement benefits Kerala', 'പെൻഷൻ കണക്കുകൂട്ടൽ'],
});

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How is pension calculated for Kerala government employees?', acceptedAnswer: { '@type': 'Answer', text: 'Basic Pension = (50% × Average Emoluments ÷ 30) × Qualifying Service (in years). Maximum qualifying service is 30 years.' } },
    { '@type': 'Question', name: 'What is Average Emoluments (AE) in pension calculation?', acceptedAnswer: { '@type': 'Answer', text: 'Average Emoluments is the average of Basic Pay + DA drawn during the last 10 months before retirement.' } },
    { '@type': 'Question', name: 'What is the maximum qualifying service for pension?', acceptedAnswer: { '@type': 'Answer', text: 'Maximum qualifying service counted for pension is 30 years under KSR Part III.' } },
    { '@type': 'Question', name: 'What is pension commutation and when can it be restored?', acceptedAnswer: { '@type': 'Answer', text: 'Commutation allows taking a lump sum by surrendering up to 40% of monthly pension. It is restored after 12 years from retirement.' } },
    { '@type': 'Question', name: 'What is the retirement age for Kerala government employees?', acceptedAnswer: { '@type': 'Answer', text: 'The retirement age is 56 years. For teachers under superannuation, retirement is at the end of the academic term after turning 56.' } },
  ],
};

export default function PensionLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {children}
    </>
  );
}
