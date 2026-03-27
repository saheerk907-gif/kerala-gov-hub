import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Articles — Kerala Govt Employees | KSR, MEDISEP, Pension',
  description: 'Kerala government employee articles on MEDISEP, pension, KSR service rules, GPF, NPS, DA, pay revision and benefits. In Malayalam and English.',
  path: '/articles',
  keywords: ['Kerala employees articles', 'MEDISEP articles Malayalam', 'pension articles Kerala', 'KSR service rules articles'],
});

export default function ArticlesLayout({ children }) { return children; }
