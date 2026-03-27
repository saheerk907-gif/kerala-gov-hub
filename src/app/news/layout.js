import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Kerala Govt Employee News – DA, Pension, MEDISEP Updates',
  description: 'Latest news for Kerala government employees — DA orders, pay revision, MEDISEP updates, pension circulars, bonus orders and government announcements.',
  path: '/news',
  keywords: ['Kerala government employee news', 'DA order Kerala', 'MEDISEP news', 'pension news Kerala', 'pay revision news', 'government circular Kerala'],
});

export default function NewsLayout({ children }) { return children; }
