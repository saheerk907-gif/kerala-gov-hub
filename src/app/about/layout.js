import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'About Us — Kerala Gov Employee Hub',
  description: 'Learn about Kerala Gov Employee Hub — an independent information portal for Kerala government employees covering KSR rules, MEDISEP, pension, salary calculators, and government orders.',
  path: '/about',
  keywords: ['about Kerala employees portal', 'Kerala government employee information', 'keralaemployees.in about'],
});

export default function Layout({ children }) { return children; }
