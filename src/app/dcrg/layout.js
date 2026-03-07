import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'DCRG Calculator — Death-cum-Retirement Gratuity Kerala',
  description: 'Calculate Death-cum-Retirement Gratuity (DCRG) for Kerala government employees. Based on latest rules under Kerala Service Rules.',
  path: '/dcrg',
  keywords: ['DCRG calculator Kerala', 'death cum retirement gratuity', 'retirement gratuity Kerala', 'DCRG കണക്കുകൂട്ടൽ'],
});

export default function DcrgLayout({ children }) {
  return children;
}
