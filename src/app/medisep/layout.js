import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'MEDISEP — Kerala Government Health Insurance Scheme',
  description: 'Complete guide to MEDISEP health insurance for Kerala government employees. Eligibility, coverage, claim process, empanelled hospitals, and complaint procedures.',
  path: '/medisep',
  keywords: ['MEDISEP Kerala', 'Kerala government health insurance', 'MEDISEP claim process', 'MEDISEP hospitals list', 'MEDISEP eligibility', 'Kerala employee medical insurance'],
});

export default function Layout({ children }) { return children; }
