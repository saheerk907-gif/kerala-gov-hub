import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Kerala Pension Calculator — Retirement Benefits',
  description: 'Calculate Kerala government employee pension, commutation, gratuity, and retirement benefits. Based on latest Kerala Service Rules.',
  path: '/pension',
  keywords: ['Kerala pension calculator', 'pension commutation', 'gratuity calculator', 'retirement benefits Kerala', 'പെൻഷൻ കണക്കുകൂട്ടൽ'],
});

export default function PensionLayout({ children }) {
  return children;
}
