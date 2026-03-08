import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Kerala Service Rules (KSR) — Parts I, II, III',
  description: 'Complete Kerala Service Rules — leave rules, pay rules, pension rules, service conditions, and conduct rules. KSR Parts I, II, and III for government employees.',
  path: '/ksr',
  keywords: ['Kerala Service Rules', 'KSR Kerala', 'Kerala leave rules', 'KSR Part III pension', 'Kerala government service conditions', 'KSR pay rules'],
});

export default function Layout({ children }) { return children; }
