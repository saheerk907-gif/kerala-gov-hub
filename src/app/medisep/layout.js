import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'MEDISEP — Kerala Government Health Insurance Scheme',
  description: 'Complete guide to MEDISEP health insurance for Kerala government employees. Eligibility, coverage, claim process, empanelled hospitals, and complaint procedures.',
  path: '/medisep',
  keywords: ['MEDISEP Kerala', 'Kerala government health insurance', 'MEDISEP claim process', 'MEDISEP hospitals list', 'MEDISEP eligibility', 'Kerala employee medical insurance'],
});

const medisepFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Who is eligible for MEDISEP in Kerala?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All Kerala state government employees, pensioners, and their dependents are eligible for MEDISEP health insurance. Employees must be enrolled through their department drawing and disbursing officer (DDO).',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the coverage limit under MEDISEP?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MEDISEP covers hospitalisation expenses up to ₹3 lakh per annum per family. Critical illness cover is available up to ₹5 lakh under the enhanced scheme.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I file a MEDISEP cashless claim?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Present your MEDISEP card at an empanelled network hospital. The hospital verifies eligibility through the MEDISEP portal and initiates a pre-authorisation request. Treatment proceeds once approved. No upfront payment is required for covered procedures.',
      },
    },
    {
      '@type': 'Question',
      name: 'What documents are needed for MEDISEP reimbursement?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For reimbursement claims: original hospital bills, discharge summary, prescriptions, investigation reports, MEDISEP card copy, and a claim form signed by the DDO. Submit within 30 days of discharge.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is MEDISEP applicable for treatment outside Kerala?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MEDISEP cashless treatment is available only at empanelled hospitals within Kerala. For treatment outside Kerala, employees can file a reimbursement claim subject to approval by the concerned authority.',
      },
    },
  ],
};

export default function MedisepLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(medisepFaqJsonLd) }} />
      {children}
    </>
  );
}
