import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Kerala Service Rules (KSR) — Parts I, II, III',
  description: 'Complete Kerala Service Rules — leave rules, pay rules, pension rules, service conditions, and conduct rules. KSR Parts I, II, and III for government employees.',
  path: '/ksr',
  keywords: ['Kerala Service Rules', 'KSR Kerala', 'Kerala leave rules', 'KSR Part III pension', 'Kerala government service conditions', 'KSR pay rules'],
});

const ksrFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the Kerala Service Rules (KSR)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kerala Service Rules (KSR) is the statutory rulebook governing service conditions of Kerala state government employees — covering pay, leave, joining time, transfer, retirement, and disciplinary matters. Published by the Finance Department.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many parts does KSR have?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'KSR is divided into three parts: Part I (General Rules — pay, joining time, transfer, probation), Part II (Leave Rules), and Part III (Pension Rules).',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the probation period under KSR for Kerala government employees?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The probation period for most Kerala government posts is 2 years of duty under KSR. The appointing authority may extend it if performance is unsatisfactory.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is joining time under KSR?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Joining time is the time allowed for an employee to join a new post on transfer. The maximum joining time is 30 days, counted from the date of relief at the old post.',
      },
    },
  ],
};

export default function KsrLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ksrFaqJsonLd) }} />
      {children}
    </>
  );
}
