import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Privacy Policy — Kerala Gov Employee Hub',
  description: 'Privacy Policy of Kerala Gov Employee Hub. Understand how we collect, use, and protect information when you visit keralaemployees.in.',
  path: '/privacy-policy',
  keywords: ['Kerala employees portal privacy policy', 'keralaemployees.in privacy'],
});

export default function Layout({ children }) { return children; }
