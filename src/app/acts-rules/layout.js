import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Kerala Acts & Rules — Laws for Government Employees',
  description: 'Complete collection of Kerala Government Acts and Rules — Land Assignment Act, Kerala Service Rules, Labour Laws, Forest Act, Education Rules, Panchayat Raj Act and more.',
  path: '/acts-rules',
  keywords: ['Kerala acts rules', 'Kerala Land Assignment Act', 'Kerala Service Rules', 'Kerala Forest Act', 'Kerala Education Rules', 'Kerala Labour Laws', 'Kerala Panchayat Raj Act'],
});

export default function ActsLayout({ children }) { return children; }
