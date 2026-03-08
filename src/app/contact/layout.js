import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Contact Us — Kerala Gov Employee Hub',
  description: 'Get in touch with Kerala Gov Employee Hub. Send us your queries, suggestions, or feedback about Kerala government employee services, KSR rules, MEDISEP, pension, and more.',
  path: '/contact',
  keywords: ['contact Kerala employees portal', 'Kerala government employee help', 'keralaemployees.in contact'],
});

export default function Layout({ children }) { return children; }
