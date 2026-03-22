import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Disclaimer — Kerala Gov Employee Hub',
  description: 'Disclaimer for Kerala Gov Employee Hub. This is not an official Government of Kerala website. All information is for reference purposes only.',
  path: '/disclaimer',
  keywords: ['Kerala employees portal disclaimer', 'keralaemployees.in disclaimer', 'unofficial Kerala government portal'],
});

export default function Layout({ children }) { return children; }
