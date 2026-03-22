import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: '12th PRC Pay Calculator — Kerala Pay Revision 2024',
  description: 'Calculate your revised salary under 12th Pay Revision Commission. Fitment, DA, HRA, Net Pay — all in one calculator for Kerala government employees.',
  path: '/prc',
  keywords: ['12th PRC calculator Kerala', 'pay revision 2024 Kerala', 'Kerala salary calculator', 'fitment calculator Kerala', 'PRC 2024', '12th pay commission Kerala'],
});

export default function Layout({ children }) { return children; }
