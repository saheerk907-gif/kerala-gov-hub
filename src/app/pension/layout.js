import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Kerala Govt Pension Calculator 2026 – Calculate Basic Pension & Commutation',
  description: 'Kerala govt employee pension calculator 2026 — instantly calculate basic pension, DCRG, commutation value and family pension. Based on Kerala Service Rules (KSR) Part III.',
  path: '/pension',
  keywords: ['Kerala pension calculator', 'Kerala govt pension 2026', 'basic pension calculation', 'KSR Part III pension', 'pension commutation Kerala', 'DCRG calculator', 'family pension Kerala', 'retirement gratuity Kerala', 'പെൻഷൻ കണക്കുകൂട്ടൽ', 'കേരള സർക്കാർ പെൻഷൻ'],
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
    { '@type': 'Question', name: 'What is Normal Family Pension in Kerala?', acceptedAnswer: { '@type': 'Answer', text: 'Normal Family Pension = 30% of last emoluments (Basic Pay + DA). Minimum is ₹4,500/month and maximum is ₹17,960/month as per current rules.' } },
  ],
};

const softwareAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Kerala Pension Calculator',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  url: 'https://keralaemployees.in/pension',
  description: 'Calculate Kerala government employee Basic Pension, DCRG, Commutation Value and Family Pension based on KSR Part III rules.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function PensionLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }} />
      {children}
    </>
  );
}
