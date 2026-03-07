import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'NPS vs APS Comparison — Kerala Government Employees',
  description: 'Compare National Pension System (NPS) and Assured Pension Scheme (APS) for Kerala government employees. Benefits, contributions, and retirement corpus analysis.',
  path: '/nps-aps',
  keywords: ['NPS vs APS Kerala', 'Assured Pension Scheme Kerala', 'NPS APS comparison', 'Kerala pension scheme comparison'],
});

export default function NpsApsLayout({ children }) {
  return children;
}
